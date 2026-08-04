# Portfolio Case Studies

## AI Content Analyzer

**Problem:** Students and working professionals spend a lot of time reading long documents,
emails, and messages. They also need to manually identify spelling mistakes and understand the
main points before taking action. I wanted a tool that analyzes content within seconds.

**What I Did:** Built an AI-powered Content Analyzer using a **Next.js frontend** and a
**FastAPI backend**. When a user pastes text and clicks **Generate**, the frontend sends a POST
request to the backend. The backend uses the **Hiruistic-v1** model to analyze the content and
returns a summary, keywords, and content type. I separated frontend and backend to keep the app
modular and easier to maintain. During development I faced an issue where requests were not
reaching the backend due to middleware/proxy behavior; I implemented a Next.js API route to
resolve the communication issue.

**Result:** The app helps users understand long paragraphs, emails, and messages much faster by
generating concise summaries and highlighting key keywords. It demonstrates how specialized AI
models can solve practical problems without relying on large language models.

---

## Portfolio AI Agent

**Problem:** Recruiters and clients often don't have time to explore every page of a portfolio.
I wanted visitors to quickly learn about my skills, projects, technologies, and contact info.

**What I Did:** Developed an AI-powered Portfolio Agent that answers professional questions about
me through a conversational interface. I implemented a **RAG (Retrieval-Augmented Generation)**
architecture — the agent retrieves information directly from my own portfolio data using vector
search rather than relying on the LLM's general knowledge. I added **guardrails** so the assistant
only responds to professional questions, reducing unnecessary LLM usage. One challenge was handling
a large amount of portfolio info; I stored it in a vector database and retrieved only relevant
information before generating a response, improving scalability and response quality.

**Result:** The agent lets recruiters quickly understand my experience and projects through natural
conversation, demonstrating my ability to build practical AI systems using RAG, vector search, and
guardrails.

---

## Live Attendance System

**Problem:** Many schools and organizations rely on paper attendance registers, which are difficult
to manage over time. Monthly records create unnecessary paperwork, increase administrative effort,
and make historical data harder to find.

**What I Did:** Built a facial-recognition-based Live Attendance System during my AI internship.
New users first register their face; when marking attendance, the application compares the live
camera image with the registered face. If the similarity score meets the threshold, attendance is
recorded. Records are stored in an Excel file that admins can download, and the dashboard displays
daily attendance records with dates. Facial recognition reduces proxy attendance and improves
security. The biggest challenge was reducing webcam loading time; after deploying on **Hugging Face
Spaces** (Python + Streamlit), loading improved significantly.

**Result:** The system digitalizes attendance management, reduces paperwork, improves transparency,
and provides organized records. It gave me valuable experience with computer vision libraries and
showed that AI extends beyond language models into practical real-world applications.

---

## About Me
I'm an Agentic AI Engineer and Full-Stack Developer who enjoys building practical AI applications
that solve real-world problems. Experience includes AI-powered web apps, RAG-based assistants,
FastAPI backends, and modern Next.js interfaces. I enjoy learning new AI technologies and turning
ideas into production-ready solutions.

## Contact / Call To Action
I'm currently seeking internship and early-career opportunities where I can contribute to real AI
products while continuing to learn from experienced engineers. If you're looking for someone who
enjoys building practical AI applications and solving real-world problems, I'd be happy to connect.

## Before & After
- **Generic AI:** "Results-driven software engineer passionate about innovation and cutting-edge
  technologies."
- **My version:** "I enjoy building AI-powered applications that solve real problems. I focus on
  creating practical software that saves people time and makes everyday tasks easier through AI."
