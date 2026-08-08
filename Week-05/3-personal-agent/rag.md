# Design Your Personal Agent

**Assignment:** FL-06 — Design Your Personal Agent
**Track:** General AI Fluency
**Phase:** Build
**Agent Type:** Personal Professional Knowledge Agent / RAG Agent

---

## 1. Agent Overview

My personal agent is a **Professional Knowledge RAG Agent** that represents my professional profile and answers questions about my:

* Professional background
* Technical skills
* Projects
* Experience
* Services
* Other information available in my verified portfolio knowledge base

The agent is designed to provide relevant answers using my existing professional information rather than generating unsupported claims.

### Core Job

> **Answer questions about my professional profile, skills, projects, experience, and services using verified information from my portfolio knowledge base.**

The scope is intentionally narrow: the agent is a professional knowledge assistant, not a general-purpose AI assistant.

---

# 2. User and Usage

### Primary Users

The agent is primarily designed for people visiting my portfolio, including:

* Recruiters
* Potential clients
* Developers
* Collaborators
* People interested in my technical work

### Usage Frequency

The agent is used **on demand** whenever a visitor wants to learn more about my professional background or work.

Typical questions may include:

* What technologies do you work with?
* What AI projects have you built?
* What services do you provide?
* Tell me about your experience.
* Which projects have you worked on?
* What is your experience with Next.js or Python?

---

# 3. Agent Architecture

The agent uses a **Retrieval-Augmented Generation (RAG)** architecture.

The professional knowledge base is converted into embeddings and stored in a **Supabase Vector Database**.

### High-Level Architecture

```text
User
  │
  ▼
Next.js Frontend
  │
  ▼
FastAPI Backend
  │
  ▼
OpenAI Agents SDK
  │
  ├── Analyze User Query
  │
  ├── Use Available Context
  │
  └── Retrieve Relevant Knowledge
          │
          ▼
    Supabase Vector DB
          │
          ▼
    Relevant Context
          │
          ▼
      Agent Response
          │
          ▼
    Next.js Frontend
```

---

# 4. Data and Knowledge Source

The agent's knowledge comes from my professional portfolio information.

Relevant information is processed into embeddings and stored in **Supabase Vector Database**.

### Knowledge Includes

* Professional profile
* Skills and technologies
* Projects
* Professional experience
* Services
* Portfolio-related information

The vector database allows the agent to retrieve semantically relevant information based on the meaning of the user's query.

This means the agent does not need the user to use the exact wording contained in the original knowledge source.

For example, a user might ask:

> "What frontend technologies does he know?"

The agent can retrieve relevant information about my frontend skills even if the stored content uses different wording.

---

# 5. Query Processing and Retrieval

The agent determines how to answer a user's query based on the available context.

The general flow is:

```text
User Query
    │
    ▼
Agent receives query
    │
    ▼
Check available context
    │
    ├── Relevant context available
    │          │
    │          ▼
    │     Generate answer
    │
    └── Additional knowledge required
               │
               ▼
        Search RAG knowledge base
               │
               ▼
        Retrieve relevant context
               │
               ▼
          Generate answer
```

The agent therefore does not blindly retrieve information for every interaction. It uses the available context and RAG retrieval according to the requirements of the query.

---

# 6. Tools and Data Access Plan

| Component                | Purpose                           | Access                     |
| ------------------------ | --------------------------------- | -------------------------- |
| Next.js                  | User interface                    | Public web application     |
| FastAPI                  | Backend API                       | Internal API communication |
| OpenAI Agents SDK        | Agent orchestration               | Backend                    |
| Embedding Model          | Convert knowledge into vectors    | Backend/data pipeline      |
| Supabase Vector DB       | Store and retrieve embeddings     | Backend                    |
| Portfolio Knowledge Base | Verified professional information | Embedded/vectorized data   |

The agent accesses the professional knowledge through the backend and vector database rather than exposing the underlying database directly to the user.

---

# 7. Draft Agent Instructions

The agent should follow these core instructions:

```text
You are my professional portfolio knowledge assistant.

Your job is to answer questions about my professional profile,
skills, projects, experience, and services.

Use the available context and retrieved RAG knowledge to provide
accurate and relevant answers.

Only make claims that are supported by the available professional
knowledge.

If the requested information is not available, do not invent or
assume an answer. Clearly state that the information is not
available in the current knowledge base.

Stay focused on professional portfolio-related questions.

For irrelevant or unrelated queries, do not perform unnecessary
retrieval. Politely explain the scope of the agent and redirect
the user toward questions about my professional work.

Keep responses clear, relevant, and useful.
```

These instructions establish the agent's role, information boundaries, retrieval behavior, and response policy.

---

# 8. Guardrails

The agent includes guardrails to prevent irrelevant or unsupported responses.

### Irrelevant Search Guardrail

The agent should not retrieve portfolio information for queries that are unrelated to its purpose.

For example:

> "What is today's weather?"

This is unrelated to the agent's professional knowledge and should not trigger an unnecessary portfolio search.

### Unsupported Information Guardrail

If the requested information does not exist in the available context or RAG knowledge base, the agent must not fabricate an answer.

For example:

> "What was Mussarat's previous salary?"

If this information is not present in the knowledge base, the agent should state that the information is unavailable.

### Scope Guardrail

The agent should remain focused on:

* Professional profile
* Skills
* Projects
* Experience
* Services
* Portfolio-related questions

It should not behave as an unrestricted general-purpose assistant.

### Accuracy Guardrail

Retrieved information should be treated as the source of truth for professional claims.

The agent should prioritize retrieved/contextual information over unsupported assumptions.

---

# 9. Evaluation Cases

The following evaluation cases are defined before further development/testing.

## Evaluation 1 — Skills

**Input:**

> What technologies does Mussarat work with?

**Expected behavior:**

The agent retrieves relevant professional information and provides a concise summary of the technologies and skills represented in the knowledge base.

**Pass condition:**

The response contains only supported skills and does not invent technologies.

---

## Evaluation 2 — Project Information

**Input:**

> Tell me about one of Mussarat's AI projects.

**Expected behavior:**

The agent retrieves the relevant project information and explains the project using the available portfolio context.

**Pass condition:**

The project details are consistent with the stored knowledge.

---

## Evaluation 3 — Services

**Input:**

> What services does Mussarat offer?

**Expected behavior:**

The agent retrieves the relevant services information and presents the available services clearly.

**Pass condition:**

Only services represented in the portfolio knowledge are mentioned.

---

## Evaluation 4 — Experience

**Input:**

> What kind of development experience does Mussarat have?

**Expected behavior:**

The agent uses relevant context/RAG information to summarize the professional experience available in the knowledge base.

**Pass condition:**

The answer remains grounded in the available professional information.

---

## Evaluation 5 — Unknown Information

**Input:**

> What was Mussarat's salary at his previous job?

**Expected behavior:**

If salary information does not exist in the knowledge base, the agent should not guess or fabricate an answer.

**Pass condition:**

The agent clearly indicates that the information is unavailable.

---

## Evaluation 6 — Irrelevant Query

**Input:**

> Explain quantum physics to me.

**Expected behavior:**

The query should be identified as outside the agent's intended purpose. The agent should avoid unnecessary portfolio retrieval and politely redirect the user toward professional portfolio questions.

**Pass condition:**

No irrelevant RAG search is performed and the response remains within the defined scope.

---

# 10. Risks

### 1. Hallucination

The agent could generate professional claims that are not actually present in the knowledge base.

**Mitigation:** Ground responses in context/RAG and prohibit unsupported claims.

### 2. Irrelevant Retrieval

An unrelated query could trigger unnecessary vector searches and return irrelevant portfolio information.

**Mitigation:** Use query relevance/scope guardrails before retrieval.

### 3. Incomplete Knowledge

The knowledge base may not contain every detail about my professional background.

**Mitigation:** The agent should acknowledge when information is unavailable rather than guessing.

### 4. Outdated Information

The portfolio knowledge base can become outdated when projects, skills, or services change.

**Mitigation:** Update and re-embed the knowledge base when significant portfolio information changes.

---

# 11. Platform Choice

## Selected Platform: OpenAI Agents SDK + Custom Backend

I chose a custom agent architecture using:

* OpenAI Agents SDK
* Python
* FastAPI
* Embedding Model
* Supabase Vector Database
* Next.js frontend

### Why This Platform?

The custom approach provides control over:

* Agent instructions
* RAG retrieval
* Data storage
* Guardrails
* Backend logic
* Frontend experience
* Deployment architecture

It also fits the existing technical stack of my portfolio and allows the agent to be integrated directly into the live website.

---

# 12. Alternative Considered

### Alternative: Custom GPT

A Custom GPT could provide a faster way to create a portfolio knowledge assistant by uploading professional information and defining instructions.

However, the custom OpenAI Agents SDK architecture provides greater control over:

* RAG implementation
* Vector database integration
* Backend APIs
* Retrieval behavior
* Custom guardrails
* Frontend integration
* Deployment

Therefore, the custom architecture is more appropriate for my existing portfolio and provides a better foundation for extending the agent later.

---

# 13. Build Scope

The agent has a deliberately limited scope.

It does **one primary job**:

> **Provide accurate, context-grounded answers about my professional profile and portfolio.**

The existing architecture already implements the core agent workflow, including:

* User interaction through the frontend
* Backend API communication
* Agent processing
* Context/RAG retrieval
* Supabase vector search
* Guardrails for irrelevant queries
* Response generation
* Display of results on the frontend

This keeps the agent within a realistic build scope while leaving room for future improvements.

---

# 14. Success Criteria

The agent is considered successful when it can:

* Answer relevant questions about my professional profile.
* Retrieve appropriate information from the RAG knowledge base.
* Use available context when sufficient.
* Avoid unnecessary retrieval for irrelevant queries.
* Avoid hallucinating information that is not available.
* Clearly communicate when information is unavailable.
* Return the final response to the portfolio frontend.
* Maintain a focused professional scope.

---

## Final Design Summary

The **Personal Professional Knowledge Agent** is a RAG-powered AI agent integrated into my portfolio.

Its purpose is intentionally narrow: **help visitors understand my professional profile, skills, projects, experience, and services through natural-language questions.**

The system combines the **OpenAI Agents SDK, FastAPI, an embedding model, Supabase Vector Database, and Next.js** to provide context-grounded answers while using guardrails to reduce irrelevant retrieval and unsupported responses.

The agent is already working as part of my portfolio, and this specification defines its intended behavior, data access, evaluation criteria, platform choice, risks, and guardrails before further development.
