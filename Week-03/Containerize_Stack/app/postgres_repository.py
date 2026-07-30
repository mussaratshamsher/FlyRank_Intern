"""
PostgreSQL repository for the Task CRUD API.

Implements the same interface as the SQLite database layer
(applies to: init_db, fetch_all_tasks, fetch_task_by_id,
 create_task, update_task, delete_task).

Switching from SQLite to Postgres requires changing ONLY the
import statement in main.py — routes and handlers stay identical.
"""

import psycopg2
import psycopg2.extras
from typing import Optional

from app.config import DATABASE_URL


def get_db() -> psycopg2.extensions.connection:
    """Return a connection to the PostgreSQL database."""
    conn = psycopg2.connect(DATABASE_URL)
    return conn


def init_db() -> None:
    """
    Initialise the database on application startup.

    Creates the tasks table if it does not exist.
    Seeds the table with 3 sample tasks only if it is empty.
    """
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
        """
    )

    # Seed sample tasks only when the table is empty
    cursor.execute("SELECT COUNT(*) AS cnt FROM tasks")
    row = cursor.fetchone()
    if row[0] == 0:
        sample_tasks = [
            ("Buy groceries", False),
            ("Read a book", True),
            ("Write code", False),
        ]
        cursor.executemany(
            "INSERT INTO tasks (title, done) VALUES (%s, %s)",
            sample_tasks,
        )

    conn.commit()
    cursor.close()
    conn.close()


# ---------------------------------------------------------------------------
# CRUD helpers
# ---------------------------------------------------------------------------


def fetch_all_tasks() -> list[dict]:
    """Return every task ordered by id."""
    conn = get_db()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT id, title, done FROM tasks ORDER BY id")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [
        {"id": row["id"], "title": row["title"], "done": bool(row["done"])}
        for row in rows
    ]


def fetch_task_by_id(task_id: int) -> Optional[dict]:
    """Return a single task by its id, or None if not found."""
    conn = get_db()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT id, title, done FROM tasks WHERE id = %s", (task_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None:
        return None
    return {"id": row["id"], "title": row["title"], "done": bool(row["done"])}


def create_task(title: str, done: bool = False) -> dict:
    """Insert a new task and return it with the generated id."""
    conn = get_db()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(
        "INSERT INTO tasks (title, done) VALUES (%s, %s) RETURNING id, title, done",
        (title, done),
    )
    row = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": row["id"], "title": row["title"], "done": bool(row["done"])}


def update_task(task_id: int, title: str, done: bool) -> bool:
    """
    Update an existing task.

    Returns True if a row was actually updated, False if the id was not found.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tasks SET title = %s, done = %s WHERE id = %s",
        (title, done, task_id),
    )
    conn.commit()
    updated = cursor.rowcount > 0
    cursor.close()
    conn.close()
    return updated


def delete_task(task_id: int) -> bool:
    """
    Delete a task by its id.

    Returns True if a row was actually deleted, False otherwise.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    cursor.close()
    conn.close()
    return deleted

