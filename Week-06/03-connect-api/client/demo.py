"""
Demo runner - the user-facing entry point for this assignment.

It creates an :class:`AIClient`, sends real HTTP requests to the API,
and prints the results in a friendly format.

Usage
-----
From the project root (``Week-06/03-connect-api``)::

    python -m client.demo
    # or
    python client/demo.py

Make sure the API server is running first (see README for details).
"""

import sys

from client.api_client import AIClient, APIError, APIConnectionError


def main() -> int:
    client = AIClient()

    # ------------------------------------------------------------------ #
    # 1. Health check  ->  GET /
    # ------------------------------------------------------------------ #
    print("Connecting to the AI Terms API ...")
    try:
        health = client.health_check()
    except APIConnectionError:
        print("ERROR: Could not connect to the API. Is it running?")
        print("       Start it with:  python -m uvicorn api.index:app --reload")
        return 1
    except APIError as exc:
        print(f"ERROR: API responded with an error: {exc}")
        return 1

    print(f"  Server says: {health['message']}")
    print(f"  Available endpoints: {health['endpoints']}")
    print()

    # ------------------------------------------------------------------ #
    # 2. Fetch a static random term  ->  GET /term
    # ------------------------------------------------------------------ #
    print("Fetching a random AI term (from cached list) ...")
    try:
        term_data = client.get_random_term()
    except APIError as exc:
        print(f"ERROR: Could not retrieve static term: {exc}")
        return 1

    print(f"  Term:       {term_data['term']}")
    print(f"  Definition: {term_data['definition']}")
    print()

    # ------------------------------------------------------------------ #
    # 3. Fetch a dynamically generated term  ->  GET /term/dynamic
    # ------------------------------------------------------------------ #
    print("Fetching a dynamically generated AI term (via Groq) ...")
    try:
        dynamic_data = client.get_dynamic_term()
    except APIConnectionError:
        print("  Server unreachable - skipping dynamic term.")
        return 1
    except APIError as exc:
        print(f"  ERROR: Could not retrieve dynamic term: {exc}")
        return 1

    print(f"  Term:       {dynamic_data['term']}")
    print(f"  Definition: {dynamic_data['definition']}")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
