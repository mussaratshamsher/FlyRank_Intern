# NotebookLM — Setup Guide (Steps 1 & 2)

NotebookLM provides the source-grounded gather and synthesize steps. It requires a free Google account.

## Step 1 — Gather
Goal: collect 4–6 real, current sources for the week's topic.

1. Create a new notebook per weekly topic.
2. Add sources via **Add sources**:
   - Paste URLs of 2–3 recent industry articles or release notes.
   - Upload 1–2 PDFs or docs (e.g., papers, official docs).
   - Keep **4–6 sources** — enough to be meaningful, few enough to stay focused.
3. Title each source clearly (e.g., "OpenAI — GPT-5 release notes").
4. Quick sanity check: only include sources that are actually about the topic and are recent.

## Step 2 — Synthesize
Goal: turn sources into a source-grounded summary with citations.

1. In the notebook, open the chat and ask the **synthesis prompt** below.
2. Copy the output into the `## SYNTHESIS` block of the Claude Project Step 3 prompt.

### Synthesis prompt (exact)
```
Summarize the key developments on {weekly_topic} across my sources. For each main point,
cite which source it comes from. Then list the 3–5 most important facts, each tagged with its
source. End with any gaps: what is NOT covered by my sources.
```

## Why this grounds the pipeline
- Every claim in the final brief traces back to a cited source from this notebook.
- The "gaps" line feeds the critique step, so the draft does not invent facts that weren't gathered.
- Because the sources are a closed set, the Claude Project is told to stay inside them — reducing hallucination.

## Caveat
NotebookLM requires a Google account and an internet connection. The five runs in `runs/` document what the tool is expected to return at this step; the actual quoting is done by the user inside NotebookLM before pasting into step 3.
