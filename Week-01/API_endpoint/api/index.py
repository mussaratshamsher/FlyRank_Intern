from fastapi import FastAPI
import random

app = FastAPI(
    title="Minimal FastAPI API",
    description="A tiny REST API compatible with Vercel deployment.",
)

# Hardcoded list of AI terms (8–10 items)
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

@app.get("/terms")
def get_random_terms_alias():
    """Alias for clients that call /terms (plural)."""
    return get_random_term()
