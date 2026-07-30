"""
SQLite database layer for the Task CRUD API.

Handles all database operations including connection management,
table creation, seeding sample data, and CRUD operations.
"""

import sqlite3
import os
from typing import Optional

# Database file path — stored alongside the application
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "..", "tasks.db")


def get_db() -> sqlite3.Connection:
    """
    Return a connection to the SQLite database.

    Enables:
      - Row access by column name (sqlite3.Row)
      - Foreign key enforcement (though not used yet)
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    """
    Initialise the database on application startup.

    Creates the database file and tasks table if they don't exist.
    Seeds the table with 3 sample tasks only if it is empty.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Create the tasks table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL
        )
        """
    )

    # Seed sample tasks only when the table is empty
    cursor.execute("SELECT COUNT(*) AS cnt FROM tasks")
    row = cursor.fetchone()
    if row["cnt"] == 0:
        sample_tasks = [
            ("Buy groceries", False),
            ("Read a book", True),
            ("Write code", False),
        ]
        cursor.executemany(
            "INSERT INTO tasks (title, done) VALUES (?, ?)",
            sample_tasks,
        )

    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# CRUD helpers
# ---------------------------------------------------------------------------


def fetch_all_tasks() -> list[dict]:
    """Return every task ordered by id."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, done FROM tasks ORDER BY id")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": row["id"], "title": row["title"], "done": bool(row["done"])} for row in rows]


def fetch_task_by_id(task_id: int) -> Optional[dict]:
    """Return a single task by its id, or None if not found."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, done FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return None
    return {"id": row["id"], "title": row["title"], "done": bool(row["done"])}


def create_task(title: str, done: bool = False) -> dict:
    """Insert a new task and return it with the generated id."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (title, done) VALUES (?, ?)",
        (title, done),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "title": title, "done": done}


def update_task(task_id: int, title: str, done: bool) -> bool:
    """
    Update an existing task.

    Returns True if a row was actually updated, False if the id was not found.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
        (title, done, task_id),
    )
    conn.commit()
    updated = cursor.rowcount > 0
    conn.close()
    return updated


def delete_task(task_id: int) -> bool:
    """
    Delete a task by its id.

    Returns True if a row was actually deleted, False otherwise.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted

