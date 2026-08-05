# Known Failure Points & Required Human Review

## Where the workflow breaks

### 1. Source curation (Step 1 — Gather)
- **Break:** Adding off-topic, low-quality, or dated sources. Garbage in, garbage out.
- **Human check (required):** I must verify each source is real, recent, and on-topic before running the pipeline. The workflow cannot judge source quality.

### 2. NotebookLM synthesis gaps (Step 2)
- **Break:** The notebook may miss a key fact or over-summarize, and the "gaps" line can be incomplete.
- **Human check (required):** I read the gaps list and confirm the important facts are covered. I add a source if a critical claim is missing.

### 3. In-source hallucination pressure (Step 3 — Draft)
- **Break:** Even with a closed source set, the draft can overstate ("always cheaper", "production-ready") beyond what sources support.
- **Human check (required):** The critique step catches most of this, but I do a final read of every factual claim against the sources.

### 4. Critique complacency (Step 4)
- **Break:** The model can return "no revisions needed" when the draft is only passable, not good.
- **Human check (required):** I still decide if the brief is good enough, not just technically correct. Tone and judgment stay mine.

### 5. Word-count / link drift (Step 5)
- **Break:** Formatting can push over 300 words or attach a wrong source link to a claim.
- **Human check (required):** I verify the final word count and that each link maps to the claim it supports.

### 6. Tool/account dependency
- **Break:** NotebookLM requires a Google account and internet; if it is unavailable, steps 1–2 cannot run.
- **Human check (required):** I have a manual fallback (search + note-taking) — the workflow, not the human, is the replaceable part.

## What a human must still check (always)
- **Accuracy:** every claim traces to a cited source.
- **Recency:** sources are current for a "weekly" brief.
- **Voice:** the brief sounds like me, not like marketing copy.
- **Judgment:** whether the "takeaway" is actually worth acting on.
- **Final gate:** I approve before the brief is published anywhere.

## Bottom line
The workflow does the gathering, drafting, critiquing, and formatting grunt work and saves ~3× time. But source quality, factual verification, tone, and the final yes/no to publish always stay with me. That matches my Week-01 audit rule: delegate the typing, keep the thinking and the final gate.
