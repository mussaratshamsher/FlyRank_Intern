# BE-06 — Async Background Job Processing

## Step tracking

- [x] Explore repo & confirm approach (A6 recreated as simple, mockable operation)
- [x] `app/config.py` — DATABASE_PATH, MAX_ATTEMPTS, BACKOFF_BASE, RUN_WORKER
- [x] `app/jobs.py` — model + SQLite storage + idempotent state transitions
- [x] `app/queue.py` — atomic background queue over the jobs table
- [x] `app/worker.py` — worker loop, A6 operation, retries & backoff
- [x] `app/main.py` — POST /jobs (202) and GET /jobs/{job_id} (404 unknown)
- [x] `tests/test_jobs.py` — all required scenarios
- [x] `requirements.txt`, `.env.example`
- [x] `README.md`
- [x] Run full test suite and fix any failures  (11 passed)

