# Auth — Login & Protect (BE-03) — Progress Tracker

## Stage 0 — Setup Supabase & Server
- [x] Create `.gitignore`
- [x] Create `requirements.txt`
- [x] Create `app/__init__.py`
- [x] Create `app/config.py` (Supabase client init)
- [x] Create `app/main.py` (FastAPI app entry point)
- [x] Create `.env` template
- [ ] Set up real `.env` with Supabase credentials
- [ ] Install dependencies and verify server starts

## Stage 1 — Open Auth: Sign Up & Log In
- [ ] Create `app/auth.py` with signup/login routes
- [ ] Register auth router in `app/main.py`
- [ ] Test with curl

## Stage 2 — The Public & Protected Gates
- [ ] Add GET `/public/info` route
- [ ] Add GET `/protected/profile` (basic token extraction only)
- [ ] Test with curl

## Stage 3 — Token Verification
- [ ] Implement token verification via `supabase.auth.getUser()`
- [ ] Test valid/invalid tokens

## Stage 4 — Middleware Protection & Logout
- [ ] Create `app/middleware.py` with reusable dependency
- [ ] Apply middleware to protected routes
- [ ] Add POST `/auth/logout`
- [ ] Add GET `/protected/dashboard`
- [ ] Test with curl

## Stage 5 — Swagger UI Documentation
- [ ] Configure HTTPBearer security scheme
- [ ] Apply security to protected routes
- [ ] Verify Swagger UI at `/docs`

## Stage 6 — Publish to GitHub
- [ ] Initialize git repo
- [ ] Create README.md
- [ ] Push to GitHub

## ★ Stage 7 — Bonus: AI Rematch
- [ ] (Optional)
