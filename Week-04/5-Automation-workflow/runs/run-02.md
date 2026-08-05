# Run 02 — Agentic AI Frameworks

**Date:** Week 4 · **Topic:** Comparing agentic AI frameworks (LangGraph vs AutoGen vs CrewAI)

## Step 1 — Gather (NotebookLM)
Sources added (5):
- S1: LangGraph docs — graph-based agent control flow
- S2: AutoGen docs — multi-agent conversation
- S3: CrewAI docs — role-based crews
- S4: Blog comparison — LangGraph vs AutoGen vs CrewAI
- S5: Video transcript — "Building Reliable Agents"

## Step 2 — Synthesize (NotebookLM)
Expected synthesis (source-grounded):
- LangGraph models agents as explicit state machines/graphs; precise control, steeper curve (S1).
- AutoGen uses conversational multi-agent patterns; flexible but harder to predict (S2).
- CrewAI organizes agents as role-based crews; fastest to start (S3).
- Comparison: LangGraph best for reliability, AutoGen for flexibility, CrewAI for speed (S4).
- Reliability is the biggest agent problem; deterministic graphs reduce it (S5).
- Gaps: no benchmarking of latency; cost per run not covered.

## Step 3 — Draft (Claude Project)
*First draft produced per 6-section contract (trimmed here).*

## Step 4 — Critique (Claude Project)
- **Accuracy:** Draft said "CrewAI is production-ready" — not supported; revised to "the fastest to start with."
- **Coverage:** Added the reliability point from S5.
- **Voice:** passed.
- **Structure:** passed.
- **Action:** made concrete (start with CrewAI or LangGraph for control).

## Step 5 — Format (Claude Project)
### Final brief — Agentic AI Frameworks
**Headline:** Choose agents by control, not by hype.

**TL;DR:** Three frameworks take different angles: LangGraph gives explicit control, AutoGen offers flexible conversation, CrewAI is the fastest to start. Pick by how much reliability you need.

**What happened:**
- LangGraph models agents as explicit graphs/state machines — precise control, steeper learning curve (S1).
- AutoGen uses multi-agent conversational patterns — flexible but harder to predict (S2).
- CrewAI organizes agents as role-based crews — quickest path from zero to something running (S3).
- The comparison consensus: LangGraph for reliability, AutoGen for flexibility, CrewAI for speed of start (S4).
- Reliability is the biggest real-world agent problem; deterministic graph control reduces it (S5).

**Why it matters now:** Agent frameworks are converging, but the deciding factor is control vs speed. For my own RAG/portfolio work, deterministic control is worth the extra setup.

**Action / takeaway:** Prototype in CrewAI to learn the ideas fast; move to LangGraph when you need dependable, testable control flow.

**Sources:** S1, S2, S3, S4, S5 (linked in notebook).

**Word count:** 210
