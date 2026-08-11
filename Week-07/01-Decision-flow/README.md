# 🧠 AI Decision Flow Builder

> A visual, AI-powered decision tree builder that lets you design, validate, and execute binary classification workflows using **Groq LLMs** and **Inngest** background jobs — all from a drag-and-drop canvas.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange)
![Inngest](https://img.shields.io/badge/Inngest-v4-green)

---

## 📖 What Is This App?

**AI Decision Flow Builder** is a full-stack Next.js application that enables users to visually construct **binary decision trees** on an interactive canvas. Each node in the tree contains a natural-language prompt (a YES/NO question) that gets evaluated by an AI model (Groq's LLaMA 3.3 70B). The AI reads the question and returns a binary **YES** or **NO** answer, which determines the path the execution follows through the tree.

Think of it as a **visual flowchart builder** where each decision is made by an LLM instead of hardcoded logic.

---

## ✨ Key Features

### 🎨 Visual Flow Canvas
- **Drag-and-drop** decision nodes on an interactive React Flow canvas
- **Pan, zoom, and minimap** navigation for large workflows
- **Smooth animated edges** with color-coded YES (green) / NO (red) branches
- **Real-time auto-save** — your workflow is persisted to Local Storage automatically

### 🧩 Node Management
- **Add** new decision nodes with a single click
- **Select & Edit** any node's label and AI prompt from the right-side panel
- **Delete** nodes (and their connected edges) from the editor
- **Connect** nodes by dragging from YES/NO output handles to another node's input

### ✅ Workflow Validation
- Validates the flow structure before execution:
  - Checks for a **single root node** (no incoming edges)
  - Ensures every node has **both YES and NO outgoing edges**
  - Detects **orphan nodes**, **duplicate branches**, and **missing labels**
- Clear error messages pinpoint exactly which node or edge has an issue

### 🤖 AI-Powered Execution (Simulate Run)
- Sends each node's prompt to **Groq LLaMA 3.3 70B** for binary classification
- Executes the tree **top-down**, following the YES/NO path returned by the AI
- **Visual playback**: nodes light up in sequence — showing running → completed states
- **Edge highlighting**: the chosen path glows with animated styling during execution
- Falls back to **Mock Mode** (keyword-based heuristic) if no Groq API key is configured

### ⚡ Background Job Execution (Inngest)
- Dispatch the entire workflow to **Inngest** as a background job
- Each decision node runs as a separate durable step with retry capabilities
- Monitor job execution in the **Inngest Dev Server Dashboard** at `http://localhost:8288`

### 📜 Execution History
- Every run (local simulation or Inngest) is logged with:
  - **Status** (completed / failed)
  - **Number of nodes evaluated**
  - **Duration** (in seconds)
  - **Timestamp**
- History panel shows the last 50 runs

### 🎯 Built-In Demo Template
- One-click **"Load Support Demo"** button loads a pre-built 7-node customer support routing tree
- Demonstrates a realistic use-case: routing support tickets through technical bug detection, billing escalation, refund processing, and PagerDuty triggers

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Groq API Key** (free at [console.groq.com](https://console.groq.com))
- **Inngest CLI** (optional, for background job execution)

### Installation

```bash
# 1. Navigate to the project directory
cd Week-07/01-Decision-flow

# 2. Install dependencies
npm install

# 3. Set up environment variables
#    Copy the example and add your Groq API key
cp .env.example .env
```

### Environment Variables

Edit the `.env` file with your credentials:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
INNGEST_DEV=1
```

| Variable        | Description                                      | Required |
| --------------- | ------------------------------------------------ | -------- |
| `GROQ_API_KEY`  | Your Groq API key for LLM inference              | Yes*     |
| `GROQ_MODEL`    | The Groq model to use (default: `llama-3.3-70b-versatile`) | No |
| `INNGEST_DEV`   | Set to `1` to enable Inngest dev mode            | No       |

> \* If not provided, the app runs in **Mock Mode** — decisions are made using keyword matching instead of AI.

### Running the App

```bash
# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Inngest (Optional)

To enable background job execution:

```bash
# In a separate terminal, start the Inngest dev server
npm run inngest
```

Then open the **Inngest Dashboard** at [http://localhost:8288](http://localhost:8288) to monitor background jobs.

---

## 🎮 How to Use the App

### Step 1 — Build Your Decision Tree

1. Click **"Add Decision Node"** from the Controls panel (top-left of canvas)
2. Click on a node to select it — its properties appear in the **Node Editor** panel (right side)
3. Set the **Name/Label** (e.g., "Is this a billing issue?")
4. Write a **Decision Prompt** — a question the AI will answer with YES or NO
   - Example: *"Is the customer requesting a refund, asking about an invoice, or complaining about pricing?"*
5. Connect nodes by dragging from a **YES** (green) or **NO** (red) handle on one node to the **top input handle** of another node

### Step 2 — Validate the Flow

1. Click **"Validate Structure"** from the Controls panel
2. The validator checks:
   - Exactly one root node exists
   - All nodes have both YES and NO outgoing connections
   - No orphan or disconnected nodes
3. Fix any errors shown in the validation panel

### Step 3 — Execute the Workflow

You have **two execution modes**:

| Mode | Button | Description |
|------|--------|-------------|
| **Simulate Run (UI)** | 🟣 Purple button | Runs the tree locally with visual playback. Each node lights up as the AI evaluates it. Results appear directly on the canvas. |
| **Run Background Job (Inngest)** | 🟢 Green button | Dispatches the workflow to Inngest as a durable background job. Monitor progress in the Inngest Dev Server dashboard. |

### Step 4 — Review History

Switch to the **"Run History"** tab in the right panel to see past execution results — including status, node count, duration, and timestamp.

### Quick Start with Demo

Click **"Load Support Demo"** in the top bar to load a pre-configured 7-node customer support decision tree and try running it immediately.

---

## 🏗️ Project Architecture

```
01-Decision-flow/
├── src/
│   └── app/
│       ├── page.tsx                    # Main workflow editor (canvas + panels)
│       ├── layout.tsx                  # Root layout with metadata
│       ├── globals.css                 # Global styles
│       └── api/
│           ├── inngest/route.ts        # Inngest serve endpoint
│           └── workflow/
│               ├── run/route.ts        # POST — local AI execution
│               └── inngest/route.ts    # POST — dispatch to Inngest queue
├── components/
│   └── flow/
│       └── DecisionNode.tsx            # Custom React Flow node component
├── inngest/
│   └── functions.ts                    # Inngest durable function definition
├── lib/
│   ├── groq.ts                         # Groq LLM integration (decide YES/NO)
│   ├── storage.ts                      # Local Storage persistence
│   └── workflow.ts                     # Validation & traversal utilities
├── types/
│   └── workflow.ts                     # TypeScript type definitions
├── .env.example                        # Environment variable template
├── package.json                        # Dependencies and scripts
├── tailwind.config.ts                  # Tailwind CSS configuration
└── tsconfig.json                       # TypeScript configuration
```

---

## 🔌 API Endpoints

### `POST /api/workflow/run`

Executes the decision tree locally and returns step-by-step results.

**Request Body:**
```json
{
  "nodes": [{ "id": "1", "data": { "label": "Is VIP?", "prompt": "..." } }],
  "edges": [{ "id": "e1", "source": "1", "target": "2", "data": { "branch": "YES" } }]
}
```

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "logs": [
    {
      "id": "abc123",
      "nodeId": "1",
      "prompt": "...",
      "result": "YES",
      "status": "completed",
      "timestamp": 1691234567890
    }
  ],
  "durationMs": 2340
}
```

### `POST /api/workflow/inngest`

Dispatches the workflow to Inngest as a background job.

**Response:**
```json
{
  "success": true,
  "executionId": "uuid-v4-string",
  "message": "Workflow run event dispatched to Inngest background queue."
}
```

### `GET/POST/PUT /api/inngest`

Internal Inngest serve endpoint — handles Inngest framework communication.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with API routes |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [React Flow (@xyflow/react)](https://reactflow.dev/) | Interactive node-based canvas |
| [Groq SDK](https://console.groq.com/) | Ultra-fast LLM inference (LLaMA 3.3 70B) |
| [Inngest](https://www.inngest.com/) | Durable background job execution |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |

---

## 📝 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start Next.js development server |
| Build | `npm run build` | Create production build |
| Start | `npm run start` | Run production server |
| Lint | `npm run lint` | Run ESLint checks |
| Inngest | `npm run inngest` | Start Inngest CLI dev server |

---

## 💡 Use Cases

- **Customer Support Routing** — Automatically classify and route support tickets through decision logic
- **Content Moderation** — Build AI-driven content review pipelines with YES/NO gates
- **Lead Qualification** — Classify incoming leads through multi-step evaluation criteria
- **Approval Workflows** — Model approval chains where each step requires binary AI judgment
- **Incident Response** — Build automated triage trees for production incidents

---

## 📄 License

This project is part of the FlyRank Internship program.
