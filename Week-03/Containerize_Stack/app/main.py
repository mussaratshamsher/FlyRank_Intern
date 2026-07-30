"""
Task CRUD API — Containerized Stack (Week 03).

Replaces the SQLite storage of Week 03 with a PostgreSQL backend.
All external API contracts (endpoints, request bodies, response formats,
HTTP status codes) remain identical to the original specification.

Architecture prove-out: Only the import line changes from the SQLite version.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.postgres_repository import (  # <-- the ONE change: swap repository
    init_db,
    fetch_all_tasks,
    fetch_task_by_id,
    create_task,
    update_task,
    delete_task,
)

app = FastAPI(
    title="Task CRUD API — PostgreSQL Backend (Docker)",
    description="A task-management REST API backed by PostgreSQL running in Docker.",
)


# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------


@app.on_event("startup")
def on_startup():
    """Initialise the database and seed sample data on application start."""
    init_db()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/tasks")
def list_tasks():
    """Return every task stored in the database."""
    return fetch_all_tasks()


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    """Return a single task by its id, or 404 if it does not exist."""
    task = fetch_task_by_id(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks")
def add_task(body: dict):
    """
    Create a new task.

    Expects a JSON body with:
      - title (str, required)
      - done  (bool, optional, defaults to False)
    """
    title = body.get("title")
    if not title or not isinstance(title, str) or not title.strip():
        raise HTTPException(status_code=400, detail="Title is required")

    done = body.get("done", False)
    if not isinstance(done, bool):
        raise HTTPException(status_code=400, detail="'done' must be a boolean")

    task = create_task(title.strip(), done)
    return {"id": task["id"], "title": task["title"], "done": task["done"]}


@app.put("/tasks/{task_id}")
def edit_task(task_id: int, body: dict):
    """
    Update an existing task.

    Expects a JSON body with:
      - title (str, required)
      - done  (bool, required)
    """
    title = body.get("title")
    if not title or not isinstance(title, str) or not title.strip():
        raise HTTPException(status_code=400, detail="Title is required")

    done = body.get("done")
    if not isinstance(done, bool):
        raise HTTPException(status_code=400, detail="'done' must be a boolean")

    updated = update_task(task_id, title.strip(), done)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"id": task_id, "title": title.strip(), "done": done}


@app.delete("/tasks/{task_id}")
def remove_task(task_id: int):
    """Delete a task by its id. Returns 404 if the task does not exist."""
    deleted = delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return JSONResponse(content={"message": "Task deleted"}, status_code=200)

