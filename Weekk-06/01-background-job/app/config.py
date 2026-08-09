"""Application configuration loaded from environment variables."""

import os

from dotenv import load_dotenv

load_dotenv()

# SQLite database file location.
DATABASE_PATH: str = os.getenv("DATABASE_PATH", "jobs.db")

# Maximum attempts per job before it is permanently marked "failed".
MAX_ATTEMPTS: int = int(os.getenv("MAX_ATTEMPTS", "3"))

# Base delay (seconds) for exponential backoff:
#   delay = BACKOFF_BASE * (2 ** (attempt - 1))
BACKOFF_BASE: float = float(os.getenv("BACKOFF_BASE", "0.5"))

# When "true", the FastAPI app starts an in-process worker thread on startup.
# Set to "false" to disable it and run a standalone worker instead.
RUN_WORKER: bool = os.getenv("RUN_WORKER", "true").lower() in ("1", "true", "yes")

