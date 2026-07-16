# input

Answer using these sections:

1. Folder Structure
2. Dependencies
3. API Endpoints
4. Source Code
5. Deployment

## output

1. Folder Structure
chatbot-backend/
│
├── app/
│   ├── api/
│   │   ├── chat.py
│   │   ├── health.py
│   │   └── __init__.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── exceptions.py
│   │
│   ├── models/
│   │   ├── request.py
│   │   └── response.py
│   │
│   ├── services/
│   │   ├── chatbot.py
│   │   └── llm.py
│   │
│   ├── main.py
│   └── __init__.py
│
├── tests/
│
├── .env
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── run.py
└── README.md
2. Dependencies

requirements.txt

fastapi
uvicorn[standard]
pydantic
python-dotenv
httpx
python-multipart
orjson

Install:

pip install -r requirements.txt
3. API Endpoints
Health Check
GET /health

Response

{
  "status": "healthy"
}
Chat
POST /chat

Request

{
  "message": "Hello"
}

Response

{
  "reply": "Hi! How can I help?"
}
4. Source Code
.env
APP_NAME=Company AI Chatbot
HOST=0.0.0.0
PORT=8000
app/core/config.py
from dotenv import load_dotenv
import os

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "Chatbot")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
app/models/request.py
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
app/models/response.py
from pydantic import BaseModel

class ChatResponse(BaseModel):
    reply: str
app/services/llm.py

Replace this file with OpenAI, Gemini, Groq, or another LLM integration later.

async def ask_llm(message: str) -> str:
    return "Hi! How can I help?"
app/services/chatbot.py
from app.services.llm import ask_llm

class ChatbotService:

    async def chat(self, message: str):
        return await ask_llm(message)

chatbot_service = ChatbotService()
app/api/chat.py
from fastapi import APIRouter
from app.models.request import ChatRequest
from app.models.response import ChatResponse
from app.services.chatbot import chatbot_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    reply = await chatbot_service.chat(request.message)

    return ChatResponse(reply=reply)
app/api/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health():

    return {
        "status": "healthy"
    }
app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.health import router as health_router
from app.core.config import APP_NAME

app = FastAPI(
    title=APP_NAME,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(health_router)

@app.get("/")
async def root():
    return {
        "message": "Company AI Chatbot API"
    }
run.py
import uvicorn

from app.core.config import HOST, PORT

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=True
    )
5. Deployment
Run Locally

Install dependencies:

pip install -r requirements.txt

Start the development server:

python run.py

Or use Uvicorn directly:

uvicorn app.main:app --reload

The API will be available at:

http://localhost:8000

Interactive API documentation:

Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc
Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

Build and run with Docker:

docker build -t chatbot-backend .
docker run -p 8000:8000 chatbot-backend
docker-compose.yml
version: "3.9"

services:
  chatbot-api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped

Start with Docker Compose:

docker compose up --build

This backend provides a clean, maintainable foundation for a Next.js frontend. The LLM integration is isolated in app/services/llm.py, making it straightforward to replace the placeholder implementation with OpenAI, Gemini, Groq, or another AI provider without changing the API layer.