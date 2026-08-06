# Week 05 · 1-web-scraper — The Polite Scraper

**Assignment:** Backend AI Engineering · Week 5 · Build · 6h

A scraper that collects pages from a practice site, extracts and cleans the useful
fields, and saves structured records — while behaving like a bot the site owner
would allow. The output becomes **Week 06's RAG corpus**.

## Pipeline

```
fetch -> parse -> extract -> clean -> structure
```

| Stage | Module | What it does |
|-------|--------|--------------|
| Fetch | `polite_client.py` | HTTP GET with robots.txt check, custom UA, rate limiting, retry/backoff |
| Parse | `parser.py` | Raw HTML → navigable DOM (BeautifulSoup + lxml) |
| Extract | `extractor.py` | Pulls quote text, author, author link, and tags from each card |
| Clean | `cleaner.py` | Unescapes entities, collapses whitespace, normalises/dedupes tags, drops empty records |
| Structure | `storage.py` | Saves JSONL records + Markdown RAG docs |

## The "Polite" Layer (professionalism)

1. **Robots.txt** — fetched and checked via `urllib.robotparser` before every request; disallowed paths are skipped.
2. **Identification** — a descriptive `User-Agent` (`PoliteScraper/1.0 ...`) so the site knows who we are and why.
3. **Rate limiting** — minimum 1s delay between requests (`REQUEST_DELAY`).
4. **Retry with backoff** — exponential backoff on 429 / 5xx / network errors, bounded retries.

## Tech Stack (free tier)

- **Python 3.10+**
- **httpx** — modern HTTP client
- **BeautifulSoup4 + lxml** — HTML parsing
- **urllib.robotparser** — robots.txt (standard library)

## Target Site

`https://quotes.toscrape.com` — a free practice site explicitly built for polite
scraping. No API key, no auth, robots.txt-compliant. Quote records (text, author,
tags) are ideal for a RAG corpus.

## How to Run

```bash
# 1. Navigate to the project folder
cd Week-05/1-web-scraper

# 2. (Recommended) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate    # Windows
source venv/bin/activate # macOS / Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the scraper
python run.py                # uses config defaults (MAX_PAGES)
python run.py --max-pages 3  # crawl only 3 pages
```

## Output

```
output/
├── quotes.jsonl          # one JSON record per line (RAG ingestion format)
└── documents/
    └── 0000-<slug>.md    # one readable Markdown doc per record
```

### Example record (JSONL)

```json
{"text": "The world as we have created it...", "author": "Albert Einstein",
 "author_about": "/author/Albert-Einstein", "tags": ["change", "deep-thoughts", "world"]}
```

## Files

| File | Purpose |
|------|---------|
| `run.py` | CLI entry point |
| `scraper/config.py` | All tunable knobs (UA, rate limit, page limit) |
| `scraper/polite_client.py` | Fetch + professionalism layer |
| `scraper/parser.py` | HTML parsing |
| `scraper/extractor.py` | Field extraction |
| `scraper/cleaner.py` | Field cleaning / normalisation |
| `scraper/storage.py` | JSONL + Markdown output |
| `scraper/pipeline.py` | Orchestrates the full pipeline |
| `TODO.md` | Progress tracker |

## Notes

- Output directory is gitignored (regenerated on each run).
- The polite layer is fully configurable in `scraper/config.py`.
- Build it well — Week 06's RAG ingestion consumes `output/quotes.jsonl`.
