# Week 04 · Automation Workflow — Weekly AI Industry Brief

**Assignment:** FL-04 · "Ship an Automation Workflow v2" · Build (core) · 7h

## The Pipeline I Chose
From my Week-01 Workflow Audit, the research pipeline I flagged was **"Research AI frameworks — compare 3+, pros/cons, recommendation"**. I'm upgrading it into a reusable **Weekly Industry Brief** pipeline: a source-grounded research-and-writing workflow that produces a short, readable AI-industry brief every week from real sources.

## Why This Pipeline
- It is a **repeatable weekly task** — the classic "saves hours" case.
- It needs **source grounding** (no hallucinated links) → perfect for NotebookLM.
- It involves **writing** (draft → critique → format) → perfect for a Claude Project.
- It is **no-code**: notebook + project, no scripts, no buttons to press manually beyond the tool steps.

## The Five Steps (defined handoffs)
```
[1] GATHER  ──►  [2] SYNTHESIZE  ──►  [3] DRAFT  ──►  [4] CRITIQUE  ──►  [5] FORMAT
   sources      source notes        first draft     revision notes     final brief
   (NotebookLM) (NotebookLM)        (Claude Project)(Claude Project)  (Claude Project)
```

| Step | Tool | Input → Output (handoff) |
|------|------|--------------------------|
| 1. Gather | NotebookLM | Topic → list of 4–6 uploaded/imported sources with short notes |
| 2. Synthesize | NotebookLM | Sources → source-grounded summary with inline citations |
| 3. Draft | Claude Project | Synthesis → first-draft brief in project voice/structure |
| 4. Critique | Claude Project | Draft + checklist → revision notes (accuracy, coverage, voice, CTA) |
| 5. Format | Claude Project | Revised content → final formatted brief (headings, bullets, link, wordcount) |

## What's in this folder
| File | Purpose |
|------|---------|
| `workflow.md` | Full walkthrough: diagram, handoffs, every prompt/configuration used |
| `claude-project/instructions.md` | Claude Project knowledge + structured instructions |
| `claude-project/prompts.md` | Exact prompts for steps 3, 4, 5 |
| `notebooklm/setup-guide.md` | NotebookLM configuration for steps 1 & 2 |
| `runs/run-01.md` … `run-05.md` | Five real runs with documented inputs and outputs |
| `time-accounting.md` | Honest manual vs workflow timings, incl. setup cost |
| `failures.md` | Known failure points + what a human must still check |

## Tools (all free no-code)
- **NotebookLM** (account required) — source-grounded gather + synthesize.
- **Claude Project** (set up with the knowledge files in `claude-project/`) — draft, critique, format.
