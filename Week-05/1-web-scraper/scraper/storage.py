"""STRUCTURE: persist cleaned records in RAG-friendly formats.

Two outputs:
  1. quotes.jsonl  — one JSON object per line (standard RAG ingestion format)
  2. documents/*.md — one human-readable Markdown doc per record (RAG chunk)
"""

from __future__ import annotations

import json
from pathlib import Path

from . import config


def _slugify(text: str, max_len: int = 40) -> str:
    keep = "".join(c if c.isalnum() else "-" for c in text.lower())
    keep = "-".join(part for part in keep.split("-") if part)
    return keep[:max_len].rstrip("-")


class Storage:
    def __init__(self) -> None:
        self.jsonl_path: Path = config.JSONL_FILE
        self.md_dir: Path = config.MD_DIR
        self.jsonl_path.parent.mkdir(parents=True, exist_ok=True)
        self.md_dir.mkdir(parents=True, exist_ok=True)
        self.count = 0

    def save(self, record: dict) -> None:
        """Append one structured record to the JSONL corpus + write a Markdown doc."""
        # 1. JSONL
        with self.jsonl_path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")

        # 2. Markdown RAG doc
        slug = _slugify(record["text"])
        md_path = self.md_dir / f"{self.count:04d}-{slug}.md"
        md_path.write_text(self._to_markdown(record), encoding="utf-8")

        self.count += 1

    @staticmethod
    def _to_markdown(record: dict) -> str:
        tags = ", ".join(f"#{t}" for t in record["tags"]) if record["tags"] else ""
        about = record.get("author_about") or ""
        return (
            f"# {record['author']}\n\n"
            f"> {record['text']}\n\n"
            f"**Author:** {record['author']}\n\n"
            f"**About:** {about}\n\n"
            f"**Tags:** {tags}\n"
        )

    def summary(self) -> str:
        return (
            f"Saved {self.count} records\n"
            f"  JSONL: {self.jsonl_path}\n"
            f"  Markdown: {self.md_dir} ({self.count} docs)"
        )
