"""
HTTP client for the AI Terms API.

This module provides a simple, readable client that communicates with the
FastAPI server purely over HTTP.  It never imports the API's internal
Python functions directly - every interaction happens through real
HTTP requests using the standard ``requests`` library.
"""

from typing import Any

import requests


class APIError(Exception):
    """Raised when the API returns an HTTP error status."""

    def __init__(self, message: str, status_code: int | None = None):
        self.status_code = status_code
        super().__init__(message)


class APIConnectionError(APIError):
    """Raised when the API server cannot be reached."""


class AIClient:
    """
    A small HTTP client that connects to the AI Terms API.

    Parameters
    ----------
    base_url : str
        Root URL of the running API (e.g. ``"http://localhost:8000"``).
    timeout : float
        Maximum number of seconds to wait for each HTTP response.
    """

    def __init__(self, base_url: str = "http://localhost:8000", timeout: float = 10.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    # -- internal helper -------------------------------------------------

    def _get(self, path: str) -> Any:
        """
        Perform an HTTP GET and return the parsed JSON response.

        Raises:
            APIConnectionError: if the server cannot be reached.
            APIError:           if the server returns a 4xx/5xx status code.
        """
        url = f"{self.base_url}{path}"
        try:
            response = requests.get(url, timeout=self.timeout)
        except requests.ConnectionError as exc:
            raise APIConnectionError(
                f"Could not connect to {url}: {exc}"
            ) from exc

        if response.status_code != 200:
            raise APIError(
                f"API returned status {response.status_code}: {response.text}",
                status_code=response.status_code,
            )

        return response.json()

    # -- public API ------------------------------------------------------

    def health_check(self) -> dict[str, Any]:
        """
        Hit ``GET /`` to verify the server is reachable and retrieve
        the list of available endpoints.
        """
        return self._get("/")

    def get_random_term(self) -> dict[str, str]:
        """
        Hit ``GET /term`` and return a random AI term with its definition.

        Returns a dict with keys ``"term"`` and ``"definition"``.
        """
        return self._get("/term")

    def get_dynamic_term(self) -> dict[str, str]:
        """
        Hit ``GET /term/dynamic`` to get a random AI term generated on-the-fly
        by the Groq LLM.

        Returns a dict with keys ``"term"`` and ``"definition"``.
        """
        return self._get("/term/dynamic")
