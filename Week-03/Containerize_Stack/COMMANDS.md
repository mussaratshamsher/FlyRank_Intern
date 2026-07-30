# Containerize Stack — Ubuntu Terminal Commands

## 1. Navigate to the project

```bash
cd /mnt/d/Agentic-Hackthon/FlyRank_Intern/Week-03/Containerize_Stack
```

## 2. Create .env file (required before starting)

```bash
cp .env.example .env
```

## 3. Build and start the full stack

```bash
# Foreground (see logs in terminal)
docker compose up --build

# OR background (detached mode)
docker compose up --build -d
```

## 4. Verify the API is running

```bash
# List tasks (should return 3 seeded tasks)
curl http://localhost:8000/tasks

# Create a new task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "done": false}'

# Get task by ID
curl http://localhost:8000/tasks/4

# Update a task
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries and milk", "done": true}'

# Delete a task
curl -X DELETE http://localhost:8000/tasks/3
```

Open Swagger UI in browser: **http://localhost:8000/docs**

## 5. Prove Persistence

```bash
# Step A: Create some data
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Persistent task", "done": false}'

# Step B: Restart just the app container
docker compose restart app

# Step C: Verify data still exists
curl http://localhost:8000/tasks

# Step D: Full stack restart (volume preserved)
docker compose down
docker compose up -d

# Step E: Data should still be intact
curl http://localhost:8000/tasks
```

## 6. View logs

```bash
# App logs
docker compose logs -f app

# Database logs
docker compose logs -f db
```

## 7. Check running containers

```bash
docker compose ps
```

## 8. Check database health

```bash
docker exec taskdb pg_isready -U taskuser -d taskdb
```

## 9. Access the database directly

```bash
docker exec -it taskdb psql -U taskuser -d taskdb
```

Inside psql, you can run SQL queries:
```sql
SELECT * FROM tasks;
\q
```

## 10. Stopping the stack

```bash
# Stop containers (data persists in named volume)
docker compose down

# Stop AND delete volume (WARNING: destroys all data)
docker compose down -v
```

## Project Structure Reference

```
Week-03/Containerize_Stack/
├── .env.example           # Copy to .env and edit
├── .gitignore
├── Dockerfile             # App container image
├── docker-compose.yml     # App + Postgres together
├── init.sql               # Creates tasks table + seeds data
├── requirements.txt       # Python deps
├── README.md              # Full documentation
├── COMMANDS.md            # ← You are here
├── TODO.md
└── app/
    ├── __init__.py
    ├── config.py          # Reads DATABASE_URL from .env
    ├── main.py            # FastAPI app (routes unchanged)
    └── postgres_repository.py  # PostgreSQL CRUD implementation
```
</｜｜DSML｜｜parameter>
</｜｜DSML｜｜invoke>
</｜｜DSML｜｜tool_calls>
