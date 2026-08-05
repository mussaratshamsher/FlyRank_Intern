"""
Configuration — Supabase client initialisation.

Loads environment variables and exposes a single `supabase` client
instance that the rest of the application can import.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
PORT: int = int(os.getenv("PORT", "8000"))

# Validate that credentials are present
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_KEY must be set in the .env file."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
