"""
Self-hosted MCP server for the FL-05 assignment.

Exposes three tools that chat alone cannot do:
  1. read_local_file   - read a real file from the local filesystem
  2. query_github_api  - query a live external service (GitHub public API)
  3. compute_sha256    - compute the SHA-256 hash of a real file's bytes

This implements the Model Context Protocol (MCP) "tools" primitive.
"""

import hashlib
import os
from pathlib import Path

import httpx
from mcp.server.fastmcp import FastMCP

# The server advertises itself as "portfolio-tools".
mcp = FastMCP("portfolio-tools")

# Limit file reads to the project directory for safety.
ALLOWED_ROOT = Path(__file__).resolve().parent


@mcp.tool()
def read_local_file(relative_path: str) -> str:
    """Read a text file from the local project directory.

    Args:
        relative_path: path relative to the project root, e.g. 'README.md'

    Returns:
        The file contents, or an error message if the file is missing / outside root.
    """
    target = (ALLOWED_ROOT / relative_path).resolve()
    if not str(target).startswith(str(ALLOWED_ROOT)):
        return "ERROR: path escapes the allowed project root."
    if not target.is_file():
        return f"ERROR: file not found: {relative_path}"
    return target.read_text(encoding="utf-8")


@mcp.tool()
def query_github_api(repo: str) -> str:
    """Query the live GitHub public API for a repository.

    Args:
        repo: repository in 'owner/name' form, e.g. 'mussaratshamsher/FlyRank_Intern'

    Returns:
        JSON summary of the repo (name, description, stars, language, pushed_at).
    """
    try:
        resp = httpx.get(
            f"https://api.github.com/repos/{repo}",
            headers={"Accept": "application/vnd.github+json"},
            timeout=15.0,
        )
        if resp.status_code != 200:
            return f"ERROR: GitHub API returned {resp.status_code}: {resp.text[:200]}"
        data = resp.json()
        return (
            f"repo: {data.get('full_name')}\n"
            f"description: {data.get('description')}\n"
            f"stars: {data.get('stargazers_count')}\n"
            f"language: {data.get('language')}\n"
            f"last_pushed: {data.get('pushed_at')}"
        )
    except Exception as exc:  # noqa: BLE001
        return f"ERROR: request failed: {exc}"


@mcp.tool()
def compute_sha256(relative_path: str) -> str:
    """Compute the SHA-256 hash of a real file's bytes.

    Args:
        relative_path: path relative to the project root, e.g. 'README.md'

    Returns:
        The hex SHA-256 digest of the file.
    """
    target = (ALLOWED_ROOT / relative_path).resolve()
    if not str(target).startswith(str(ALLOWED_ROOT)):
        return "ERROR: path escapes the allowed project root."
    if not target.is_file():
        return f"ERROR: file not found: {relative_path}"
    data = target.read_bytes()
    return hashlib.sha256(data).hexdigest()


if __name__ == "__main__":
    mcp.run()
