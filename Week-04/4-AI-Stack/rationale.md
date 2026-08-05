# Rationale — The Stack I Chose

**Week 04 · Three Roads: Choose Your Stack with AI**

## My Chosen Stack
**Static HTML/CSS/JS, hosted free on GitHub Pages.**

I'm building the portfolio as plain static pages — hand-written HTML and CSS with a little vanilla JavaScript — and serving it from GitHub Pages, which is already set up for my repo. All my content is static today: three case studies already written, three real screenshots ready, a brand kit defined. Nothing on the site needs a server or a database yet.

## The Two I Didn't Choose

**Option B — Static Site Generator (Astro).** I considered this because it solves the one real annoyance of Option A: repeating the header, nav, and footer across pages. With components and Markdown content, I'd avoid copy/paste. But it adds a build tool and a local dev workflow I'd have to learn and keep running, and with only a handful of pages the copy/paste cost is small. The simplicity of plain static files wins for now.

**Option C — Next.js + FastAPI + PostgreSQL.** This is the most powerful and the only one that lets me embed the Portfolio AI Agent as a live chat demo. That demo is genuinely appealing for a portfolio. But it means building *and maintaining* a backend, a database, API keys, a RAG pipeline, and deployments on multiple platforms — all within two weeks, alone, at my level. It show* more, but it risks never being finished and being a burden to keep alive.

## Why This One

**Can I maintain this?** Yes — clearly. A static site has no server to patch, no database to back up, no API keys to babysit, no uptime to worry about. If something breaks, I can read the HTML and fix it myself in minutes. That's exactly the level of maintenance I can honestly commit to as an intern.

**Does it show my work well?** Yes. It displays everything my portfolio is required to show:
- three long-form case studies (long-form reading),
- three real project screenshots (image gallery),
- a link to my GitHub repo (code),
- and the brand kit I already built.

The one thing static can't do is run the AI Agent demo live. That's the honest trade-off — but that's a future enhancement, not a requirement, and the content won't be wasted. If I need it later, I can move to Option C and carry the same content with me.

Put simply: I chose the stack that I can finish, I can maintain, and that shows my work the way it needs to be shown. I'm not adding a backend until the portfolio actually needs one — and right now, it doesn't.
