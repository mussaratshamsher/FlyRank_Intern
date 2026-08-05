# Build the Systems That Build Software — Harness Engineering

**Assignment:** Week 04 · Build · 90 min · Backend AI Engineering
**Format:** Pre-recorded video course with Mirza Asceric
**Code:** BE · Track: Backend AI Engineering

---

## The One Idea

AI can now type most of the code. That means the job is no longer about writing every line
yourself. The job is now about writing the **plans**, the **rules**, and the **checks** that
let AI write the code — and catching it when it is wrong. The machine you build around the AI
has a name: **the harness**.

This folder is the deliverable for that video. It captures the lessons as notes, maps them to
my own backend workflow, and ships a small **runnable harness** that proves the concept end to
end (spec → loop → tests → done).

---

## Watch the video

- **YouTube (required deliverable link):** https://www.youtube.com/watch?v=rraHPF4ZgCw

---

## What I learned (summary)

| Chapter | Lesson | One-line rule |
|---------|--------|---------------|
| 1. The Shift | Job changed from *writing code* to *writing the machine that writes code* | Write plans, rules, and checks — not every line. |
| 2. Context is Memory | Agents forget everything between conversations | Everything follows from this: put memory outside the agent. |
| 3. Knowledge Layer | A README that works like a map; docs an agent can use | Give the agent a map it can read every session. |
| 4. Spec Layer | Plans a stranger could execute, with a visible "done" | Write specs decoupled from me; make done observable. |
| 5. The Loop | One line of bash turns a spec into shipped tasks | Automate the run/test/fix cycle. |
| 6. Trust | Tests, gates, circuit breakers | The loop must not lie about done and must not run forever. |
| 7. Codebase as Interface | Naming, types, and rules shape AI output | The repo itself is the prompt. |
| 8. Running Many | Parallel agents without chaos | Isolate context so agents don't clobber each other. |
| 9. What Stays Human | Thinking, priorities, catching AI being wrong | Human sets direction and holds the final gate. |

Full chapter notes: [`harness-engineering-notes.md`](./harness-engineering-notes.md)
Applied to my own work: [`applications.md`](./applications.md)

---

## The runnable demo

[`harness-demo/`](./harness-demo/) is a minimal but real harness around a tiny FastAPI app:

- `knowledge/README.md` — the **knowledge layer** (map, conventions, constraints)
- `specs/task-001-echo-endpoint.md` — the **spec layer** (executable plan + visible "done")
- `app.py` — the **codebase-as-interface** (naming, types, docstrings)
- `tests/test_app.py` — the **trust gate** (tests define done)
- `gates.md` — gates + **circuit breaker** rules
- `run_agent_loop.sh` — the **one-line loop** (test → fix → re-test, with max attempts)

```bash
cd Week-04/3-VIDEO/harness-demo
python -m pytest tests/          # the trust gate
bash run_agent_loop.sh           # the loop (simulates the AI fixing cycle)
```

---

## Deliverable links

> **Primary deliverable (required to close the assignment):**
> **YouTube video URL:** https://www.youtube.com/watch?v=rraHPF4ZgCw

- Videos watched: 1 (the full harness-engineering course)
- Notes: [`harness-engineering-notes.md`](./harness-engineering-notes.md)
- Applications: [`applications.md`](./applications.md)
- Runnable harness demo: [`harness-demo/`](./harness-demo)
- Progress tracker: [`TODO.md`](./TODO.md)

---

## Pass / Revise

- [x] YouTube video URL provided in the deliverable links section
- [x] Notes cover all 9 lessons from the video
- [x] Runnable harness demonstrates spec, knowledge, loop, and trust layers
