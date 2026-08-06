"""CLEAN: normalise extracted fields into tidy, RAG-ready records.

Responsibilities:
  - strip HTML entities / smart quotes to plain text
  - collapse whitespace
  - normalise tags (lowercase, dedupe, sort)
  - drop records that are empty or too short to be useful
"""

from __future__ import annotations

import html
import re

_WS_RE = re.compile(r"\s+")


def _clean_text(value: str | None) -> str:
    if not value:
        return ""
    # Unescape HTML entities (e.g. " &amp; &#39;).
    value = html.unescape(value)
    # Collapse all whitespace runs into a single space.
    return _WS_RE.sub(" ", value).strip()


def _clean_tags(tags: list[str]) -> list[str]:
    seen: set[str] = set()
    cleaned: list[str] = []
    for tag in tags:
        t = _clean_text(tag).lower()
        if t and t not in seen:
            seen.add(t)
            cleaned.append(t)
    return sorted(cleaned)


def clean_record(record: dict) -> dict | None:
    """Return a cleaned copy of the record, or None if it should be dropped."""
    text = _clean_text(record.get("text"))
    author = _clean_text(record.get("author"))
    tags = _clean_tags(record.get("tags", []))

    # Drop records with no usable content.
    if len(text) < 5 or not author:
        return None

    return {
        "text": text,
        "author": author,
        "author_about": record.get("author_about"),
        "tags": tags,
    }


def clean_records(records: list[dict]) -> list[dict]:
    return [r for r in (clean_record(rec) for rec in records) if r is not None]
