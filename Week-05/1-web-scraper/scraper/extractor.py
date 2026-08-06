"""EXTRACT: pull useful fields out of each quote card.

Target site structure (quotes.toscrape.com):
    <div class="quote">
        <span class="text">"Quote text"</span>
        <span>by <small class="author">Author Name</small>
            <a href="/author/...">(about)</a>
        </span>
        <div class="tags">
            <a class="tag" href="/tag/...">tag</a> ...
        </div>
    </div>
"""

from __future__ import annotations

from bs4 import BeautifulSoup, Tag


def extract_quote(card: Tag) -> dict | None:
    """Extract a single quote record from a quote card element."""
    text_el = card.select_one("span.text")
    author_el = card.select_one("small.author")
    about_el = card.select_one("a[href^='/author/']")
    tag_els = card.select("a.tag")

    if text_el is None or author_el is None:
        return None

    return {
        "text": text_el.get_text(strip=True),
        "author": author_el.get_text(strip=True),
        "author_about": about_el["href"] if about_el else None,
        "tags": [tag.get_text(strip=True) for tag in tag_els],
    }


def extract_all(cards: list[Tag]) -> list[dict]:
    """Extract records from every card, dropping malformed ones."""
    return [rec for rec in (extract_quote(c) for c in cards) if rec is not None]
