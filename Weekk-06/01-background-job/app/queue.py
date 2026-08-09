"""Tiny background queue backed by the jobs table (SQLite).

The worker claims queued jobs with an atomic conditional UPDATE, so even if
two workers ever run they can never claim the same job twice. Normally the
app consumes the queue with a single in-process daemon thread; no external
infrastructure (Redis, Celery, RabbitMQ) is required.
"""

import sqlite3
import threading

from . import config, jobs

TIMEOUT = jobs.TIMEOUT


class BackgroundQueue:
    """A minimal single-consumer queue that reuses the jobs table."""

    def __init__(self) -> None:
        self._lock = threading.Lock()

    def enqueue(self, job_id: str) -> None:
        """The job is already stored as 'queued' in the table.

        Kept as a tiny named step so the POST /jobs flow reads clearly.
        """
        return None

    def claim_next(self):
        """Atomically claim one queued job (queued -> running).

        Returns the claimed job dict, or None when the queue is empty.
        The atomic ``WHERE status='queued'`` guard guarantees the same job
        is only claimed once even under concurrent workers.
        """
        with self._lock:
            conn = sqlite3.connect(
                config.DATABASE_PATH, isolation_level=None, timeout=TIMEOUT
            )
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                "SELECT * FROM jobs WHERE status='queued' ORDER BY created_at LIMIT 1"
            ).fetchone()
            if row is None:
                conn.close()
                return None
            job = dict(row)
            conn.execute(
                "UPDATE jobs SET status='running', attempts=attempts + 1, updated_at=? "
                "WHERE job_id=? AND status='queued'",
                (jobs.now(), job["job_id"]),
            )
            conn.close()
            return job

