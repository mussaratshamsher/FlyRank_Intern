"""PARSE: turn raw HTML into a navigable DOM (BeautifulSoup)."""

from __future__ import annotations

from bs4 import BeautifulSoup


def parse_html(html: str) -> BeautifulSoup:
    """Parse raw HTML into a BeautifulSoup object using the fast lxml parser."""
    return BeautifulSoup(html, "lxml")


def find_quote_cards(soup: BeautifulSoup) -> list:
    """Return every quote card element on the page."""
    return soup.select("div.quote")
