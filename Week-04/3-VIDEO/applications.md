# Applying the Harness to My Own Work

This file maps each of the 9 chapters from the video to my actual backend work in this repo —
what I'm already doing well, and what I'll change going forward.

---

## Chapter 1 — The Shift

**In my work:** Earlier in this program (Week 01) I did a workflow audit and classified most
backend tasks as "Collaborate with AI." That was the start of the shift — I already treat AI as
a co-writer, not a typewriter.

**What I'll do now:** I'll stop writing throwaway prompts and start writing **specs and rules**
that are reusable across sessions. My deliverables in this folder are the first version of that.

**Rule:** Race the AI at clarity, not typing.

---

## Chapter 2 — Context is Memory

**In my work:** Each Week folder is independent. When I start a new assignment, the agent has
no memory of the previous one. My `CLAUDE_PROJECT_BUNDLE.md` (Week 04 · 2-Empty-but-live) is a
good start — it gives the agent persistent context (identity kit, voice card, case studies).

**What I'll do now:** Treat every repo folder as the agent's external memory. If it's not in a
file, the agent won't know it.

**Rule:** Never assume the agent remembers the previous chat.

---

## Chapter 3 — The Knowledge Layer

**In my work:** My assignment READMEs are mostly prose about *what* was built. They're not yet
maps an agent can execute from.

**What I'll do now:** Make each README a **map**: commands to run, paths, conventions, and
constraints — so a cold agent can orient instantly. See `harness-demo/knowledge/README.md`.

**Rule:** The README is the agent's memory — treat it as code.

---

## Chapter 4 — The Spec Layer

**In my work:** My `TODO.md` files are good checklists, but they're high-level ("Create auth
signup route"). A stranger/agent would still have to ask me what "done" looks like.

**What I'll do now:** Write specs with **observable done states** — acceptance criteria and a
test that proves it. See `harness-demo/specs/task-001-echo-endpoint.md`.

**Rule:** Done is a testable state, not a feeling.

---

## Chapter 5 — The Loop

**In my work:** For backend work (Week 03/04) I run tests manually and paste errors into the
agent by hand. That's the exact manual loop the video says to automate.

**What I'll do now:** Wrap the run → fix → re-run cycle in a one-liner script with tests as the
gate. See `harness-demo/run_agent_loop.sh`.

**Rule:** One line of bash turns a spec into shipped tasks.

---

## Chapter 6 — Trust

**In my work:** I have tests in some projects but no **circuit breaker** — nothing stops a
failing fix loop from running forever.

**What I'll do now:** Add a max-attempts counter to any AI-fix loop, and make tests the only
definition of "done." See `harness-demo/gates.md`.

**Rule:** The loop cannot lie about done, and cannot run forever.

---

## Chapter 7 — The Codebase as the Interface

**In my work:** My FastAPI apps (Week 04/1-Auth) use typed Python and clear route names, which
already helps. But I haven't been deliberate about treating naming/types as instructions.

**What I'll do now:** Write docstrings and type hints as if they're the prompt for the next
agent. See `harness-demo/app.py`.

**Rule:** The repo is the prompt — naming and types are instructions.

---

## Chapter 8 — Running Many

**In my work:** I haven't run parallel agents yet. When I do, I risk them editing the same files.

**What I'll do now:** Scope one agent to one task/file/branch, with a shared knowledge layer so
they stay consistent and don't clobber each other.

**Rule:** One agent, one concern; isolate context.

---

## Chapter 9 — What Stays Human

**In my work:** I already make final calls (business decisions, tone, priorities) myself — my
Week 01 audit flagged these as "Just Me."

**What I'll do now:** Keep the final gate: review AI output against the spec and ship manually.
The harness automates grunt work; the judgment stays mine.

**Rule:** Delegate the typing; keep the thinking and the final gate.

---

## Summary — what changes in my workflow

| Before (manual) | After (harnessed) |
|-----------------|-------------------|
| Throwaway prompts each session | Reusable spec + knowledge files |
| Prose READMEs | README as an executable map |
| "Make it work" | Observable, testable done states |
| Manually paste errors into chat | One-line loop with test gate |
| No stop condition | Circuit breaker (max attempts) |
| Undisciplined naming | Naming/types as the prompt |
| AI on one big task | One agent, one concern |
| Human reviews everything equally | Human guards the final ship gate |
