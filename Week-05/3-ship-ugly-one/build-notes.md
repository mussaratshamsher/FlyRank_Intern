# Build Notes — Personal Portfolio

## 1. Project Overview

This project is my professional developer portfolio, built to showcase my technical skills, services, projects, and experience through a publicly accessible web application.
The portfolio is deployed publicly and consists of a primary single-page portfolio experience with dedicated project content.
**Live Portfolio:**
https://mussarat-web-dev.vercel.app/

**GitHub Repository:**
https://github.com/mussaratshamsher/single-page-folio

---

## 2. Project Structure

The portfolio is organized around a main homepage with multiple sections, along with a separate Projects page.

### Homepage

The homepage contains the following sections:

* **Home** — Introduction and primary portfolio presentation
* **About** — Professional background and profile
* **Services** — Development and technical services offered
* **Projects** — Featured project showcase on the homepage
* **Contact** — Contact and communication section

### Projects Page

Projects are also available through a dedicated Projects page, allowing the portfolio work to be presented separately from the main homepage experience.

### High-Level Structure

```text
Portfolio
│
├── Home
│   ├── About
│   ├── Services
│   ├── Projects
│   └── Contact
│
└── Projects
    └── Project Showcase
```

---

## 3. Repository Structure

The GitHub repository is organized into the following major areas:

```text
single-page-folio/
│
├── backend/
├── public/
├── src/
│
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── tsconfig.json
```

### `src/`

Contains the main frontend application source code, including the portfolio interface, components, pages, styling, and application logic.

### `public/`

Contains static assets used by the portfolio, such as images and other publicly served resources.

### `backend/`

Contains the backend/AI-related implementation used to support the portfolio's AI functionality.

### Configuration Files

The repository also contains the standard configuration required for a modern Next.js application:

* `next.config.ts` — Next.js configuration
* `tsconfig.json` — TypeScript configuration
* `eslint.config.mjs` — ESLint configuration
* `postcss.config.mjs` — PostCSS configuration
* `components.json` — UI/component configuration
* `package.json` — Project dependencies and scripts
* `package-lock.json` — Locked npm dependency versions
* `.gitignore` — Files excluded from Git version control

The repository identifies the application as a Next.js project bootstrapped with `create-next-app`.

---

# 4. Technology Stack

## Frontend

The frontend is built using modern React/Next.js technologies.

### Next.js

Next.js is the primary frontend framework used to build the portfolio application.
It provides the application structure, routing, rendering, optimization, and deployment compatibility required for the portfolio.

### HTML

HTML provides the semantic structure of the portfolio interface and its individual sections.

### CSS

CSS is used for additional styling and presentation requirements that complement the utility-based styling approach.

### Tailwind CSS

Tailwind CSS is used for utility-based styling and responsive UI development.
It allows the interface to be built consistently while controlling spacing, typography, layouts, responsiveness, and visual presentation directly within the component structure.

### Framer Motion

Framer Motion is used to add animation and interaction effects to the frontend.
It helps make transitions, section entrances, and other UI interactions more dynamic without requiring a separate animation system.

---

# 5. Backend & AI Stack

The project also includes a backend/AI layer for AI-powered functionality.

## Python

Python is used as the primary backend/AI programming language.
It provides the foundation for the AI-related backend services.

## FastAPI

FastAPI is used to expose backend functionality through API endpoints.
The frontend can communicate with the backend through these APIs when AI-powered functionality is required.

## OpenAI Agents SDK

The OpenAI Agents SDK is used for building agent-based AI functionality.
It provides the agent orchestration layer for creating AI-driven behavior and interactions.

## Embedding Model

An embedding model is used to transform text/information into vector representations.
These embeddings allow information to be represented semantically and searched based on meaning rather than only exact keyword matches.

## Supabase Vector Database

Supabase is used as the vector database layer.
The vector database stores embeddings and enables semantic retrieval of relevant information for AI-powered functionality.

### AI Architecture

The high-level AI flow is:

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
  ├── Embedding Model
  │       │
  │       ▼
  │   Supabase Vector DB
  │
  ▼
AI Response
  │
  ▼
Next.js Frontend
```

---

# 6. Deployment Architecture

The application uses separate deployment environments for the frontend and backend.

## Frontend — Vercel

The Next.js frontend is deployed on Vercel.

**Production URL:**

https://mussarat-web-dev.vercel.app/
Vercel is used because it provides a deployment environment well suited to Next.js applications.
The repository's README also identifies Vercel as the deployment platform for the Next.js application.

## Backend — Hugging Face

The Python/FastAPI backend is deployed on Hugging Face.
This keeps the AI/backend service separate from the Next.js frontend while allowing the frontend to communicate with the backend through APIs.

### Deployment Architecture

```text
                   PUBLIC INTERNET
                         │
                         ▼
              ┌─────────────────────┐
              │   Vercel Frontend   │
              │      Next.js        │
              └──────────┬──────────┘
                         │
                         │ API Requests
                         ▼
              ┌─────────────────────┐
              │ Hugging Face        │
              │ FastAPI Backend     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ OpenAI Agents SDK   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Embedding Model     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Supabase Vector DB  │
              └─────────────────────┘
```

---

# 7. Development Workflow

The project follows a frontend/backend separation:

1. The portfolio interface is developed with Next.js.
2. UI styling is handled through Tailwind CSS and CSS.
3. Framer Motion provides interactive animations.
4. AI functionality is handled by the Python backend.
5. FastAPI exposes backend functionality through APIs.
6. OpenAI Agents SDK manages agent-based AI behavior.
7. Embeddings are generated using an embedding model.
8. Supabase Vector Database stores and retrieves vectorized information.
9. The frontend communicates with the backend through API requests.
10. The frontend is deployed through Vercel.
11. The backend is deployed through Hugging Face.

---

# 8. Development & Code Quality

The repository uses TypeScript for the Next.js application and includes ESLint configuration for maintaining code quality.
The project also uses the standard Next.js project configuration and TypeScript configuration files.
The GitHub repository is public, making the source code available for inspection and demonstrating that the deployed portfolio corresponds to an accessible source repository.

---

# 9. AI-Assisted Development

AI was used as a development partner during the creation and improvement of the portfolio.
AI assistance can be used for:
* Generating and refining UI components
* Debugging frontend issues
* Improving responsive layouts
* Exploring implementation approaches
* Refining content and portfolio presentation
* Understanding unfamiliar code
* Supporting AI/backend implementation
* Reviewing and improving existing code
AI-generated code is not treated as unexplained code. Before incorporating an implementation, I review the relevant code and understand its purpose, dependencies, data flow, and integration with the rest of the application.
The goal is to use AI to accelerate development while retaining an understanding of how the application works.

---

# 10. What I Can Explain About the Project

I can explain the major parts of the application, including:

* How the Next.js frontend is structured
* How the homepage sections are organized
* How the Projects page is connected to the portfolio
* How components are used to build the interface
* How Tailwind CSS is used for styling
* How Framer Motion is used for animations
* How the frontend communicates with the backend
* How FastAPI exposes backend functionality
* How the OpenAI Agents SDK is used for agent-based functionality
* Why embeddings are used
* How Supabase Vector Database supports semantic retrieval
* How the frontend and backend are deployed separately
* How the application moves from development to production

---

# 11. Production Status

The portfolio is publicly deployed and accessible through its production URL.
**Frontend:** Vercel
**Backend:** Hugging Face
**Source:** GitHub
The project is therefore not only a local development project; it is a publicly accessible, deployed application with a corresponding source repository.

---

# 12. Assignment Relevance — "Ship the Ugly One"

This portfolio serves as the shipped project for the assignment.
The objective is not to claim that the portfolio is perfectly finished. Instead, the important outcome is that the work has been moved from development into a real public environment where another person can access it, review it, and provide feedback.
The next stage is to collect real external feedback and maintain a clear list of improvements that are still needed.
