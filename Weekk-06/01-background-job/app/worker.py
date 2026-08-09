"""Background worker: consumes queued jobs, runs the A6 AI operation, retries.

The A6 operation lives here so it is trivially monkeypatched in tests; it
stands in for a real, slow, external AI/LLM call.
"""

import json
import logging
import threading
import time

from . import config, jobs
from .queue import BackgroundQueue

logger = logging.getLogger(__name__)


def a6_operation(payload: dict) -> dict:
    """Execute the A6 AI operation on the given input payload.

    Placeholder for the real, slow AI backend. It stands in for an external
    AI/LLM call, sleeps to simulate latency, and returns a deterministic
    result. Tests monkeypatch this function to test success/retry paths.
    """
    text = payload.get("text", "")
    time.sleep(0.1)  # simulate the slow part of the real AI operation
    words = len(text.split())
    return {"length": len(text), "words": words, "summary": text}


def process_job(queue: BackgroundQueue, job_id: str) -> None:
    """Run the A6 operation for one claimed job and record its outcome."""
    job = jobs.get_job(job_id)
    if job is None:
        logger.warning("Job %s disappeared before processing; skipping", job_id)
        return

    payload = json.loads(job["input"])
    try:
        result = a6_operation(payload)
    except Exception as exc:  # noqa: BLE001 - any A6 failure is retryable
        error = f"{type(exc).__name__}: {exc}"
        if job["attempts"] >= config.MAX_ATTEMPTS:
            jobs.mark_failed(job_id, error)
            logger.error(
                "Job %s PERMANENTLY FAILED after %s attempts: %s",
                job_id, job["attempts"], error,
            )
        else:
            jobs.requeue_for_retry(job_id, error)
            delay = config.BACKOFF_BASE * (2 ** (job["attempts"] - 1))
            logger.warning(
                "Job %s A6 failed on attempt %s/%s; retrying in %.1fs: %s",
                job_id, job["attempts"], config.MAX_ATTEMPTS, delay, error,
            )
            time.sleep(delay)
        return

    if jobs.mark_completed(job_id, result):
        logger.info("Job %s completed", job_id)
    else:
        # Idempotency guard hit: the job was already completed/failed, so the
        # duplicate result is intentionally dropped.
        logger.warning(
            "Job %s no longer 'running' when result was ready; duplicate result dropped",
            job_id,
        )


def _consume_forever(queue: BackgroundQueue, stop_event: threading.Event) -> None:
    """Poll the queue and process jobs until asked to stop."""
    logger.info(
        "Background worker started (max_attempts=%s, backoff_base=%s)",
        config.MAX_ATTEMPTS, config.BACKOFF_BASE,
    )
    while not stop_event.is_set():
        try:
            job = queue.claim_next()
        except Exception:  # noqa: BLE001 - keep the loop alive on transient DB errors
            logger.exception("Worker claim error; pausing")
            time.sleep(0.5)
            continue
        if job is None:
            time.sleep(0.2)
            continue
        process_job(queue, job["job_id"])


def start_worker_thread(queue: BackgroundQueue) -> threading.Thread:
    """Start the in-process daemon worker thread."""
    stop_event = threading.Event()
    thread = threading.Thread(
        target=_consume_forever,
        args=(queue, stop_event),
        name="be06-worker",
        daemon=True,
    )
    thread.start()
    return thread


def run_worker_cli() -> None:
    """Standalone worker process entrypoint: ``python -m app.worker``."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    jobs.init_db()
    _consume_forever(BackgroundQueue(), threading.Event())


if __name__ == "__main__":
    run_worker_cli()

