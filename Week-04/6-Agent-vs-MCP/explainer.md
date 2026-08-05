# What Is an Agent, What Is MCP, and What Would My FL-04 Workflow Need to Become an Agent?

**FL-05 · Agent Concepts and MCP Basics · ~720 words**

---

## What an agent is

An AI agent is a model that works toward a goal by deciding its own next step, in a loop. It doesn't just answer a prompt and stop. It's given a goal and a set of tools, and it keeps choosing actions — calling a tool, reading the result, deciding what to do next — until the goal is met. The key point is **who decides the next action**. In a regular chat, the human drives: I ask, the model answers, I ask again. In an agent, the model drives: it reads the current state, picks a tool, observes the outcome, and picks again. That loop, with the model in control of the path, is what makes something an agent.

The opposite of an agent is a workflow. A workflow is a fixed sequence of steps where the human designed the order and the handoffs in advance. The model does its assigned job at each step, but it never chooses what comes next — the flowchart is already drawn. Agents are powerful because they handle unexpected situations, but that power comes with risk: the model can go down a wrong path, so agents need clear guardrails, a bounded set of tools, and a human checking the result.

## What MCP is

MCP stands for the **Model Context Protocol**. It's an open standard that lets an AI connect to external tools and data in a structured way. Before MCP, every integration was custom — you'd write a different connector for each tool and each model. MCP standardizes that: a model can discover and call tools through one common protocol, the same way a USB port lets different devices plug into a computer.

MCP defines three primitives:
- **Tools** — actions the model can invoke, like reading a file, querying an API, or running a search. The model decides when to call them.
- **Resources** — data the model can read, like a document or a database table. These give the model context it didn't have in its training.
- **Prompts** — reusable instruction templates that standardize how a task is done, so the interaction is consistent.

The primitive that matters most for agents is **tools**. Tools are exactly what turn a model from "chat that answers" into "an agent that acts." This is why MCP and agents are connected: MCP is the plumbing that lets an agent reach out and actually do things in the world.

## What my FL-04 workflow would need to become an agent

My FL-04 build is a **Weekly Industry Brief** pipeline. It has five fixed steps: Gather sources in NotebookLM, Synthesize them into source-grounded notes, Draft the brief in a Claude Project, Critique the draft, and Format the final output. It's a genuine workflow — I designed the order, the handoffs, and the exit criteria, and the model never picks the next step.

To turn this into an **agent**, I would change who controls the path. Instead of me moving the brief through five fixed steps, I'd give the model a goal — "produce a source-grounded AI industry brief" — and a set of tools, then let it decide the sequence. Concretely, it would need:

1. **The tools as callable functions.** A search tool to find sources, a read tool to pull content from a PDF or page, a draft tool, and a critique tool. Under MCP, these would be exposed to the model as tools it can invoke directly — exactly what I demonstrated with my self-hosted MCP server, which exposes `read_local_file`, `query_github_api`, and `compute_sha256`.

2. **A decision loop.** The model would decide when to gather more sources (if the synthesis finds gaps), when to re-draft (if the critique fails the quality bar), and when to stop (when the brief meets the exit criteria). That iteration is the core of agentic behavior — it's not in my current workflow at all.

3. **Guardrails.** The agent would need boundaries: only use approved tools, stay inside cited sources, respect the word limit, and flag anything it couldn't verify. These replace the human checkpoints I built into the workflow.

The honest takeaway: my FL-04 pipeline is a well-designed workflow, and the content logic is already agent-ready. What's missing is the **control loop**. If I wrapped those five steps into MCP tools and let the model decide the order and iterate on its own, the same pipeline would become an agent. The difference is small in code but big in behavior — and it's exactly the trade-off between predictable workflows and flexible agents.

---

*Word count: ~720 words (within the 600–900 range).*
