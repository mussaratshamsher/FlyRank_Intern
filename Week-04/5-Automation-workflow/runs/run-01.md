# Run 01 — RAG vs Fine-Tuning

**Date:** Week 4 · **Topic:** RAG vs fine-tuning for domain-specific AI apps

## Step 1 — Gather (NotebookLM)
Sources added (4):
- S1: "RAG vs Fine-Tuning: When to Use Each" — industry blog
- S2: "What is Retrieval-Augmented Generation?" — official docs
- S3: "Fine-Tuning LLMs: A Practical Guide" — engineering blog
- S4: PDF — "A Survey of RAG Techniques for LLMs"

## Step 2 — Synthesize (NotebookLM)
Expected synthesis (source-grounded):
- RAG retrieves facts from an external store at inference time; no weight changes (S2).
- Fine-tuning updates model weights on a domain dataset; best when output style/format must change (S3).
- RAG is cheaper to update and auditable; fine-tuning is stronger for tone/format but costlier to retrain (S1).
- Survey notes RAG needs a high-quality retrieval index; retrieval quality is the main failure point (S4).
- Gaps: no source compares cost of both on a specific budget; deployment cost not covered.

## Step 3 — Draft (Claude Project)
*First draft produced per 6-section contract (trimmed here).*

## Step 4 — Critique (Claude Project)
- **Accuracy:** "Gaps" line correctly flagged; one bullet said "RAG is always cheaper" — revised to "typically cheaper to update."
- **Coverage:** Fine-tuning's batch retraining cost not clearly stated — added.
- **Voice:** TL;DR was slightly buzzwordy ("unlock synergies") — rewritten.
- **Structure:** passed.
- **Action:** made concrete ("prototype RAG first; only fine-tune if output format is the blocker").

## Step 5 — Format (Claude Project)
### Final brief — RAG vs Fine-Tuning
**Headline:** RAG updates fast; fine-tuning changes the model itself.

**TL;DR:** RAG and fine-tuning solve different problems. RAG pulls up-to-date facts without retraining; fine-tuning changes the model's style and format. Pick by what actually needs to change.

**What happened:**
- RAG retrieves facts from an external store at answer time; the model weights stay unchanged (S2).
- Fine-tuning updates weights on a domain dataset — best when the required output style or format won't come from retrieval alone (S3).
- RAG is typically cheaper to update and easier to audit; fine-tuning is stronger for tone/format but costs more to retrain each time (S1).
- The main RAG failure point is retrieval quality — the index must be well built (S4).

**Why it matters now:** For an early-career AI engineer, RAG is the low-cost way to ground an app in your own data without retraining. Fine-tuning is a bigger commitment you reach for only when format matters.

**Action / takeaway:** Prototype RAG first; only fine-tune when changing the output format is the actual blocker.

**Sources:** S1, S2, S3, S4 (linked in notebook).

**Word count:** 205
