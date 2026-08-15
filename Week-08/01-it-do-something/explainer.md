# Week 8: Backend Features Explainer

## What is a Backend?

A backend is the invisible part of your app that runs on a server and handles the stuff your frontend (the part users see) can't do alone. Your browser can show a form and collect text, but it can't send emails, store data securely, or run AI models—that's what the backend does. Think of it like a restaurant kitchen: the frontend is the menu and waiter, the backend is where the food actually gets made.

---

## Feature 1: Contact Form (EmailJS)

### What It Does
Users fill out a contact form on my portfolio and hit send. The message gets delivered directly to my email inbox. It's a real, working email—proof that data traveled from their device, through my code, and to my mailbox.

### How It Works (Data Flow)

1. **User types & submits** → Contact form on portfolio (frontend)
2. **My code captures** → Name, email, message fields
3. **Sends to EmailJS** → A third-party service that handles email delivery
4. **EmailJS sends email** → Uses SMTP (email protocol) to deliver to my inbox
5. **I receive it** → Email lands in my mailbox with their message

### The Backend Part
EmailJS is the backend here. It's a service running on someone else's server that takes the data my frontend sends and converts it into an actual email. I don't have to set up SMTP, configure SSL certificates, or manage email servers—EmailJS does that work. I just send it the data, it handles the rest.

**Why it's free:** EmailJS gives developers a free tier (200 emails/month). Perfect for portfolios.

---

## Feature 2: AI Search (Sentence Transformers + Supabase + Groq)

### What It Does
Users can ask questions or search for information related to my work/projects. The system finds the most relevant content from my portfolio data, then uses an AI model (Groq LLM) to generate a thoughtful answer. It's like a smart search + chatbot hybrid.

### How It Works (Data Flow)

#### Step 1: Building the Vector Database (Setup)
- I take my project descriptions, blog posts, or work samples
- **Sentence Transformers** converts each piece of text into vectors (long lists of numbers that represent meaning)
- These vectors are stored in **Supabase** (a PostgreSQL database with vector extensions)
- Now I have a searchable database where similar content has similar numbers

#### Step 2: When User Asks a Question (Runtime)
1. **User types a question** → "Tell me about your AI projects"
2. **My code sends question to Sentence Transformers** → Converts it to a vector
3. **Search in Supabase** → Finds stored vectors closest to the user's question (semantic similarity)
4. **Retrieves top results** → Gets the 3-5 most relevant pieces of my content
5. **Sends to Groq LLM** → "Here's what the user asked, here's relevant context, answer it"
6. **Groq generates answer** → Uses all that context to write a personalized response
7. **Response sent to user** → Displayed on portfolio in real-time

### Why This Architecture?

- **Sentence Transformers:** Free, open-source, runs on my frontend (no server cost)
- **Supabase:** Free PostgreSQL database with vector search built-in
- **Groq:** Fast, free LLM inference (much faster than GPT-4)
- **No backend server needed:** Everything runs on free tiers

### The Backend Part
Technically, Supabase *is* the backend (remote database server), and Groq's LLM runs on their servers too. My code is just the middleman—it prepares data, asks these services to do work, and delivers the result back to the user.

---

## Why These Features Matter

**Contact Form:** Proves I can wire user input → external service → real outcome (email delivery). Companies need developers who can ship forms that actually work.

**AI Search:** Proves I understand:
- Vector embeddings (converting text to machine-readable format)
- Semantic search (finding relevant info by meaning, not keywords)
- LLM integration (prompting AI with context, not just raw questions)
- Full-stack data flow (frontend → vector DB → LLM → response)

Both features work on free tiers, end-to-end, and show employable skills: form handling, API integration, and AI architecture.

---

## Summary

**Backend = services running somewhere else that handle the hard stuff**

My portfolio has two backends doing different work:
1. **EmailJS backend** → Takes form data, sends real emails
2. **Supabase + Groq backend** → Stores vectors, searches semantically, generates AI responses

The frontend (my React code) asks these backends to do jobs, they do the work, and users see results. That's full-stack development.