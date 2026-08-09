"""Job model, SQLite storage, and state transitions for BE-06.

A single job row tracks: job_id, input, status, result, error, attempts,
created_at, updated_at. Every transition is performed with a conditional
UPDATE so worker actions are idempotent --- a job can only ever be completed
or permanently failed once, no matter how many times the worker reaches it.
"""

import json
import sqlite3
import uuid
from datetime import datetime, timezone

from . import config

# Busy timeout used when the API and worker touch the same SQLite file.
TIMEOUT = 5.0

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
    job_id     TEXT PRIMARY KEY,
    input      TEXT NOT NULL,
    status     TEXT NOT NULL,
    result     TEXT,
    error      TEXT,
    attempts   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
"""


def _connect() -> sqlite3.Connection:
    """Open a fresh SQLite connection.

    ``isolation_level=None`` puts the connection in autocommit mode so every
    statement is atomic on its own, which is exactly what we need for safe,
    idempotent state transitions.
    """
    conn = sqlite3.connect(config.DATABASE_PATH, isolation_level=None, timeout=TIMEOUT)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn


def now() -> str:
    """Return an ISO-8601 UTC timestamp string for created_at/updated_at."""
    return datetime.now(timezone.utc).isoformat()


def init_db() -> None:
    """Create the jobs table if it does not already exist."""
    conn = _connect()
    conn.execute(SCHEMA)
    conn.close()


def create_job(input_payload: dict) -> dict:
    """Insert a new queued job and return its stored row."""
    job_id = str(uuid.uuid4())
    ts = now()
    conn = _connect()
    conn.execute(
        "INSERT INTO jobs (job_id, input, status, result, error, attempts, created_at, updated_at) "
        "VALUES (?, ?, ?, NULL, NULL, 0, ?, ?)",
        (job_id, json.dumps(input_payload, sort_keys=True), "queued", ts, ts),
    )
    conn.close()
    return get_job(job_id)


def get_job(job_id: str):
    """Return the job as a dict, or None if the job_id is unknown."""
    conn = _connect()
    row = conn.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,)).fetchone()
    conn.close()
    return dict(row) if row is not None else None


def mark_completed(job_id: str, result: dict) -> bool:
    """Mark a running job completed. Returns False iff it was already done.

    The ``WHERE status='running'`` guard makes duplicate completion a no-op,
    preserving the first (real) result --- this is the idempotency key.
    """
    conn = _connect()
    cur = conn.execute(
        "UPDATE jobs SET status='completed', result=?, error=NULL, updated_at=? "
        "WHERE job_id=? AND status='running'",
        (json.dumps(result, sort_keys=True), now(), job_id),
    )
    conn.close()
    return cur.rowcount == 1


def requeue_for_retry(job_id: str, error: str) -> None:
    """Send a failed-running job back to 'queued' for another attempt."""
    conn = _connect()
    conn.execute(
        "UPDATE jobs SET status='queued', error=?, updated_at=? "
        "WHERE job_id=? AND status='running'",
        (error, now(), job_id),
    )
    conn.close()


def mark_failed(job_id: str, error: str) -> None:
    """Permanently mark a running job as 'failed' (retries exhausted)."""
    conn = _connect()
    conn.execute(
        "UPDATE jobs SET status='failed', error=?, updated_at=? "
        "WHERE job_id=? AND status='running'",
        (error, now(), job_id),
    )
    conn.close()

