"""
MCP client for the FL-05 assignment.

Connects to the self-hosted MCP server over Stdio, lists the available tools,
then runs three tasks that chat alone could not do:
  1. read a local file
  2. query a live service (GitHub API)
  3. compute a real file hash

Each call prints the tool name and its output so the evidence shows tool use,
not plain chat.
"""

import asyncio
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main() -> None:
    # 1. Connect the client to the server over Stdio.
    # Use the same interpreter that runs this client so the MCP server
    # subprocess uses the same venv (where mcp is installed).
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["mcp_server.py"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # Prove the connection lists real tools (not plain chat).
            tools = await session.list_tools()
            print("=== CONNECTED: MCP tools available ===")
            for tool in tools.tools:
                print(f"  - {tool.name}: {tool.description.splitlines()[0]}")
            print()

            # --- Task 1: read a local file ---
            print("=== TASK 1: read a local file ===")
            r1 = await session.call_tool("read_local_file", {"relative_path": "README.md"})
            print("tool: read_local_file(README.md)")
            print("output:", r1)
            print()

            # --- Task 2: query a live external service ---
            print("=== TASK 2: query a live external service ===")
            r2 = await session.call_tool(
                "query_github_api", {"repo": "mussaratshamsher/FlyRank_Intern"}
            )
            print("tool: query_github_api(mussaratshamsher/FlyRank_Intern)")
            print("output:", r2)
            print()

            # --- Task 3: compute a real file hash ---
            print("=== TASK 3: compute a real file hash ===")
            r3 = await session.call_tool("compute_sha256", {"relative_path": "README.md"})
            print("tool: compute_sha256(README.md)")
            print("output:", r3)
            print()

            print("=== DONE: three tool calls completed (not plain chat) ===")


if __name__ == "__main__":
    asyncio.run(main())
