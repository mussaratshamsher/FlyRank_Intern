# Harness Engineering — Chapter-by-Chapter Notes

**Video:** *Build the Systems That Build Software* — Mirza Asceric
**URL:** https://www.youtube.com/watch?v=rraHPF4ZgCw

> Central thesis: AI can type most of the code, so the job shifts from writing every line to
> building the **harness** — the plans, rules, and checks around the AI that let it write code,
> and that catch it when it is wrong.

---

## Chapter 1 — The Shift (Before vs. Now)

### Before
- The bottleneck was **typing**: I wrote every line, every function, every test by hand.
- Effort scaled linearly with lines of code.
- My value was measured by how much code I could produce.

### Now
- Typing is cheap; **the bottleneck is deciding what "right" means**.
- My job: specify intent, define constraints, set the boundaries.
- The AI types the code; my value is in the **harness** around it.

### Rules
1. Don't race the AI at typing — race it at clarity.
2. If a spec can be executed by a stranger, it can be executed by an agent.
3. The better the rules, the less you have to review line-by-line.

---

## Chapter 2 — Context is Memory

### The core fact
- An agent **forgets everything between conversations**.
- Every conversation starts from zero unless we give it memory.
- Everything else in the course follows from this single fact.

### Consequences
- A brilliant one-off prompt is useless next week — the agent won't remember it.
- The harness must be the **external memory**: READMEs, specs, conventions, docs.
- If the answer is only in my head, the agent can't use it.

### Rules
1. Never assume the agent remembers the previous chat.
2. Put durable knowledge in files, not in prompts.
3. Design every artifact as if the agent will read it cold.

---

## Chapter 3 — The Knowledge Layer

### The README that works like a map
- A good README is not a wall of text — it's a **map** of the project.
- It tells the agent: where things live, how to run, what the conventions are.
- It answers the questions the agent would otherwise hallucinate.

### Docs an agent can actually use
- Short, specific, and scannable beats long and exhaustive.
- Include commands, paths, and constraints — **concrete** facts.
- Keep it updated; stale knowledge is worse than no knowledge.

### Rules
1. The README is the agent's memory of your project — treat it as code.
2. Document commands that must be run, not just ideas.
3. When you learn something the hard way, write it down for the next session.

---

## Chapter 4 — The Spec Layer

### Plans a stranger could execute
- A spec is not a paragraph of vibes; it's an **executable plan**.
- Any person (or agent) should be able to pick it up and implement it.
- It names the file(s), the behavior, the acceptance criteria, and the "done".

### A "done" you can see
- "Done" must be **observable**, not subjective.
- Prefer: "the API returns `{"echo": "hi"}` with status 200 and this test passes"
  over "make the endpoint work well".
- If you can't test it, it isn't done.

### Rules
1. Write specs so a stranger could complete them without talking to you.
2. Define done as a testable state, not a feeling.
3. Split big work into small tasks with one visible outcome each.

---

## Chapter 5 — The Loop

### One line of bash
- The loop turns a spec into **shipped tasks automatically**.
- Pattern: run tests → if failing, let the AI fix → re-run tests → repeat.
- The human writes the spec; the loop does the grunt work.

### What the loop looks like
```bash
# pseudo-code / canonical one-liner idea
while ! run-tests; do ai-fix; done
```

### Rules
1. Automate the cycle that used to be manual copy-paste between terminal and chat.
2. Keep the loop small: test + fix + repeat.
3. The loop is only safe if Chapter 6 (Trust) is in place.

---

## Chapter 6 — Trust (Tests, Gates, Circuit Breakers)

### Tests
- Tests are the **source of truth** for "done".
- If a test defines behavior, the AI cannot silently change the behavior.
- Green tests are the only acceptable definition of "works".

### Gates
- Gates are checks the loop must pass before shipping.
- Examples: tests pass, lint clean, secrets not committed, format correct.
- A failed gate stops the cycle — no exceptions.

### Circuit breakers
- The loop must **not run forever**.
- Set a max number of attempts; if the AI can't make tests green, stop and escalate.
- Prevents wasted tokens, infinite loops, and compounding garbage.

### Rules
1. The loop cannot lie about being done — only green tests can say done.
2. The loop cannot run forever — a circuit breaker trips and reports back.
3. When in doubt, trip the breaker and let a human look.

---

## Chapter 7 — The Codebase as the Interface

### Naming
- The AI reads your code; names are part of the prompt.
- Clear names tell the agent what a thing does and what it shouldn't do.

### Types
- Types and signatures are instructions.
- A function with a typed, narrow signature is self-documenting.
- Strong types prevent whole classes of AI mistakes.

### Rules (the repo is the prompt)
1. Name things so an agent can infer intent without a conversation.
2. Use types/schemas to make the boundary explicit.
3. Docstrings and conventions in the repo shape every future AI output.

---

## Chapter 8 — Running Many (Parallel Agents)

### The problem
- Multiple agents working on the same repo collide: same files, same names, conflicting edits.

### The fix
- Isolate context and scope per agent.
- Give each agent its own slice: a specific file, a specific task, its own branch.
- A shared knowledge layer keeps them consistent; isolated work keeps them safe.

### Rules
1. One agent, one concern — do not parallelize within a single file.
2. Keep a shared spec/knowledge base so agents agree on conventions.
3. Use branch-per-task so chaos can't merge into main.

---

## Chapter 9 — What Stays Human

### What remains unfakeable
- **Thinking**: choosing what to build and why.
- **Priorities**: deciding order, scope, and what to cut.
- **Catching AI being wrong**: the final review before it ships.

### The human is the last gate
- The harness automates the grunt work; it does not remove judgment.
- The human sets the direction, owns the acceptance criteria, and holds the ship/revert button.

### Rules
1. Delegate the typing; keep the judgment.
2. Always spot-check AI output against the spec before shipping.
3. The circuit breaker exists so a human can always see the failure log.

---

## Key takeaways (the one-line summary)

1. Job = building the harness, not typing the code.
2. Agents have no memory — the repo is the memory.
3. README = map; docs = fuel.
4. Spec = plan a stranger can execute; done = visible.
5. Loop = one line of bash that ships.
6. Trust = tests + gates + circuit breakers.
7. Repo = the interface; naming/types ARE instructions.
8. Parallel agents need isolated context.
9. Human keeps the thinking and the final gate.
