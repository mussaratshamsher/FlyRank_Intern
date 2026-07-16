# input

You are a senior FastAPI backend engineer.

Build a FastAPI backend for a chatbot.

# output

For a production chatbot backend, I would use a layered architecture that keeps the API, business logic, and AI provider separate. This makes it easy to switch from OpenAI to Gemini, Groq, Ollama, or another provider without changing the API.

chatbot-backend/
│
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   └── health.py
│   │   │
│   │   └── router.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── security.py
│   │
│   ├── models/
│   │   └── schemas.py
│   │
│   ├── services/
│   │   ├── chatbot.py
│   │   └── llm.py
│   │
│   ├── utils/
│   │   └── helpers.py
│   │
│   ├── main.py
│   │
│   └── __init__.py
│
├── tests/
│
├── .env
├── requirements.txt
├── README.md
└── run.py