"""BE-06 — Async Background Job Processing (FastAPI API).

POST /jobs         -> HTTP 202 immediately, job queued for the worker.
GET  /jobs/{job_id}-> current status, result, or error (404 for unknown).
"""

import logging

from fastapi import FastAPI, HTTPException

from . import config, jobs
from .queue import BackgroundQueue
from .worker import start_worker_thread

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="BE-06 — Async Background Job Processing",
    description=(
        "POST /jobs enqueues a background A6 AI job and returns 202 immediately. "
        "GET /jobs/{job_id} polls the status. SQLite-backed, in-process worker."
    ),
)

queue = BackgroundQueue()


@app.on_event("startup")
def on_startup() -> None:
    """Initialise storage and optionally start the in-process worker thread."""
    jobs.init_db()
    if config.RUN_WORKER:
        start_worker_thread(queue)
        logger.info("In-process worker thread enabled (RUN_WORKER=true)")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.post("/jobs", status_code=202)
def create_job(body: dict):
    """Enqueue a new background job and return 202 without waiting for A6.

    Expects a JSON body compatible with the A6 operation, e.g.
    {"text": "the content for the AI to process"}.
    """
    text = body.get("text")
    if not isinstance(text, str) or not text.strip():
        raise HTTPException(status_code=400, detail="'text' (non-empty string) is required")

    job = jobs.create_job(body)
    queue.enqueue(job["job_id"])
    logger.info("Job %s enqueued (queued)", job["job_id"])
    return {"job_id": job["job_id"], "status": job["status"]}


@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    """Return the job status, including result or error once final."""
    job = jobs.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    payload = {
        "job_id": job["job_id"],
        "status": job["status"],
        "attempts": job["attempts"],
    }
    if job["result"] is not None:
        payload["result"] = __import__("json").loads(job["result"])
    if job["error"] is not None:
        payload["error"] = job["error"]
    return payload

