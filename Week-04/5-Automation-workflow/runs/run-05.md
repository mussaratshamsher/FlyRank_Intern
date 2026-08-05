# Run 05 — Vector Databases

**Date:** Week 4 · **Topic:** Vector databases for RAG and semantic search
**Note:** This is the **brand-new end-to-end run** used to satisfy the evaluation criterion "workflow runs end to end on a brand new input."

## Step 1 — Gather (NotebookLM)
Sources added (4):
- S1: Docs — vector store / embedding basics
- S2: Blog — vector DB vs standard SQL for search
- S3: Blog — choosing a vector database (managed vs self-hosted)
- S4: Paper — hybrid search (vector + keyword)

## Step 2 — Synthesize (NotebookLM)
Expected synthesis (source-grounded):
- Vector databases store embeddings and return nearest-neighbor matches for semantic search (S1).
- They beat SQL for semantic similarity but solve a different problem than exact-match queries (S2).
- Managed vs self-hosted trades setup ease against cost and control (S3).
- Hybrid search (vector + keyword) improves recall on exact terms and names (S4).
- Gaps: no end-to-end benchmark; scaling/metadata filtering not deeply covered.

## Step 3 — Draft (Claude Project)
*First draft produced per 6-section contract (trimmed here).*

## Step 4 — Critique (Claude Project)
- **Accuracy:** Draft said vector DBs "replace" SQL — revised to "complement."
- **Coverage:** Added hybrid search from S4.
- **Voice:** passed.
- **Structure:** passed.
- **Action:** added a concrete "start with a managed vector store, add hybrid search later" step.

## Step 5 — Format (Claude Project)
### Final brief — Vector Databases
**Headline:** Vector search finds meaning; SQL finds exact matches.

**TL;DR:** Vector databases enable semantic search by matching embeddings. They complement, not replace, SQL — and hybrid search that mixes vector + keyword gives the best recall for names and exact terms.

**What happened:**
- Vector databases store embeddings and return nearest-neighbor matches for semantic search (S1).
- They beat SQL at semantic similarity but solve a different problem than exact-match lookup (S2).
- Managed vs self-hosted trades setup ease against cost and control (S3).
- Hybrid search (vector plus keyword) improves recall on exact terms and names (S4).

**Why it matters now:** RAG quality depends on retrieval. Understanding vector + hybrid search is the difference between a demo and a reliable grounded assistant — directly relevant to the Portfolio AI Agent I built.

**Action / takeaway:** Start with a managed vector store for speed; add hybrid keyword search when exact names and terms start to miss.

**Sources:** S1, S2, S3, S4 (linked in notebook).

**Word count:** 205
