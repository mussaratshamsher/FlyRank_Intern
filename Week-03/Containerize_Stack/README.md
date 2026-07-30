# Week 03 — Containerize Stack

A task-management REST API backed by **PostgreSQL running in Docker**,
with the application and database started together via a single command.

## 🎯 Goal

Run Postgres in Docker, connect the app to it (swapping the SQLite store
for a Postgres repository), and start app + database together with one command.

## ✅ Architecture Prove-Out

This task demonstrates the payoff of clean layering:

> **Switching from SQLite to PostgreSQL changes exactly one import statement**
> in [`app/main.py`](app/main.py):
>
> ```python
> # SQLite version (Week 03 — Connecting Database):
> from app.database import ...
>
> # PostgreSQL version (this project):
> from app.postgres_repository import ...
> ```
>
> The route handlers, request/response models, validation logic, and HTTP
> status codes are **identical**. No service or route code was modified.

## 📁 Project Structure

```
Week-03/Containerize_Stack/
├── .env.example           # Template for the gitignored .env file
├── .gitignore
├── Dockerfile             # App container image
├── README.md
├── docker-compose.yml     # App + Postgres together
├── init.sql               # Table creation & sample data
├── requirements.txt       # Python dependencies
└── app/
    ├── __init__.py        # Package marker
    ├── config.py          # DATABASE_URL from .env
    ├── main.py            # FastAPI app & route definitions
    └── postgres_repository.py  # PostgreSQL CRUD implementation
```

## 🚀 How to Run

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### Step-by-step

```bash
# 1. Navigate to this directory
cd Week-03/Containerize_Stack

# 2. Create your .env file (copy from template)
cp .env.example .env

# 3. Start the full stack
docker compose up --build
```

The API will be available at **http://localhost:8000**.

Interactive docs at **http://localhost:8000/docs** (Swagger UI).

### Stopping

```bash
# Stop containers (data persists in volume)
docker compose down

# Stop containers AND delete the volume (warning: destroys data)
docker compose down -v
```

## 📡 API Endpoints

| Method   | Path             | Description              |
| -------- | ---------------- | ------------------------ |
| `GET`    | `/tasks`         | List all tasks           |
| `GET`    | `/tasks/{id}`    | Get a single task by ID  |
| `POST`   | `/tasks`         | Create a new task        |
| `PUT`    | `/tasks/{id}`    | Update an existing task  |
| `DELETE` | `/tasks/{id}`    | Delete a task            |

### Quick Smoke Test

```bash
# List tasks (should return 3 seeded tasks)
curl http://localhost:8000/tasks

# Create a new task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "done": false}'

# Get task by id
curl http://localhost:8000/tasks/4
```

## 🧪 Persistence Proof

Data persists across app restarts **and** container restarts because:

1. **Postgres volume** (`pgdata`) is defined as a named Docker volume, so data survives container removal.
2. The `init.sql` script only runs on first-ever database initialization (when the volume is empty).
3. App restarts (`docker compose restart app`) keep data intact.

### How to verify persistence

```bash
# 1. Start the stack
docker compose up --build -d

# 2. Create data
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Persistent task", "done": false}'

# 3. Restart the app container
docker compose restart app

# 4. Confirm data still exists
curl http://localhost:8000/tasks
# → The "Persistent task" you created is still there

# 5. Full stack restart (volume preserved)
docker compose down
docker compose up -d

# 6. Data still intact
curl http://localhost:8000/tasks
```

## 🔐 Environment Variables

| Variable       | Description                   | Default (from .env.example)                              |
| -------------- | ----------------------------- | -------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string  | `postgresql://taskuser:taskpass@db:5432/taskdb`          |

> **Note:** The `.env` file is **gitignored**. Never commit secrets.
> Always use `.env.example` as a template for new environments.

## 💡 Stretch Goals (Optional)

- **Add Redis** to `docker-compose.yml` (useful for Week 04 caching).
- **Add a database index** and show `EXPLAIN ANALYZE` before/after on a seeded table.

