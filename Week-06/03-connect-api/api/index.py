"""
Task-related FastAPI application.

This file reuses the Week-01 minimal API (hardcoded endpoints) and adds
a new ``/term/dynamic`` endpoint that generates AI terms on-the-fly via
the Groq API.  The original endpoints (``/`` and ``/term``) are preserved
unchanged.
"""

import json
import os
import random

from fastapi import FastAPI, HTTPException
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

app = FastAPI(
    title="Minimal FastAPI API",
    description="A tiny REST API compatible with Vercel deployment.",
)

# Hardcoded list of AI terms (8-10 items)
TERMS = [
    {
        "term": "LLM",
        "definition": "Large Language Models are neural networks trained to understand and generate human-like text.",
    },
    {
        "term": "RAG",
        "definition": "Retrieval-Augmented Generation combines external knowledge with an LLM to produce more accurate responses.",
    },
    {
        "term": "AI Agent",
        "definition": "An AI Agent can perceive its environment, decide actions, and take steps to achieve goals.",
    },
    {
        "term": "Embedding",
        "definition": "Embeddings are vector representations that capture meaning so similar text can be found efficiently.",
    },
    {
        "term": "Token",
        "definition": "A token is a piece of text (like a word or subword) the model processes at each step.",
    },
    {
        "term": "Prompt Engineering",
        "definition": "Prompt engineering is the practice of designing inputs to guide an AI model toward better outputs.",
    },
    {
        "term": "Fine-tuning",
        "definition": "Fine-tuning adapts a pretrained model on new data to improve performance for a specific task.",
    },
    {
        "term": "Vector Database",
        "definition": "A vector database stores embeddings and supports fast similarity search for retrieval.",
    },
]


@app.get("/")
def root():
    """Welcome message + list of available endpoints."""
    return {
        "message": "Welcome! This is a minimal FastAPI REST API.",
        "endpoints": [
            {"method": "GET", "path": "/"},
            {"method": "GET", "path": "/term"},
            {"method": "GET", "path": "/term/dynamic"},
        ],
    }


@app.get("/term")
def get_random_term():
    """Return one random AI term and its short definition."""
    item = random.choice(TERMS)
    return {
        "term": item["term"],
        "definition": item["definition"],
    }


@app.get("/term/dynamic")
def get_dynamic_term():
    """
    Generate a random AI term + definition on-the-fly using Groq.
    Requires GROQ_API_KEY in the environment (or a .env file).
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Groq API key not configured. Set GROQ_API_KEY in your environment or .env file.",
        )

    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that generates concise AI "
                    "terminology. Return ONLY a single JSON object with exactly "
                    'two keys: "term" (a short string) and "definition" '
                    "(a one-sentence string). No extra text, no code fences, no "
                    "markdown. Just raw JSON."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Give me a random AI term and its concise one-sentence "
                    "definition. Return only valid JSON."
                ),
            },
        ],
        max_tokens=200,
        temperature=0.8,
    )

    raw = response.choices[0].message.content.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {
            "term": "Error",
            "definition": "Could not parse the generated response. The LLM returned: " + raw[:200],
        }

    return {
        "term": data.get("term", "Unknown"),
        "definition": data.get("definition", "No definition provided."),
    }
