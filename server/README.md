# HireMintora — Backend Server

> Node.js · Express · Prisma · PostgreSQL · WebSockets · Sarvam AI · Groq

## Quick Start (Development)

```bash
cp .env.example .env        # Fill in API keys and DB URLs
npx prisma migrate deploy   # Apply DB migrations
npx prisma generate         # Generate Prisma client
npm run dev                 # Starts on :3000
```

## Key Endpoints
- **Swagger REST docs:** http://localhost:3000/api-docs
- **WebSocket (interview):** `ws://localhost:3000/ws/interview?sessionId=&tokenId=&mode=default`
- **Health check:** http://localhost:3000/health

## Structure
```
src/
├── server.js               # Entrypoint — Express + HTTP + WS boot
├── lib/prismaClient.js     # Singleton Prisma client
├── middlewares/
│   └── auth.middleware.js  # JWT Bearer token validation
├── api/
│   ├── auth/               # POST /api/auth/user/signup|login|oauth
│   ├── organisation/       # POST /api/organisation (create/join)
│   └── drive/              # POST|GET /api/drive/**
└── websocket/
    ├── websocketServer.js  # WS connection + message routing
    ├── sessionManager.js   # In-memory session registry
    ├── interviewSession.js # Per-session state + DB commit logic
    ├── stateMachine.js     # LISTENING/PROCESSING/SPEAKING FSM
    ├── sentenceBuffer.js   # Batches LLM tokens into sentences for TTS
    └── services/
        ├── sttService.js   # Sarvam Speech-to-Text
        ├── ttsService.js   # Sarvam Text-to-Speech
        └── llmService.js   # Groq/OpenAI/Gemini (configurable via LLM_PROVIDER)
```

## Environment Variables
See `.env` (never commit). Critical vars:
- `JWT_SECRET` — must be a long random string in production
- `GROQ_API_KEY` / `SARVAM_API_KEY` — required for AI features
- `DATABASE_URL` / `DIRECT_URL` — Supabase connection strings
- `CORS_ORIGINS` — comma-separated allowed origins in production (leave unset for dev `*`)

## Migrations (Production)
Run migrations **before** starting the server — never inside the process:
```bash
npx prisma migrate deploy
```

## Full Documentation
See the [Architecture Guide](../docs/ARCHITECTURE.md) for the complete data model, WebSocket protocol, pipeline diagram, and production readiness checklist.
