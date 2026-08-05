# Three Stack Options — Simplest to Most Powerful

Given my four constraints (free only, junior skill level, static content, needs image galleries + long-form reading + repo link), the AI produced three options.

---

## Option A — Static HTML/CSS/JS → GitHub Pages
**Simplest**

- **How I'd build:** Hand-written (or AI-assisted) static HTML, CSS, and a little vanilla JS. One page per section (Hero, Projects, About, Contact) with a shared nav and stylesheet. No frameworks, no build step.
- **Where I'd host (free):** GitHub Pages (already enabled for my repo).
- **Backend?** No. Pure static files.
- **The real trade-off:** Extremely fast to build and near-zero maintenance — but I write shared nav/header by hand on every page, and there's no component reuse. Adding the live AI Agent demo later means reworking the site.

**Cost:** $0 · **Time to finish:** ~1–2 days · **Maintenance:** almost none

---

## Option B — Static Site Generator (Astro) → GitHub Pages / Netlify
**Middle**

- **How I'd build:** Use **Astro** (or 11ty) with components for the header, footer, and project cards. Content written as Markdown, rendered to static HTML at build time.
- **Where I'd host (free):** GitHub Pages or Netlify (both free).
- **Backend?** No. Builds to static files.
- **The real trade-off:** Components and a cleaner project structure remove the copy/paste problem of Option A — but I add a build tool and a local dev workflow I must learn and maintain. Slightly more setup than Option A.

**Cost:** $0 · **Time to finish:** ~3–5 days · **Maintenance:** low (must run/build the site on changes)

---

## Option C — Next.js + FastAPI + PostgreSQL → Vercel / Railway
**Most powerful**

- **How I'd build:** A **Next.js** frontend for the site, a **FastAPI** backend, a **PostgreSQL** database, and embed the **Portfolio AI Agent** (RAG) as a live chat anywhere on the site.
- **Where I'd host (free):** Vercel (frontend) + Railway free tier (backend/db), or Hugging Face Spaces for the Agent.
- **Backend?** Yes — FastAPI + PostgreSQL, plus the RAG/vector pipeline.
- **The real trade-off:** Fully dynamic and impressive — the AI Agent demo runs live on the page. But it's the heaviest option: I must build, deploy, secure, and maintain a backend, a database, API keys, and the RAG pipeline. Much more to break and more to keep running.

**Cost:** $0 (free tiers) · **Time to finish:** weeks · **Maintenance:** high (backend, DB, API keys, uptime)
