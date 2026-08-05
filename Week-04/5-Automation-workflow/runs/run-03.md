# Run 03 — Small Language Models (SLMs)

**Date:** Week 4 · **Topic:** Small language models for edge / low-cost deployment

## Step 1 — Gather (NotebookLM)
Sources added (4):
- S1: Release notes — small open-weight model (Phi-3 class)
- S2: Blog — running SLMs on laptop / edge
- S3: Paper — quantization and efficiency of small models
- S4: Blog — when an SLM beats a large model

## Step 2 — Synthesize (NotebookLM)
Expected synthesis (source-grounded):
- SLMs are compact open-weight models that run on modest hardware (S1).
- They run locally on laptops/edge, with lower latency and no per-request API cost (S2).
- Quantization shrinks size further with acceptable accuracy loss (S3).
- SLMs win on narrow, repetitive tasks where a large model is overkill; they lose on open-ended reasoning (S4).
- Gaps: no cross-model benchmark table; real memory usage not specified.

## Step 3 — Draft (Claude Project)
*First draft produced per 6-section contract (trimmed here).*

## Step 4 — Critique (Claude Project)
- **Accuracy:** Draft implied SLMs "match" large models — revised to "win on narrow tasks."
- **Coverage:** Added quantization trade-off from S3.
- **Voice:** passed.
- **Structure:** passed.
- **Action:** added a concrete "run a small model locally first" step.

## Step 5 — Format (Claude Project)
### Final brief — Small Language Models
**Headline:** Small models cut cost; they don't replace scale.

**TL;DR:** Small open-weight models run on modest hardware with low latency and no per-request API cost. They're ideal for narrow, repetitive tasks — not for open-ended reasoning.

**What happened:**
- New small open-weight models run on modest hardware (S1).
- They run locally on laptops/edge — lower latency, no per-request cost (S2).
- Quantization shrinks them further, trading a little accuracy for a lot of efficiency (S3).
- SLMs clearly win on narrow, repetitive tasks; they lose on open-ended reasoning (S4).

**Why it matters now:** For cost-sensitive apps — like a portfolio demo or an internal tool — an SLM can handle the boring 80% for near-zero cost, keeping large models for the hard cases.

**Action / takeaway:** Before reaching for a large model, prototype with a small quantized model locally; measure if it meets the task.

**Sources:** S1, S2, S3, S4 (linked in notebook).

**Word count:** 195
