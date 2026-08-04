# Claude Project — Portfolio Build Bundle

Use this file to set up the Claude Project so the **build week has everything in one place**.
Copy the contents below into a Claude Project (or Project knowledge file), and add the source
files in `project_context/` as reference.

---

## 1. Identity Kit (summary)

**Who:** Mussarat Shamsher — Software Engineer · AI Developer

**Brand palette**
- Charcoal `#2D3436` (text)
- Off-white `#F8F9FA` (background)
- Purple `#6C5CE7` (primary / brand)
- Teal `#A0D2DB` (secondary / dividers)

**Typography**
- Headings: **Playfair Display** (weight 600/700)
- Body: **Inter** (weights 300/400/500)

**Mark:** MS monogram in a rounded purple badge (SVG favicon + header logo).

**Tone:** Clean, calm, developer-first.

---

## 2. Voice Card (standing instruction for Claude)

- Use simple and clear language.
- Write in a professional but natural tone.
- Avoid buzzwords and exaggerated claims.
- Focus on real engineering decisions and outcomes.
- Keep the writing authentic and based on actual experience.
- If something isn't true, don't include it.

**Voice:** Clear · Honest · Professional · Practical · Friendly · No buzzwords

---

## 3. Proof Statement

> I build AI-powered full-stack web applications using Python, FastAPI, Next.js, and modern
> AI technologies. My portfolio is designed for AI recruiters and hiring managers seeking an
> intern or junior AI engineer who can deliver practical, real-world AI solutions. Through my
> projects, I aim to demonstrate my ability to solve real problems and encourage recruiters to
> contact me for internship opportunities.

**Target action:** Contact me for an internship interview.

---

## 4. Case Studies (3)

### 4.1 AI Content Analyzer
Built an AI-powered Content Analyzer with a **Next.js frontend** and **FastAPI backend**.
Users paste text and click **Generate**; the backend uses the **Hiruistic-v1** model to return
a summary, keywords, and content type. Frontend/backend were separated for modularity. Solved
a middleware/proxy issue by implementing a Next.js API route. **Result:** users understand long
text much faster; demonstrates specialized AI models solving practical problems without LLMs.

### 4.2 Portfolio AI Agent
Built a conversational agent that answers questions about skills, projects, technologies, and
contact. Uses a **RAG (Retrieval-Augmented Generation)** architecture with vector search over
portfolio data, plus **guardrails** to block irrelevant/personal questions. Stored portfolio
data in a vector DB and retrieved only relevant info to improve scalability and response quality.
**Result:** recruiters quickly learn about me via natural conversation.

### 4.3 Live Attendance System
Built a facial-recognition **Live Attendance System** during an AI internship. Users register a
face; marking attendance compares the live camera image to the registered face and records it if
the similarity threshold is met. Records stored in Excel; dashboard shows daily attendance.
Improves on paper/QR methods by reducing proxy attendance. Solved webcam loading time by
deploying on **Hugging Face Spaces** (Python + Streamlit). **Result:** digitalized attendance,
less paperwork, real computer-vision experience.

---

## 5. Content Map (15 assets → 4 zones)

| Zone | Assets |
|------|--------|
| Hero / Header | MS Monogram, Profile Photo (pending), Hero Background Texture (pending) |
| Projects | 3 Case Studies + 3 real screenshots (Content Analyzer, AI Agent, Attendance) |
| About / Skills | Tech Stack Visual (pending), Workflow Audit screenshot, Sitemap sketch |
| Footer / Nav / Global | Section Icons (pending), Colour Palette, Typography |

**Status:** 12 ready · 3 pending (profile photo, hero texture, icons, tech-visual generation).

---

## Source files (in `project_context/`)
- `identity-kit.md` — full identity kit reference
- `voice-card.md` — voice card
- `case-studies.md` — the three case studies
- `content-map.md` — content map summary
- `proof-statement.md` — proof statement + target
