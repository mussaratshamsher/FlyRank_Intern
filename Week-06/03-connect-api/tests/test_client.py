"""
Tests for Week-06/03-connect-api.

These tests verify that:
  - The AIClient sends real HTTP requests to a live API server.
  - The client correctly parses successful responses.
  - The client raises APIError on a 404.
  - The client raises APIConnectionError when the server is unreachable.

The API server is started automatically via a pytest fixture using
``uvicorn.Config`` in a background thread, so no manual setup is needed.
"""

import threading
import time

import pytest
import requests
import uvicorn

from client.api_client import AIClient, APIError, APIConnectionError


API_HOST = "127.0.0.1"
API_PORT = 8199
BASE_URL = f"http://{API_HOST}:{API_PORT}"


@pytest.fixture(scope="module")
def api_server():
    """Start the FastAPI app on a test port for the duration of the module."""
    from api.index import app  # imported here so the server starts fresh

    config = uvicorn.Config(app, host=API_HOST, port=API_PORT, log_level="warning")
    server = uvicorn.Server(config)

    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()

    # Wait until the server is ready to accept connections
    for _ in range(50):
        try:
            requests.get(f"{BASE_URL}/", timeout=1)
            break
        except requests.ConnectionError:
            time.sleep(0.1)

    yield BASE_URL

    server.should_exit = True
    thread.join(timeout=5)


@pytest.fixture
def client(api_server):
    return AIClient(base_url=api_server)


def test_health_check(client, api_server):
    """The client should successfully hit GET / and receive the welcome message."""
    response = client.health_check()

    assert response["message"] == "Welcome! This is a minimal FastAPI REST API."
    assert isinstance(response["endpoints"], list)
    assert {"method": "GET", "path": "/term"} in response["endpoints"]
    assert {"method": "GET", "path": "/term/dynamic"} in response["endpoints"]


def test_get_random_term(client, api_server):
    """The client should fetch a random term and verify the response structure."""
    response = client.get_random_term()

    assert "term" in response
    assert "definition" in response
    assert isinstance(response["term"], str)
    assert isinstance(response["definition"], str)
    assert len(response["term"]) > 0


def test_api_reachable_directly(client, api_server):
    """
    Confirm the client really uses HTTP by comparing its response
    with a raw requests call to the same endpoint.
    """
    term_from_client = client.get_random_term()
    term_from_raw = requests.get(f"{api_server}/term", timeout=5).json()

    # The API returns a random term, so we just verify the keys match
    assert set(term_from_client.keys()) == set(term_from_raw.keys())


def test_404_raises_api_error(client, api_server):
    """Hitting a non-existent endpoint should raise APIError with 404."""
    with pytest.raises(APIError) as exc_info:
        client._get("/nonexistent")
    assert exc_info.value.status_code == 404


def test_connection_error_when_server_down():
    """If the server is not reachable, APIConnectionError should be raised."""
    client = AIClient(base_url="http://127.0.0.1:99999", timeout=2)
    with pytest.raises(APIConnectionError):
        client.health_check()
