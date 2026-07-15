# Portfolio Case Studies

## Voice Card

**Clear • Honest • Professional • Practical • Friendly • No Buzzwords**

---

# AI Content Analyzer

## Problem

Students and working professionals often spend a lot of time reading long documents, emails, and messages. They also need to manually identify spelling mistakes and understand the main points before taking action. I wanted to build a tool that could analyze content within seconds and help users understand it quickly.

## What I Did

I built an AI-powered Content Analyzer using a **Next.js frontend** and a **FastAPI backend**. When a user pastes text and clicks **Generate**, the frontend sends a POST request to the backend. The backend uses the **Hiruistic-v1** model to analyze the content and returns a summary, keywords, and content type.

I intentionally separated the frontend and backend to keep the application modular and easier to maintain. FastAPI handled the AI processing efficiently, while Next.js gave me greater control over building a responsive and user-friendly interface.

During development, I faced an issue where requests were not reaching the backend because of middleware and proxy behavior. After investigating the problem, I implemented a Next.js API route, which resolved the communication issue between the frontend and backend.

## Result

The application helps users understand long paragraphs, emails, and messages much faster by generating concise summaries and highlighting important keywords. It saves time, improves productivity, and demonstrates how specialized AI models can solve practical problems without relying on large language models.

---

# Portfolio AI Agent

## Problem

Recruiters and clients often don't have time to explore every page of a portfolio. I wanted visitors to quickly learn about my skills, projects, technologies, and contact information without searching through multiple sections.

## What I Did

I developed an AI-powered Portfolio Agent that answers professional questions about me. Visitors can ask about my projects, technical skills, experience, or contact information through a conversational interface.

To make the responses accurate, I implemented a **RAG (Retrieval-Augmented Generation)** architecture. Instead of relying on the LLM's general knowledge, the agent retrieves information directly from my own portfolio data using vector search.

I also added **guardrails** to ensure the assistant only responds to professional questions. Irrelevant or personal questions are blocked, reducing unnecessary LLM usage and keeping the conversation focused on the portfolio.

One challenge was handling a large amount of portfolio information. Rather than sending everything to the LLM, I stored the data in a vector database and retrieved only the relevant information before generating a response. This improved scalability and response quality.

## Result

The Portfolio AI Agent allows recruiters to quickly understand my experience and projects through natural conversation. It demonstrates my ability to build practical AI systems using RAG, vector search, and guardrails while focusing on reliability and user experience.

---

# Live Attendance System

## Problem

Many schools and organizations still rely on paper attendance registers, which become difficult to manage over time. Maintaining monthly records creates unnecessary paperwork, increases administrative effort, and makes it harder to find historical attendance data.

## What I Did

I built a facial recognition-based Live Attendance System during my AI internship. New users first register their face in the system. When they mark attendance, the application compares the live camera image with the registered face. If the similarity score meets the required threshold, attendance is recorded successfully.

Attendance records are stored in an Excel file that administrators can download, while the dashboard also displays daily attendance records with dates for easy monitoring.

Although facial recognition was part of the internship requirements, I also believe it provides a better solution than manual forms or QR codes because it reduces proxy attendance and improves security.

The biggest challenge was reducing the webcam loading time. The project was built using Python and Streamlit, and the initial deployment affected performance. After deploying the application on Hugging Face Spaces, the loading time improved significantly and the overall user experience became much smoother.

## Result

The system digitalizes attendance management, reduces paperwork, improves transparency, and provides administrators with organized attendance records. It also gave me valuable experience working with computer vision libraries and showed me that AI extends far beyond language models into practical real-world applications.

---

# About Me

I'm an Agentic AI Engineer and Full-Stack Developer who enjoys building practical AI applications that solve real-world problems. My experience includes developing AI-powered web applications, RAG-based assistants, FastAPI backends, and modern Next.js interfaces. I enjoy learning new AI technologies and turning ideas into production-ready solutions that are useful, scalable, and easy to use.

---

# Contact / Call To Action

I'm currently seeking internship and early-career opportunities where I can contribute to real AI products while continuing to learn from experienced engineers. If you're looking for someone who enjoys building practical AI applications and solving real-world problems, I'd be happy to connect.

---

# Before & After

### Generic AI Version

> Results-driven software engineer passionate about innovation and cutting-edge technologies.

### My Edited Version

> I enjoy building AI-powered applications that solve real problems. I focus on creating practical software that saves people time and makes everyday tasks easier through AI.
