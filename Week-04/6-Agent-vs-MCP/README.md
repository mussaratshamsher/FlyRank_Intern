# Week 04 · 6-Agent-vs-MCP — Agent Concepts and MCP Basics

**Assignment:** FL-05 · Build (core) · 5h · General AI Fluency Track

## Deliverables
1. **Explainer (600–900 words)** — what an agent is, what MCP is, and what my FL-04 workflow would need to become an agent.
2. **Evidence of one working MCP/connector setup** — three tasks run through real tool calls (not plain chat).

## The MCP connector (self-hosted, free)
Because no MCP server was pre-connected in this environment, I built a **self-hosted Python MCP server + client** (the assignment explicitly allows self-hosting: *"self-hosting is free"* and *"any MCP client counts"*).

The server (`mcp_server.py`) exposes three tools that chat alone cannot do:
| Tool | What it does | Why chat alone can't |
|------|--------------|----------------------|
| `read_local_file` | Reads a real local file | Chat has no filesystem access |
| `query_github_api` | Queries a live external service | Chat can't hit the network / live APIs |
| `compute_sha256` | Hashes a real file's bytes | Chat can't compute against real bytes |

The client (`mcp_client.py`) connects over Stdio, lists the tools, then runs all three tasks and prints the tool outputs.

## Evidence (tool calls, not plain chat)
Running `mcp_client.py` produced this real tool-use output (captured in `evidence/client_output.txt`):
- **Task 1 — `read_local_file(README.md)`**: returned the actual file contents.
- **Task 2 — `query_github_api(mussaratshamsher/FlyRank_Intern)`**: hit the live GitHub API and returned real repo data (`language: HTML`, `last_pushed: 2026-08-05T18:16:58Z`).
- **Task 3 — `compute_sha256(README.md)`**: returned the real SHA-256 digest of the file bytes.

All three are capabilities chat alone cannot do (no filesystem, no network calls, no byte-hashing), and each printed a tool call with its output — proving the MCP connector is demonstrably working.

## How to run it
```bash
cd Week-04/6-Agent-vs-MCP
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python mcp_client.py
```

## Files
| File | Purpose |
|------|---------|
| `explainer.md` | The 600–900 word deliverable |
| `classify-fl04.md` | Workflow vs agent distinction applied to my FL-04 build |
| `mcp_server.py` | Self-hosted MCP server (3 tools) |
| `mcp_client.py` | MCP client that runs the 3 tool-call tasks |
| `requirements.txt` | `mcp` + `httpx` |
| `evidence/` | Captured tool-call output (evidence) |
| `TODO.md` | Tracker |

## Background reading (from the brief)
- *Building Effective Agents* (Anthropic) — workflow vs agent distinction.
- *What is MCP?* (Model Context Protocol docs) — tools, resources, prompts.
- *Introduction to Model Context Protocol* (Anthropic Academy) — optional Python deep dive.
