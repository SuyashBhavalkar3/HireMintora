# Document 01 — Pre-existing Codebase Inventory
> **Purpose**: Snapshot of everything that existed in the HireMintora Node.js backend
> **before** any new feature work began. Use this as the baseline reference if the
> project is handed to a new team.

---

## 1. Project Overview

| Property       | Value                              |
|----------------|------------------------------------|
| Runtime        | Node.js                            |
| Framework      | Express 5                          |
| Database ORM   | Prisma 6 / 7 (Prisma 7 CLI, PrismaClient-JS) |
| Database       | PostgreSQL via Supabase (ap-northeast-1) |
| Real-time      | WebSocket (`ws` library)           |
| AI STT         | Sarvam AI (`saaras:v3`)            |
| AI TTS         | Sarvam AI (`bulbul:v3`)            |
| AI LLM         | Groq (`llama-3.3-70b-versatile`) — also supports OpenAI & Gemini |
| API Docs       | Swagger UI (`/api-docs`) + AsyncAPI (`/asyncapi.yaml`) |
| Dev Server     | Nodemon                            |
| Connection pooling | PgBouncer (Supabase pooler port 6543) |

---

## 2. Directory Structure

```
server/
├── prisma/
│   └── schema.prisma          # Prisma schema (was empty — only generator + datasource stubs)
├── prisma.config.ts           # Prisma 7 config: loads DIRECT_URL for migrations
├── src/
│   ├── server.js              # Express app entry point + HTTP server + WS mount
│   ├── swagger.js             # Swagger JSDoc config (scans src/**/*.js)
│   └── websocket/
│       ├── index.js           # Barrel export for the WebSocket module
│       ├── websocketServer.js # WebSocket server — parses connections, routes events
│       ├── interviewSession.js # Core session class (per-connection state)
│       ├── sessionManager.js  # In-memory session registry (Map)
│       ├── stateMachine.js    # Finite state machine: LISTENING → PROCESSING → SPEAKING
│       ├── sentenceBuffer.js  # Buffers LLM tokens into complete sentences for TTS
│       ├── constants.js       # WS_EVENTS, INTERVIEW_STATES, INTERVIEW_MODES enums
│       └── services/
│           ├── streamingAdapter.js  # Base class for all streaming AI services
│           ├── sttService.js        # Sarvam Speech-to-Text WebSocket integration
│           ├── ttsService.js        # Sarvam Text-to-Speech WebSocket integration
│           └── llmService.js        # Multi-provider LLM (Groq / OpenAI / Gemini)
├── public/
│   └── api-docs.html          # Combined Swagger + AsyncAPI docs page
├── docs/
│   ├── Interview_script_prompt_AIbot.txt
│   ├── analysis_results.txt   # Internal code quality analysis (rated 8.5/10)
│   └── things to remember.txt
├── asyncapi.yaml              # AsyncAPI 2.x spec for the WebSocket interview channel
├── package.json
└── .env                       # Environment variables (API keys, DB URLs)
```

---

## 3. HTTP Endpoints (Pre-existing)

| Method | Path            | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/health`       | Health check — returns `{ ok: true }`   |
| GET    | `/api-docs`     | Swagger UI                               |
| GET    | `/asyncapi.yaml`| Raw AsyncAPI spec download               |
| GET    | `/docs`         | Combined API docs HTML page              |

---

## 4. WebSocket Endpoint

| Path            | Protocol | Description                              |
|-----------------|----------|------------------------------------------|
| `/ws/interview` | WS       | AI interview real-time session           |

### Connection Query Parameters
| Param       | Required | Description                              |
|-------------|----------|------------------------------------------|
| `sessionId` | ✅ Yes   | Unique interview session identifier      |
| `tokenId`   | No       | Candidate token (future DB lookup hook)  |
| `mode`      | No       | `default` (voice) or `coding`           |

### WebSocket Events (Client → Server)
| Event            | Payload                        | Description               |
|------------------|--------------------------------|---------------------------|
| `audio_chunk`    | `{ audio, encoding, sampleRate }` | Stream PCM audio to STT |
| `audio_end`      | `{}`                           | Finalise STT stream       |
| `text_answer`    | `{ text }`                     | Text-only answer          |
| `code_submission`| `{ code }`                     | Code interview submission |
| `cancel_turn`    | `{}`                           | Interrupt current AI turn |

### WebSocket Events (Server → Client)
| Event              | Payload                              | Description               |
|--------------------|--------------------------------------|---------------------------|
| `transcript_partial` | `{ transcript, turnId }`           | Live STT partial result   |
| `transcript_final`   | `{ transcript, turnId }`           | Final STT result          |
| `ai_text_chunk`      | `{ text, turnId }`                 | LLM streaming token       |
| `tts_audio_chunk`    | `{ audio, contentType, turnId }`   | TTS audio chunk (base64)  |
| `state_change`       | `{ state, reason, error, turnId, mode, sessionId }` | Session state update |

---

## 5. AI Service Architecture

### State Machine
```
LISTENING ──► PROCESSING ──► SPEAKING
    ▲               │              │
    └───────────────┴──────────────┘
```

### LLM Providers (configurable via `LLM_PROVIDER` env var)
| Provider | Env Key             | Default Model               |
|----------|---------------------|-----------------------------|
| `groq`   | `GROQ_API_KEY`      | `llama-3.3-70b-versatile`   |
| `openai` | `OPENAI_API_KEY`    | `gpt-4o-mini`               |
| `gemini` | `GEMINI_API_KEY`    | `gemini-1.5-flash`          |

### STT (Sarvam `saaras:v3`)
- Language: `en-IN`
- Sample rate: 16000 Hz
- Codec: `pcm_s16le` (auto-wrapped to WAV)
- VAD signals enabled, flush signal enabled

### TTS (Sarvam `bulbul:v3`)
- Language: `en-IN`, Speaker: `shubh`
- Output: MP3 @ 128k
- SentenceBuffer drains complete sentences before speaking

---

## 6. Database (Prisma)

**State**: Schema file existed but had **no models** — only the generator and datasource blocks were present. No migrations had been run.

```prisma
// Pre-existing schema — no models
generator client {
  provider = "prisma-client"   // Note: this was "prisma-client" (incorrect — no JS client)
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  // url was missing — not yet connected
}
```

---

## 7. Environment Variables (Pre-existing)

| Variable                     | Purpose                                  |
|------------------------------|------------------------------------------|
| `GROQ_API_KEY`               | Groq LLM API key                         |
| `SARVAM_API_KEY`             | Sarvam STT + TTS API key                 |
| `LLM_PROVIDER`               | Active LLM: `groq` / `openai` / `gemini` |
| `OPENAI_API_KEY`             | OpenAI key (optional)                    |
| `GEMINI_API_KEY`             | Gemini key (optional)                    |
| `GROQ_MODEL`                 | Groq model name                          |
| `OPENAI_MODEL`               | OpenAI model name                        |
| `GEMINI_MODEL`               | Gemini model name                        |
| `LLM_TEMPERATURE`            | LLM sampling temperature (0–1)           |
| `SARVAM_STT_*`               | All Sarvam STT configuration vars        |
| `SARVAM_TTS_*`               | All Sarvam TTS configuration vars        |
| `DATABASE_URL`               | Pooled Supabase PostgreSQL URL (port 6543) |
| `DIRECT_URL`                 | Direct Supabase PostgreSQL URL (port 5432, for migrations) |

---

## 8. NPM Dependencies (Pre-existing)

### Production
| Package               | Version   | Purpose                              |
|-----------------------|-----------|--------------------------------------|
| `@asyncapi/generator` | ^1.1.11   | AsyncAPI docs generation             |
| `@asyncapi/html-template` | ^3.5.6 | AsyncAPI HTML template              |
| `@prisma/client`      | ^7.7.0    | Prisma ORM client                    |
| `cors`                | ^2.8.6    | CORS middleware                      |
| `dotenv`              | ^17.4.2   | Environment variable loading         |
| `express`             | ^5.2.1    | HTTP framework                       |
| `sarvamai`            | ^1.1.6    | Sarvam AI SDK (STT WebSocket)        |
| `swagger-jsdoc`       | ^6.2.8    | OpenAPI spec generation from JSDoc   |
| `swagger-ui-express`  | ^5.0.1    | Swagger UI middleware                |
| `ws`                  | ^8.20.0   | Native WebSocket server              |

### Dev
| Package          | Version  | Purpose                  |
|------------------|----------|--------------------------|
| `@types/node`    | ^25.6.0  | Node.js type definitions |
| `nodemon`        | ^3.1.14  | Dev auto-restart         |
| `prisma`         | ^6.19.3  | Prisma CLI               |

---

## 9. Known Gaps Identified (Pre-existing Analysis)

From `docs/analysis_results.txt` (internal code quality review, rated **8.5/10**):

1. **No input validation** — WebSocket payloads not validated (risk: runtime crashes from malformed messages)
2. **No structured logging** — `console.log` used; production needs Pino/Winston
3. **No fetch timeouts** — LLM/STT calls can hang indefinitely
4. **`systemPrompt` hardcoded** — prompt was a static string in `websocketServer.js`; not yet dynamically fetched from DB using `tokenId`
5. **No authentication** — zero auth middleware; no Organisation/Candidate model in DB

---

*Document generated: 2026-04-20 | Baseline for: HireMintora Node.js backend*
