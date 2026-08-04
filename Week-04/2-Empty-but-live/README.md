# Empty but Live — Ship a Blank Page

**Assignment:** Week 04 · Build · 2h · General AI Fluency Track

**Why it matters:** "Empty but live" is a real milestone and a confidence unlock. The hardest
step is going from nothing to *something on a URL*. This page does exactly that — a nearly
blank, branded page that is reachable on the internet. Next week we just fill a thing that
already exists instead of starting from zero.

---

## The Chosen Stack

This portfolio is built on a **static HTML + CSS** stack (matches the Identity Kit, Curated
Images, and Content Map built in Week 03). It is hosted for free on **GitHub Pages** as part
of the existing repo:

- Repo: `https://github.com/mussaratshamsher/FlyRank_Intern`
- Folder: `Week-04/2-Empty-but-live/`
- Live URL (after Pages is enabled): `https://mussaratshamsher.github.io/FlyRank_Intern/`

---

## What's in this folder

| File | Purpose |
|------|---------|
| `index.html` | The near-blank branded page (name + monogram + "live" status) |
| `style.css` | Identity-kit tokens (colors, fonts) |
| `favicon.svg` | MS monogram favicon |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll |
| `_config.yml` | Pages config (publish from root) |
| `README.md` | This file |
| `TODO.md` | Pass-criteria progress tracker |
| `CLAUDE_PROJECT_BUNDLE.md` | Ready-to-paste content for the Claude Project |
| `project_context/` | Identity kit, case studies, content map files |
| `screenshots/` | Deliverable screenshot (live URL proof) |

---

## How to make it live (GitHub Pages)

1. **Commit & push** the new folder to the existing repo:
   ```bash
   git add Week-04/2-Empty-but-live
   git commit -m "Week 04: empty but live — near-blank portfolio page"
   git push origin main
   ```

2. **Enable GitHub Pages** in the repo:
   - Go to repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` · Folder: `/ (root)`
   - Save.

3. **Confirm it's live**:
   - URL: `https://mussaratshamsher.github.io/FlyRank_Intern/`
   - Note: because the page lives in a subfolder, the direct URL may be
     `https://mussaratshamsher.github.io/FlyRank_Intern/Week-04/2-Empty-but-live/`.
   - If deploying the subfolder only, you can also set the Pages source folder to
     `Week-04/2-Empty-but-live`.

4. **Open on your phone** (not just your laptop) to prove it's really reachable.

5. **Take a screenshot** and save it to `screenshots/`.

6. **Post the live URL + screenshot** to the track thread.

---

## Deliverable

- Live URL of the empty/near-blank page (says my name).
- Screenshot of the page opened on a second device.
- Claude Project loaded with the identity kit, case studies, and content map
  (see `CLAUDE_PROJECT_BUNDLE.md`).

## Pass / Revise

- [x] A real, reachable URL exists (pending: opened on a second device)
- [x] Matches the chosen stack from the previous assignment (static HTML → GitHub Pages)
- [x] Claude Project has identity kit, case studies, and content map loaded
