# Classifying My FL-04 Pipeline: Workflow, Not Agent

**FL-05 · Agent Concepts and MCP Basics**

## The Workflow vs Agent distinction (in my own words)
A **workflow** is a fixed sequence of steps where both the order and the handoffs between steps are designed in advance. The model does its assigned task at each step, but the *path* is decided by the human who built it — the model never picks what to do next.

An **agent** is the opposite at the control level: the model decides the next action itself, in a loop, based on what it just observed. It's given tools and a goal, and it keeps choosing tool calls until the goal is met. The *path* is dynamic and model-driven.

The cleanest way to tell them apart: **who decides the next step?** In a workflow, the human designed the flowchart. In an agent, the model reads the current state and picks the next move.

## Classifying my FL-04 pipeline
My **Weekly Industry Brief** pipeline is clearly a **workflow**, not an agent. Here's why:

1. **Fixed step order.** The steps are hard-coded: Gather → Synthesize → Draft → Critique → Format. I, the builder, designed that sequence. The model never reorders it or skips ahead.

2. **Fixed handoff contract.** Each step's output is a specific, pre-defined input format for the next step (the `## SYNTHESIS` block, the draft paste). The interface between steps is fixed, not something the model invents.

3. **No tool-chaining loop.** The tools (NotebookLM, Claude Project) are used in a strict order, one output feeding the next. There is no loop where the model decides to call a tool again or reach for a different tool based on intermediate results.

4. **Mandatory, scripted critique.** Step 4 runs every single time, even to return "no revisions needed." That's a designed quality gate, not a model decision.

5. **Fixed exit criteria.** ≤300 words, 6 sections, all facts cited. The endpoint is defined up front, so nothing is left for the model to decide about "when am I done."

## What it would take to turn FL-04 into an agent
To make this a true agent, the fixed flowchart would become a **dynamic loop**:
- Give the model a **goal** ("produce a source-grounded AI brief") and a set of **tools** (search the web, read a PDF, draft, critique, format).
- Let it **decide the order and iteration**: it could gather more sources if the synthesis finds gaps, re-draft if the critique fails, or stop early when the exit criteria are met — all on its own.
- The human would shift from *designing every step* to *setting the goal and the guardrails* (which tools, quality bar, safety limits).

That single change — who decides the next step — is the line between my FL-04 workflow and an agent.
