"""Focused tests for BE-06 background job processing.

A temporary database is used per-test, and the in-process worker the app
spawns on startup is disabled (RUN_WORKER=false) so the tests control job
processing explicitly with ``process_job``.
"""

import json
import os
import tempfile

import pytest
from fastapi.testclient import TestClient

from app import config
from app import jobs as job_store
from app import worker
from app.queue import BackgroundQueue


@pytest.fixture()
def client():
    """A TestClient against the API using an isolated temp database."""
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    config.DATABASE_PATH = path
    job_store.init_db()

    import app.main as main

    # Ensure the in-process worker thread is NOT auto-started here; tests
    # drive the worker manually via process_job().
    old_run_worker, config.RUN_WORKER = config.RUN_WORKER, False
    try:
        with TestClient(main.app) as test_client:
            yield test_client
    finally:
        config.RUN_WORKER = old_run_worker
        try:
            os.remove(path)
        except OSError:
            pass


def _queue_and_client(client):
    """Return the shared queue used by the app for this test client."""
    import app.main as main

    return main.queue


def _advance_worker(client):
    """Claim + process one queued job, i.e. one worker step."""
    worker.process_job(_queue_and_client(client), _queue_and_client(client).claim_next()["job_id"])


# ---------------------------------------------------------------------------
# POST /jobs
# ---------------------------------------------------------------------------


def test_post_jobs_returns_202_immediately(client):
    response = client.post("/jobs", json={"text": "hello world"})
    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "queued"


def test_post_jobs_returns_a_job_id(client):
    response = client.post("/jobs", json={"text": "hello world"})
    body = response.json()
    assert "job_id" in body
    assert len(body["job_id"]) > 0


def test_post_jobs_rejects_missing_text(client):
    response = client.post("/jobs", json={})
    assert response.status_code == 400


# ---------------------------------------------------------------------------
# Lifecycle + success
# ---------------------------------------------------------------------------


def test_job_status_changes_through_lifecycle(client):
    job_id = client.post("/jobs", json={"text": "abc"}).json()["job_id"]

    assert client.get(f"/jobs/{job_id}").json()["status"] == "queued"
    _advance_worker(client)
    # After one claim+process with default A6 it completes.
    assert client.get(f"/jobs/{job_id}").json()["status"] == "completed"


def test_successful_a6_stores_the_result(client, monkeypatch):
    captured = {}

    def fake_a6(payload):
        captured["payload"] = payload
        return {"greeting": "hi"}

    monkeypatch.setattr(worker, "a6_operation", fake_a6)
    job_id = client.post("/jobs", json={"text": "process me"}).json()["job_id"]

    _advance_worker(client)

    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "completed"
    assert body["result"] == {"greeting": "hi"}
    assert captured["payload"] == {"text": "process me"}


def test_get_job_returns_status_and_result(client, monkeypatch):
    monkeypatch.setattr(worker, "a6_operation", lambda p: {"ok": True})
    job_id = client.post("/jobs", json={"text": "x"}).json()["job_id"]
    _advance_worker(client)

    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "completed"
    assert body["result"] == {"ok": True}


def test_unknown_job_returns_404(client):
    response = client.get("/jobs/does-not-exist")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Retries
# ---------------------------------------------------------------------------


def test_failed_jobs_are_retried(client, monkeypatch):
    attempts = {"n": 0}

    def flaky_a6(payload):
        attempts["n"] += 1
        if attempts["n"] == 1:
            raise RuntimeError("boom")
        return {"ok": True}

    monkeypatch.setattr(worker, "a6_operation", flaky_a6)
    monkeypatch.setattr(config, "BACKOFF_BASE", 0.0)

    job_id = client.post("/jobs", json={"text": "retry me"}).json()["job_id"]

    _advance_worker(client)  # attempt 1 fails -> requeued
    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "queued"
    assert body["attempts"] == 1

    _advance_worker(client)  # attempt 2 succeeds
    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "completed"
    assert body["attempts"] == 2


def test_retry_exhaustion_marks_job_failed(client, monkeypatch):
    monkeypatch.setattr(
        worker, "a6_operation", lambda p: (_ for _ in ()).throw(RuntimeError("always"))
    )
    monkeypatch.setattr(config, "MAX_ATTEMPTS", 2)
    monkeypatch.setattr(config, "BACKOFF_BASE", 0.0)

    job_id = client.post("/jobs", json={"text": "fate"}).json()["job_id"]

    _advance_worker(client)  # attempt 1 -> requeued
    _advance_worker(client)  # attempt 2 -> attempts == MAX -> failed

    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "failed"
    assert body["attempts"] == 2
    assert "RuntimeError" in body["error"]


# ---------------------------------------------------------------------------
# Idempotency
# ---------------------------------------------------------------------------


def test_duplicate_worker_execution_is_idempotent(client, monkeypatch):
    """Re-running process_job for the same job must not double-complete."""
    monkeypatch.setattr(worker, "a6_operation", lambda p: {"value": 42})

    job_id = client.post("/jobs", json={"text": "once"}).json()["job_id"]

    # First (and only legitimate) completion.
    job = _queue_and_client(client).claim_next()
    worker.process_job(_queue_and_client(client), job["job_id"])
    assert client.get(f"/jobs/{job_id}").json()["status"] == "completed"
    first_result = client.get(f"/jobs/{job_id}").json()["result"]

    # The worker receives the job again (simulated duplicate delivery) and
    # tries to complete it a second time --- it must be a no-op.
    worker.process_job(_queue_and_client(client), job_id)

    body = client.get(f"/jobs/{job_id}").json()
    assert body["status"] == "completed"
    # Idempotency preserved: single result, no duplicate side effect.
    assert body["result"] == first_result

    # Only one completed job row should exist for this job (via result count).
    stored = job_store.get_job(job_id)
    assert stored["result"] == json.dumps({"value": 42}, sort_keys=True)


def test_worker_claim_is_single_winner(client, monkeypatch):
    """claim_next must never hand the same queued job to two workers."""
    monkeypatch.setattr(worker, "a6_operation", lambda p: {"ok": True})
    job_id = client.post("/jobs", json={"text": "atomic"}).json()["job_id"]

    first = _queue_and_client(client).claim_next()
    second = _queue_and_client(client).claim_next()
    assert first["job_id"] == job_id
    assert second is None

