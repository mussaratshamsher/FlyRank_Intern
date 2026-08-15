# PDF Report Generator

A minimal Chainlit application that generates PDF reports through a background-job pipeline backed by Supabase PostgreSQL and Supabase Storage.

## Architecture

User → Chainlit → create job → background worker → query Supabase PostgreSQL → aggregate data → generate PDF (ReportLab) → upload PDF to Supabase Storage → update job status → show download link in Chainlit.

## Tech Stack

- Python
- Chainlit
- Supabase PostgreSQL
- Supabase Storage
- ReportLab
- python-dotenv

## Supabase Setup

1. Create a Supabase project (free tier).
2. Go to SQL Editor and run `schema.sql`.
3. **Important:** Disable Row Level Security so the app can write data:
   ```sql
   ALTER TABLE report_jobs DISABLE ROW LEVEL SECURITY;
   ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
   ```
4. Create a storage bucket named `reports` (private) in Supabase Storage.

## Environment Variables

Copy `.env.example` to `.env` and fill in values from your Supabase project Settings → Database.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DB_CONNECTION_STRING`

## Installation

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

> **Windows note:** If you get `Invalid value for '-d' / '--debug': 'release' is not a valid boolean`, it means a system `DEBUG=release` environment variable is interfering with Chainlit. Remove it via System Properties → Environment Variables, or run with `$env:DEBUG=$null; chainlit run app.py -w`.

## Run

**Important:** Do not use `.venv/bin/activate` on Windows. Use `.venv\Scripts\activate`.

Terminal 1 - Chainlit UI:
```bash
.venv\Scripts\activate
chainlit run app.py -w
```

Terminal 2 - Background worker:
```bash
.venv\Scripts\activate
python worker.py
```

Then open `http://localhost:8000` in your browser.

## How to test

1. Ensure Supabase tables exist (run `schema.sql` in Supabase SQL Editor).
2. Ensure storage bucket `reports` exists in Supabase Storage.
3. Open `http://localhost:8000`.
4. Type **generate** to create a new report.
5. Type **refresh &lt;job_id&gt;** to check progress (repeat until COMPLETED).
6. Once completed, click the **PDF** link to download and verify it contains summary statistics and monthly revenue table.

If a job fails, the error message will be shown in the chat.
