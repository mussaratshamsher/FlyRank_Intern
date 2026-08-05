# Workflow Walkthrough — Weekly AI Industry Brief

## Step Diagram
```
                     ┌────────────────────────────────────────────┐
                     │            WEEKLY INDUSTRY BRIEF            │
                     └────────────────────────────────────────────┘

  [1] GATHER            [2] SYNTHESIZE          [3] DRAFT        [4] CRITIQUE      [5] FORMAT
  NotebookLM           NotebookLM              Claude Project   Claude Project    Claude Project
  ───────────          ───────────             ─────────────    ─────────────     ─────────────
  Topic → 4-6          Sources →               Synthesis →      Draft →           Revised →
  real sources         source-grounded         first draft      revision notes    final brief
  (URLs, PDFs)         summary + citations     6-section        (or "no           ≤300 words,
                       + gaps list            contract         revisions")       Markdown + links
       │                    │                      │                │                │
       └──── handoff ───────┘                      └──── handoff ───┘                │
            sources                                  synthesis                        │
                                                                                      └──► deliverable
```

## Handoffs (input → output)
| Step | Tool | Input | Output (handoff to next) |
|------|------|-------|---------------------------|
| 1. Gather | NotebookLM | Week's topic | 4–6 real sources (URLs/PDFs) |
| 2. Synthesize | NotebookLM | The sources | Source-grounded summary, cited facts, gaps list |
| 3. Draft | Claude Project | Synthesis block | First-draft brief (6-section contract) |
| 4. Critique | Claude Project | Draft | Revision notes or "no revisions needed" |
| 5. Format | Claude Project | Revised content | Final formatted brief (≤300 words, links) |

## Rules that make it a workflow (not one prompt)
- **Fixed handoff contract:** each step's output is the exact input format of the next step (the `## SYNTHESIS` block and the draft paste).
- **Source grounding:** the Claude Project is told to stay inside the cited sources and to flag gaps — this is what separates a workflow from a single chat prompt.
- **Mandatory critique:** step 4 runs every time, even to return "no revisions needed."
- **Fixed exit criteria:** ≤300 words, 6 sections, all facts cited.

## Time per step (typical, from the five runs)
| Step | Tool | Typical time |
|------|------|--------------|
| 1. Gather | NotebookLM | 6–10 min |
| 2. Synthesize | NotebookLM | 3–5 min |
| 3. Draft | Claude Project | 2–3 min |
| 4. Critique | Claude Project | 1–2 min |
| 5. Format | Claude Project | 1–2 min |
| **Total workflow** | | **~15–20 min** |

## Setup cost (one-time)
| Item | Time |
|------|------|
| Create NotebookLM notebook + add sources (first run) | ~15 min |
| Create Claude Project + load instructions.md + prompts.md | ~15 min |
| **Total setup** | **~30 min** |

See `time-accounting.md` for the full manual-vs-workflow comparison and the time-saved estimate.
