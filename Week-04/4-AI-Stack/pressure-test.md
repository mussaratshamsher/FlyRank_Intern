# Pressure-Test the Front-Runner (Option A — Static HTML/CSS → GitHub Pages)

Option A is the simplest, so it's the front-runner. I tested it against the hard questions before deciding.

## What breaks if I pick the simplest?
- **Shared layout is copy/paste.** The nav, header, and footer must be repeated in each HTML file. A change means editing every page. Annoying, but not breaking — with 3–5 pages it's manageable.
- **No live AI Agent demo.** If a recruiter asks to try the Portfolio AI Agent on the spot, a static page can't run it. This is the single real limitation.
- **No dynamic forms.** Contact must be a mailto/link, not a stored form. Fine for an intern portfolio.

## What do I maintain if I pick the most powerful (Option C)?
- A **FastAPI backend** deployed and kept running (its own dependencies, CORS, security).
- A **PostgreSQL database** (schema, backups, connection).
- **API keys** for the LLM/vector service, and their cost/quotas.
- The **RAG pipeline** (ingestion updates whenever my projects change).
- **Deployments** on multiple platforms (Vercel + Railway) and their occasional outages or free-tier limits.

That's a lot for a two-week build while I also make the actual content good.

## Can I finish in two weeks?
- **Option A: Yes, easily.** Days, not weeks. All content is already written and all screenshots are ready.
- **Option B: Yes, probably.** A few days of tooling setup, then straightforward building.
- **Option C: Risky.** Backend + database + RAG + frontend + deployments in two weeks, alone, at junior level — likely to eat the whole window and still feel unfinished.

## Does it show my work the way it needs to be shown?
- **Option A:** Yes. Three case studies as long-form pages, three real screenshots as a gallery, GitHub repo linked. That covers everything the assignment says my portfolio must display — **except** the optional embedded demo, which is explicitly a future enhancement, not a requirement.
- **Option C:** Also yes — plus the live demo. But the demo is the *only* thing it adds over Option A, and it costs the most to build and maintain.

## Verdict
Option A shows all *required* work correctly, finishes comfortably, and costs almost nothing to maintain. Its one gap (live demo) is deferred, not lost — the architecture decision to move to Option C later will carry the existing content with it.
