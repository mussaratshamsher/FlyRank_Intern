"""FETCH + professionalism layer.

Handles robots.txt, identification, rate limiting, and retry-with-backoff so the
scraper behaves like a bot the site owner would allow.
"""

from __future__ import annotations

import time
import urllib.robotparser
from urllib.parse import urljoin

import httpx

from . import config


class PoliteClient:
    """An HTTP client that is transparent, slow, and respectful."""

    def __init__(self) -> None:
        self.base_url = config.BASE_URL
        self.user_agent = config.USER_AGENT
        self.delay = config.REQUEST_DELAY
        self.max_retries = config.MAX_RETRIES
        self.backoff_base = config.BACKOFF_BASE

        self._client = httpx.Client(
            headers={"User-Agent": self.user_agent},
            timeout=config.TIMEOUT,
            follow_redirects=True,
        )
        self.robots = self._load_robots()
        self._last_request_at = 0.0

        # Crawl log / stats shared with the pipeline.
        self.stats = {
            "robots_checked": True,
            "robots_allows_crawl": True,
            "requests": 0,
            "retries": 0,
            "skipped_by_robots": 0,
        }

    # ------------------------------------------------------------------
    # Robots.txt
    # ------------------------------------------------------------------
    def _load_robots(self) -> urllib.robotparser.RobotFileParser:
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(urljoin(self.base_url, "/robots.txt"))
        try:
            rp.read()
        except Exception:
            # Be liberal if robots.txt is unreachable: cache-able default.
            rp = urllib.robotparser.RobotFileParser()
            rp.set_url(urljoin(self.base_url, "/robots.txt"))
        return rp

    def can_fetch(self, path: str) -> bool:
        url = urljoin(self.base_url, path)
        return self.robots.can_fetch(self.user_agent, url)

    # ------------------------------------------------------------------
    # Rate limiting
    # ------------------------------------------------------------------
    def _pace(self) -> None:
        elapsed = time.time() - self._last_request_at
        wait = max(0.0, self.delay - elapsed)
        if wait > 0:
            time.sleep(wait)

    # ------------------------------------------------------------------
    # Fetch with retry/backoff
    # ------------------------------------------------------------------
    def get(self, path: str) -> httpx.Response:
        """Fetch a path, respecting robots.txt, rate limit, and backoff."""
        if not self.can_fetch(path):
            self.stats["skipped_by_robots"] += 1
            raise PermissionError(f"robots.txt disallows: {path}")

        self._pace()

        last_exc: Exception | None = None
        for attempt in range(self.max_retries):
            try:
                resp = self._client.get(urljoin(self.base_url, path))
                self.stats["requests"] += 1
                self._last_request_at = time.time()

                if resp.status_code == 200:
                    return resp

                # Retry on 429 (rate limited) and 5xx (server errors).
                if resp.status_code in (429,) or resp.status_code >= 500:
                    self.stats["retries"] += 1
                    self._backoff(attempt)
                    continue

                resp.raise_for_status()
            except httpx.HTTPError as exc:
                last_exc = exc
                self.stats["retries"] += 1
                self._backoff(attempt)

        raise RuntimeError(f"Failed to fetch {path} after retries: {last_exc}")

    def _backoff(self, attempt: int) -> None:
        time.sleep(self.backoff_base ** (attempt + 1))

    def close(self) -> None:
        self._client.close()
