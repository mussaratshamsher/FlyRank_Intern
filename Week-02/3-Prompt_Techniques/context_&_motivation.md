# input

You are a senior FastAPI backend engineer.
I'm building an AI chatbot for a company website.
The backend will connect to a Next.js frontend and should be easy to maintain becausjunior developers will continue working on it.
Build the backend.

## output

For a company chatbot that will be maintained by junior developers, I would optimize for clarity, modularity, and scalability rather than clever abstractions. Each file should have a single responsibility, dependencies should be explicit, and swapping the LLM provider should require changing only one module.

### Architecture

chatbot-backend/
│
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── chat.py
│   │   │   ├── health.py
│   │   │   └── router.py
│   │   │
│   │   └── __init__.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logger.py
│   │   └── lifespan.py
│   │
│   ├── models/
│   │   ├── request.py
│   │   └── response.py
│   │
│   ├── services/
│   │   ├── chatbot_service.py
│   │   ├── llm_service.py
│   │   └── memory_service.py
│   │
│   ├── repositories/
│   │   └── conversation_repository.py
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
├── Dockerfile
├── README.md
└── run.py