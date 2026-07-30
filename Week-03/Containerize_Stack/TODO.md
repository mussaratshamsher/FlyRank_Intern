# Containerize Stack — Task List

## ✅ Completed Steps

- [x] Plan approved
- [x] Create `.gitignore`
- [x] Create `.env.example`
- [x] Create `Dockerfile`
- [x] Create `docker-compose.yml`
- [x] Create `init.sql`
- [x] Create `requirements.txt`
- [x] Create `app/__init__.py`
- [x] Create `app/config.py`
- [x] Create `app/postgres_repository.py`
- [x] Create `app/main.py`
- [x] Create `README.md`
- [x] All 11 files created

## 📝 To Run (requires Docker Desktop)

```bash
cd Week-03/Containerize_Stack
cp .env.example .env
docker compose up --build -d
```

## 🔍 Verify

```bash
curl http://localhost:8000/tasks
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title":"Test","done":false}'
```

