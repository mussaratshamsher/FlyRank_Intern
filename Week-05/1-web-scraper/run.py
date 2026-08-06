"""The Polite Scraper - CLI entry point.

Usage:
    python run.py [--max-pages N]
"""

from __future__ import annotations

import argparse

from scraper.pipeline import run


def main() -> None:
    parser = argparse.ArgumentParser(description="The Polite Scraper")
    parser.add_argument(
        "--max-pages",
        type=int,
        default=None,
        help="Maximum number of pages to crawl (default: from config)",
    )
    args = parser.parse_args()

    print("=== The Polite Scraper ===")
    summary = run(max_pages=args.max_pages)

    print("\n=== Summary ===")
    print(f"Pages crawled: {summary['pages_crawled']}")
    print(f"Records saved: {summary['records_saved']}")
    print("Politeness stats:", summary["stats"])


if __name__ == "__main__":
    main()
