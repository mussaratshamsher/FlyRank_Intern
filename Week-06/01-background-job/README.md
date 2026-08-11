# BE-06 — Async Background Job Processing

## What BE-06 implements

BE-06 moves the slow **A6 AI operation** out of the HTTP request. Instead of
blocking the caller while the AI runs, `POST /jobs` creates a job, stores it in
SQLite with status `queued`, and returns **HTTP 202 immediately**. A small
background worker consumes queued jobs, executes the A6 operation, applies
automatic retries with exponential backoff, and records the result. The client
polls `GET /jobs/{job_id}` to read the final status, result, or error.

The design intentionally avoids over-engineering: **no Redis, Celery,
RabbitMQ, or Docker**. Persistence is plain SQLite, and the queue is a table
plus a single worker thread.

## Architecture / flow

```
Client                    API (FastAPI)                     SQLite             Worker
  |  POST /jobs |-------------->|  validate input              |                 |
  |     202      |<--------------|  create job (queued)  ---->|                 |
  |  immediately |  {job_id}     |  enqueue to queue           |                 |
  |              |              |                              |  claim (queued  |
  |              |              |------------------------------|-->running, claims+|
  |              |              |                              |  attempts+1)    |
  |  GET /jobs/id |------------>|  read job state      ------->|                 |
  |     200       |<-------------|  status/result/error        |  A6 operation   |
  |               |             |                              |  success?       |
  |               |             |  completed / failed  <-------|  or retry (backoff)
```

File layout:

- `app/jobs.py` — job model + SQLite storage + **idempotent** state transitions.
- `app/queue.py` — tiny background queue (atomic, single-consumer).
- `app/worker.py` — worker loop, the **A6 operation**, and retries/backoff.
- `app/main.py` — FastAPI endpoints.
- `tests/test_jobs.py` — test suite.

## Lifecycle

`queued → running → completed | failed`

A job is **retried** (silently returned to `queued`) when A6 fails, up to
`MAX_ATTEMPTS`. Once attempts are exhausted the job is permanently marked
`failed` with the last error logged loudly.

## Install and run

```bash
cd Weekk-06/01-background-job
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt

# Optional: configure settings
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux
```

## Start the API and worker

**Option A — single process (simplest).** The API auto-starts an in-process
worker thread on startup (`RUN_WORKER=true` by default):

```bash
uvicorn app.main:app --reload
```

**Option B — separate worker process.** Disable the in-process thread and run
the worker on its own:

```bash
# .env:  RUN_WORKER=false
uvicorn app.main:app --reload     # terminal 1: API
python -m app.worker              # terminal 2: worker
```

## Example usage

### POST /jobs

```bash
curl -X POST http://127.0.0.1:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"text": "Summer 2026 AI Engineering Internship at FlyRank!"}'
```

Response (HTTP 202 immediately — the request does **not** wait for A6):

```json
{"job_id": "0a2f3b4c-...", "status": "queued"}
```

### GET /jobs/{job_id}

```bash
curl http://127.0.0.1:8000/jobs/0a2f3b4c-...
```

Before processing:

```json
{"job_id": "0a2f3b4c-...", "status": "queued", "attempts": 0}
```

After completion:

```json
{
  "job_id": "0a2f3b4c-...",
  "status": "completed",
  "attempts": 1,
  "result": {"length": 45, "words": 7, "summary": "Summer 2026 ..."}
}
```

If a job permanently fails, an `error` field is present:

```json
{"job_id": "0a2f3b4c-...", "status": "failed", "attempts": 3,
 "error": "RuntimeError: ..."}
```

An unknown `job_id` returns **HTTP 404**.

## Tests

```bash
cd Weekk-06/01-background-job
pytest -q
```

Covered: 202-immediate + job_id, lifecycle `queued→completed`, result
persistence, GET status/result, 404 for unknown jobs, retry-on-failure, retry
exhaustion → `failed`, and idempotent duplicate worker execution.

## Retry & idempotency behavior

- **Retries:** failed A6 runs are retried up to `MAX_ATTEMPTS` (default 3)
  with exponential backoff `delay = BACKOFF_BASE * (2 ** (attempt - 1))`
  (defaults: 0.5s → 1.0s → 2.0s). `attempts` is stored on the job.
- **Exhaustion:** when `attempts` reaches `MAX_ATTEMPTS` the job is marked
  `failed` and a loud `PERMANENTLY FAILED` log line is emitted.
- **Idempotency:** the `job_id` is the idempotency key. The worker claims a job
  with an atomic conditional UPDATE (`WHERE status='queued'`), so concurrent
  workers can never process the same job twice. Completion is guarded by
  `WHERE status='running'`, so even if the worker receives a duplicate job it
  cannot double-complete or overwrite the first real result.

## Configuration (`app/config.py` / `.env`)

| Variable        | Default | Purpose                                          |
|-----------------|---------|--------------------------------------------------|
| `DATABASE_PATH` | `jobs.db` | SQLite database file                          |
| `MAX_ATTEMPTS`  | `3`       | Max attempts before a job is `failed`         |
| `BACKOFF_BASE`  | `0.5`     | Base retry delay (exponential backoff)        |
| `RUN_WORKER`    | `true`    | Auto-start in-process worker thread on startup|

## Assumptions

- The former A6 operation was removed from the repo, so a simple, deterministic,
  mockable **`a6_operation`** placeholder (simulating slow external AI work) was
  created in `app/worker.py`. In production this is swapped for the real AI/LLM
  call (injected as a function so it stays easy to test/mock).

