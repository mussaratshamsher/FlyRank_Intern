"""ORCHESTRATE the full pipeline: fetch -> parse -> extract -> clean -> structure."""

from __future__ import annotations

from . import config
from .cleaner import clean_records
from .extractor import extract_all
from .parser import find_quote_cards, parse_html
from .polite_client import PoliteClient
from .storage import Storage


def run(max_pages: int | None = None) -> dict:
    """Crawl the practice site and save structured records.

    Returns a summary dict with crawl stats.
    """
    max_pages = max_pages or config.MAX_PAGES
    client = PoliteClient()
    storage = Storage()

    try:
        for page in range(1, max_pages + 1):
            path = config.INDEX_PATH if page == 1 else config.PAGE_PATTERN.format(page=page)

            try:
                resp = client.get(path)
            except PermissionError:
                print(f"[robots] skipped {path} (disallowed)")
                break
            except RuntimeError as exc:
                print(f"[error] {exc}")
                break

            soup = parse_html(resp.text)
            cards = find_quote_cards(soup)

            if not cards:
                print(f"[done] no more content on page {page}")
                break

            extracted = extract_all(cards)
            cleaned = clean_records(extracted)
            for record in cleaned:
                storage.save(record)

            print(f"[ok] page {page}: {len(cards)} cards -> {len(cleaned)} records")

        return {
            "pages_crawled": page,
            "records_saved": storage.count,
            "stats": client.stats,
        }
    finally:
        client.close()
