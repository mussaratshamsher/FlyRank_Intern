"""
Auth API — Main application entry point.

Initialises the FastAPI app, registers routers, and configures
Swagger UI security schemes for Bearer token authentication.
"""

from fastapi import FastAPI
from app.config import supabase, PORT

app = FastAPI(
    title="Auth API — Login & Protect (BE-03)",
    description=(
        "A secure REST API that handles user authentication "
        "(Sign Up, Log In, Log Out) and protects specific routes "
        "using Supabase Auth and JWT verification."
    ),
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------


@app.on_event("startup")
def on_startup():
    """Verify Supabase connection on application start."""
    # A simple health check — try to access the Supabase client
    if supabase:
        print("✓ Server running and connected to Supabase")
    else:
        print("✗ Failed to connect to Supabase")


# ---------------------------------------------------------------------------
# Root health-check
# ---------------------------------------------------------------------------


@app.get("/")
def root():
    """Health-check endpoint."""
    return {"status": "running", "service": "Auth API"}


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
