# Claude Project — Exact Prompts (Steps 3, 4, 5)

These are the exact prompts run in the Claude Project each week. The project context (instructions.md) is loaded automatically, so the prompts reference the stored rules instead of repeating them.

## Step 3 — Draft
```
## TOPIC
{weekly_topic}

## SYNTHESIS
{paste the NotebookLM synthesis output here}

Using the project instructions, produce the first draft of the weekly brief following the
6-section contract (Headline, TL;DR, What happened, Why it matters now, Action/takeaway,
Sources). Keep it under 300 words and ground every fact in the provided sources.
```

## Step 4 — Critique
```
Here is the first draft of this week's brief:

{paste the Step 3 draft here}

Run the critique checklist from the project instructions (accuracy, coverage, voice, structure,
CTA/action). Either state "No revisions needed" or return a numbered list of specific edits
with the exact replacement text.
```

## Step 5 — Format
```
Apply the revisions from Step 4 to the draft. Then format it per the project formatting rules:
Markdown headings and bullets, tight one-idea-return bullets, source links at the end, and a
final word count of 300 or less. Output only the final formatted brief.
```

## Handoff note
Steps 1 (Gather) and 2 (Synthesize) run in NotebookLM (see `notebooklm/setup-guide.md`). The synthesis output is pasted into this prompt as `## SYNTHESIS`. Steps 3 → 4 → 5 run in the same Claude Project session so the draft carries over between prompts.
