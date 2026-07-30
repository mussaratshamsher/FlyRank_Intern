# Week 03 — Connecting Database

A task-management REST API that replaces the in-memory storage from Week 01 with a persistent **SQLite** database.

## Features

- Full CRUD for tasks (`GET`, `POST`, `PUT`, `DELETE`)
- Persistent storage via SQLite (`tasks.db`)
- Automatic database & table creation on startup
- Seeds three sample tasks on first run
- Input validation with appropriate HTTP status codes (`400` / `404`)

## Tech Stack

- **Python 3.10+**
- **FastAPI** — web framework
- **SQLite** (`sqlite3` — built-in, no extra install required)
- **Uvicorn** — ASGI server

## Database Location

The database file (`tasks.db`) is created automatically in the project root directory (`Week-03/Connecting_database/tasks.db`). It is **not** committed to version control.

## How to Run

```bash
# 1. Navigate to the project folder
cd Week-03/Connecting_database

# 2. (Recommended) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate    # Windows
source venv/bin/activate # macOS / Linux

# 3. Install dependencies
pip install -r api/requirements.txt

# 4. Start the server
uvicorn api.index:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.

Interactive docs at **http://localhost:8000/docs** (Swagger UI) or **http://localhost:8000/redoc**.

## API Endpoints

| Method   | Path             | Description              |
| -------- | ---------------- | ------------------------ |
| `GET`    | `/tasks`         | List all tasks           |
| `GET`    | `/tasks/{id}`    | Get a single task by ID  |
| `POST`   | `/tasks`         | Create a new task        |
| `PUT`    | `/tasks/{id}`    | Update an existing task  |
| `DELETE` | `/tasks/{id}`    | Delete a task            |

### Request / Response Examples

**Create a task:**

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn SQLite", "done": false}'
```

**Response:**

```json
{
  "id": 4,
  "title": "Learn SQLite",
  "done": false
}
```

## Example SQL Queries

The following queries are used internally by the application:

```sql
-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL
);

-- Insert a new task
INSERT INTO tasks (title, done) VALUES ('Buy groceries', 0);

-- Select all tasks
SELECT id, title, done FROM tasks ORDER BY id;

-- Select a single task by ID
SELECT id, title, done FROM tasks WHERE id = 1;

-- Update a task
UPDATE tasks SET title = 'Read two books', done = 1 WHERE id = 1;

-- Delete a task
DELETE FROM tasks WHERE id = 1;
```

## Project Structure

```
Week-03/Connecting_database/
├── README.md
├── vercel.json              # Vercel deployment config
├── tasks.db                 # SQLite database (auto-created, gitignored)
└── api/
    ├── __init__.py          # Package marker
    ├── database.py          # SQLite connection & CRUD helpers
    ├── index.py             # FastAPI app & route definitions
    └── requirements.txt     # Python dependencies
```

