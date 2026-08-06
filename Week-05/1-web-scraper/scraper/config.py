"""Central configuration for the polite scraper.

All tunable knobs live here so politeness behaviour is explicit and easy to audit.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Target site (free, built for polite scraping practice)
# ---------------------------------------------------------------------------
BASE_URL = "https://quotes.toscrape.com"
INDEX_PATH = "/"
PAGE_PATTERN = "/page/{page}"          # /page/1, /page/2, ...
MAX_PAGES = 10                          # bound the crawl (respect the site)

# ---------------------------------------------------------------------------
# Identification (the "who are you" layer)
# ---------------------------------------------------------------------------
USER_AGENT = (
    "PoliteScraper/1.0 (+educational project; contact: student@example.com; "
    "a respectful crawler that honours robots.txt)"
)

# ---------------------------------------------------------------------------
# Rate limiting (the "slow down" layer) — seconds
# ---------------------------------------------------------------------------
REQUEST_DELAY = 1.0                     # min seconds between requests
TIMEOUT = 15.0                          # per-request timeout

# ---------------------------------------------------------------------------
# Retry / backoff (the "be robust, not abusive" layer)
# ---------------------------------------------------------------------------
MAX_RETRIES = 3
BACKOFF_BASE = 2.0                      # exponential backoff multiplier

# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
OUTPUT_DIR = Path("output")
JSONL_FILE = OUTPUT_DIR / "quotes.jsonl"
MD_DIR = OUTPUT_DIR / "documents"       # Markdown RAG-ready docs
