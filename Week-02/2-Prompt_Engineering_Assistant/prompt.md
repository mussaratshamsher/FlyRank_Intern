# Prompt Engineering Assignment

## Topic

### Build a FastAPI Backend for an AI Chatbot**

---

# Baseline (Weak Prompt)

## Prompt

> Build a FastAPI backend for a chatbot.

## Representative Output

- Creates a simple FastAPI app.
- Adds one `/chat` endpoint.
- Returns a hardcoded response.
- No validation.
- No error handling.
- No API documentation.
- Not production ready.

---

# Version 1 – Add a Clear Goal
## Prompt

> Build a FastAPI backend for a chatbot that can receive user messages and return AI-generated responses.

## Representative Output

- Introduces a clear purpose for the API.
- Accepts user messages.
- Returns chatbot responses.
- Includes a request model.
- Better organized than the baseline.

### Notes

#### What changed in the prompt?

Added a clear goal.

#### What improved in the output?

The API now focuses specifically on building a chatbot instead of generating a generic FastAPI application.

#### What still failed?

The response still lacks implementation details such as session handling and production considerations.

#### What would I try next?

Define the intended audience.

---

# Version 2 – Add an Audience

## Prompt

> Build a FastAPI backend for a chatbot that receives user messages and returns AI responses. The backend is intended for developers integrating it with a Next.js frontend.

## Representative Output

- Uses JSON APIs.
- Adds request and response models.
- Better endpoint naming.
- Includes CORS configuration.
- Explains how frontend developers can consume the API.

### Notes

#### What changed in the prompt?
Added the target audience.

#### What improved in the output?
The explanation became more relevant for frontend developers and included integration guidance.

#### What still failed?
The backend implementation itself remained fairly basic.

#### What would I try next?
Provide project context.

---

# Version 3 – Add Context

## Prompt
> Build a FastAPI backend for a chatbot that receives user messages and returns AI responses. The backend will connect to the OpenAI Responses API and a Next.js frontend using session-based conversations.

## Representative Output
- Introduces session IDs.
- Better request validation.
- Explains OpenAI integration.
- Shows how the frontend and backend interact.
- Provides a more realistic architecture.

### Notes

#### What changed in the prompt?
Added project context.

#### What improved in the output?
The generated solution became much closer to a real-world chatbot backend instead of a simple API example.

#### What still failed?
The response was still difficult to navigate because everything was presented together.

#### What would I try next?
Specify an output format.

---

# Version 4 – Add an Output Format

## Prompt
> Build a FastAPI backend for a chatbot that receives user messages and returns AI responses. The backend will connect to the OpenAI Responses API and a Next.js frontend using session-based conversations.
>
> Present the answer in the following order:
> - Project structure
> - API endpoints
> - Example code
> - Deployment steps

## Representative Output
- Organized into sections.
- Includes folder structure.
- Separates explanations from code.
- Easier to follow.
- Better readability.

### Notes

#### What changed in the prompt?
Added a required output format.

#### What improved in the output?
The response became much easier to read, understand, and implement because the information was organized logically.

#### What still failed?
Deployment guidance remained fairly generic.

#### What would I try next?
Specify quality requirements.

---

# Version 5 – Add Quality Criteria

## Prompt
> Build a FastAPI backend for a chatbot that receives user messages and returns AI responses. The backend will connect to the OpenAI Responses API and a Next.js frontend using session-based conversations.
>
> Present the answer in the following order:
> - Project structure
> - API endpoints
> - Example code
> - Deployment steps
>
> Ensure the solution follows FastAPI best practices, includes proper error handling, type hints, validation, security considerations, and production-ready code.

## Representative Output
- Adds robust validation.
- Uses proper type hints.
- Includes exception handling.
- Suggests environment variables.
- Recommends logging.
- Includes security best practices.
- Produces a production-ready architecture.

### Notes

#### What changed in the prompt?
Added quality criteria.

#### What improved in the output?
The generated solution became significantly more reliable, secure, maintainable, and suitable for production deployment.

#### What still failed?
Deployment instructions are still somewhat high level and not cloud-provider specific.

#### What would I try next?
Request deployment instructions for Docker and Render.

---

# Honest Reflection (Required)

**Version 2 (Audience)** did **not** significantly improve the technical quality of the backend. It mainly improved the explanations and integration guidance for frontend developers. This demonstrated that identifying an audience improves communication more than implementation quality.

---

# Final Reusable Prompt

> Build a production-ready FastAPI backend for an AI chatbot that receives user messages and returns AI-generated responses. The backend will integrate with the OpenAI Responses API and a Next.js frontend using session-based conversations.
>
> Present the solution in the following order:
> 1. Project folder structure
> 2. Required dependencies
> 3. Complete FastAPI implementation
> 4. API endpoint explanations
> 5. Request and response examples
> 6. Error handling strategy
> 7. Environment variable configuration
> 8. Security best practices
> 9. Deployment using Docker and Render
>
> Ensure the code follows FastAPI best practices, uses Pydantic models, type hints, validation, proper exception handling, and is production-ready with clear comments.

---

# Checklist

- ✅ Baseline prompt
- ✅ Five improved prompt versions
- ✅ Exactly one new prompt engineering layer added in each version
- ✅ Representative output for each version
- ✅ Four analysis notes for every version
- ✅ One honest "this didn't help much" reflection
- ✅ Final reusable prompt