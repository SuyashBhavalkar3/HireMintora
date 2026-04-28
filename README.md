# HireMintora — AI-Powered Recruitment Platform

> **Monorepo** containing an Express/Node.js backend, a Next.js HR dashboard, and a
> standalone Next.js candidate interview client.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Server (Backend)](#1-server-backend)
  - [2. Client (HR Dashboard)](#2-client-hr-dashboard)
  - [3. Interview Client (Candidate UI)](#3-interview-client-candidate-ui)
- [Environment Variables](#environment-variables)
- [Database Schema Overview](#database-schema-overview)
- [API Reference](#api-reference)
  - [REST Endpoints](#rest-endpoints)
  - [WebSocket Protocol](#websocket-protocol)
- [Authentication Flow](#authentication-flow)
- [Interview Pipeline](#interview-pipeline)
- [Key Design Decisions](#key-design-decisions)
- [Production Checklist](#production-checklist)

---

## Overview

HireMintora automates first-round technical interviews for HR teams using AI.
The platform lets employers:

1. **Create organisations** and invite teammates.
2. **Set up hiring drives** (recruitment campaigns per role).
3. **Import candidates** and dispatch unique, cryptographic access tokens.
4. **Run real-time AI interviews** — Speech-to-Text → LLM → Text-to-Speech — streamed
   over WebSockets for a live conversational experience.
5. **Persist full transcripts** to PostgreSQL for review and audit.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Browser Clients                              │
│   ┌─────────────────────┐          ┌─────────────────────────────┐   │
│   │   client/ (Next.js) │          │ interview_client/ (Next.js) │   │
│   │   HR Dashboard      │          │ Candidate Interview UI      │   │
│   │   Port :3001        │          │ Port :3002                  │   │
│   └────────┬────────────┘          └──────────┬──────────────────┘   │
│            │ REST (fetch)                     │ WebSocket            │
└────────────┼──────────────────────────────────┼──────────────────────┘
             │                                  │
             ▼                                  ▼
    ┌────────────────────────────────────────────────────┐
    │              server/ (Express + ws)                │
    │              Port :3000                            │
    │                                                    │
    │  ┌──────────┐  ┌─────────────┐  ┌──────────────┐   │
    │  │ REST API │  │  WebSocket  │  │   Prisma     │   │
    │  │ (auth,   │  │  Interview  │  │   ORM        │   │
    │  │  org,    │  │  Server     │  │              │   │
    │  │  drive)  │  │             │  │              │   │
    │  └──────────┘  └──────┬──────┘  └──────┬───────┘   │
    │                       │                │           │
    └───────────────────────┼────────────────┼──────────┘
                            │                │
              ┌─────────────┼─────┐          │
              │             │     │          │
              ▼             ▼     ▼          ▼
         ┌────────┐  ┌──────┐ ┌──────┐  ┌──────────┐
         │ Sarvam │  │ Groq │ │OpenAI│  │PostgreSQL│
         │ STT/TTS│  │ LLM  │ │/Gemini│ │(Supabase)│
         └────────┘  └──────┘ └──────┘  └──────────┘
```

---

## Tech Stack

| Layer              | Technology                                             |
| ------------------ | ------------------------------------------------------ |
| **Backend**        | Node.js, Express 5, `ws` (WebSockets)                  |
| **Database**       | PostgreSQL (Supabase-hosted), Prisma ORM               |
| **Auth**           | JWT (manual), Supabase OAuth (Google)                   |
| **AI – STT**       | Sarvam AI (`saaras:v3` model, streaming WebSocket)     |
| **AI – TTS**       | Sarvam AI (`bulbul:v3` model, streaming WebSocket)     |
| **AI – LLM**       | Groq / OpenAI / Gemini (configurable via env var)      |
| **HR Dashboard**   | Next.js (App Router), React, Vanilla CSS               |
| **Interview UI**   | Next.js (App Router), React, Tailwind CSS              |
| **API Docs**       | Swagger (OpenAPI 3.0), AsyncAPI for WebSocket protocol |

---

## Repository Structure

```
HireMintora_Node/
├── server/                          # Express backend (REST + WebSocket)
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (6 models)
│   │   └── migrations/              # Prisma migration history
│   ├── src/
│   │   ├── server.js                # Entry point — boots Express + WS
│   │   ├── swagger.js               # Swagger/OpenAPI config
│   │   ├── lib/
│   │   │   └── prismaClient.js      # Singleton Prisma client
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js    # JWT Bearer token verification
│   │   ├── api/                     # REST API routes
│   │   │   ├── index.js             # Barrel export
│   │   │   ├── auth/                # Signup, Login, OAuth
│   │   │   ├── organisation/        # Create/Join organisation
│   │   │   └── drive/               # Hiring drives + candidate mgmt
│   │   └── websocket/               # Real-time interview engine
│   │       ├── websocketServer.js   # WS connection handling
│   │       ├── sessionManager.js    # In-memory session registry
│   │       ├── interviewSession.js  # Per-session orchestrator
│   │       ├── stateMachine.js      # LISTENING/PROCESSING/SPEAKING FSM
│   │       ├── sentenceBuffer.js    # Batches LLM tokens → sentences
│   │       ├── constants.js         # Shared enums/event names
│   │       └── services/
│   │           ├── llmService.js    # Multi-provider LLM streaming
│   │           ├── sttService.js    # Sarvam Speech-to-Text
│   │           ├── ttsService.js    # Sarvam Text-to-Speech
│   │           └── streamingAdapter.js  # Base streaming abstraction
│   ├── .env                         # Environment vars (never commit)
│   └── package.json
│
├── client/                          # Next.js HR Dashboard
│   ├── app/
│   │   ├── layout.tsx               # Root layout + AuthProvider
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Full design system
│   │   ├── auth/
│   │   │   ├── login/page.tsx       # Login (manual + Google OAuth)
│   │   │   ├── signup/page.tsx      # Signup (manual + Google OAuth)
│   │   │   └── callback/page.tsx    # OAuth redirect handler
│   │   ├── onboarding/page.tsx      # Create or Join organisation
│   │   └── dashboard/
│   │       ├── page.tsx             # Dashboard overview
│   │       ├── drives/page.tsx      # List all hiring drives
│   │       └── drive/
│   │           ├── new/page.tsx     # Create new hiring drive
│   │           └── [id]/page.tsx    # Drive detail + candidates
│   ├── components/
│   │   ├── Navbar.tsx               # Shared navigation bar
│   │   ├── CandidateTable.tsx       # Candidate listing table
│   │   └── ImportCandidatesModal.tsx # Bulk candidate import modal
│   ├── context/
│   │   └── AuthContext.tsx          # React auth state provider
│   ├── lib/
│   │   ├── api.ts                   # Typed API client (fetch wrapper)
│   │   ├── auth.ts                  # Token/User localStorage helpers
│   │   ├── drives.ts               # Drive cache (localStorage)
│   │   └── supabase.ts             # Supabase client singleton
│   └── package.json
│
├── interview_client/                # Next.js Candidate Interview UI
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Entry (validates tokenId, renders UI)
│   │   └── globals.css              # Interview-specific styles
│   ├── components/
│   │   └── InterviewUI.tsx          # Full interview experience component
│   └── package.json
│
└── README.md                        # ← You are here
```

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9
- **PostgreSQL** database (Supabase free tier works)
- API keys for:
  - **Sarvam AI** — STT and TTS (`SARVAM_API_KEY`)
  - **Groq** (or OpenAI/Gemini) — LLM generation (`GROQ_API_KEY`)
  - **Supabase** — OAuth + database hosting

---

## Getting Started

### 1. Server (Backend)

```bash
cd server

# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env    # Then fill in your actual API keys and DB URLs

# 3. Apply database migrations
npx prisma migrate deploy

# 4. Generate Prisma client
npx prisma generate

# 5. Start in development mode (hot-reload with nodemon)
npm run dev
```

The server starts at **http://localhost:3000**.

| Endpoint                        | Description               |
| ------------------------------- | ------------------------- |
| `http://localhost:3000/api-docs` | Swagger REST docs         |
| `http://localhost:3000/health`   | Health check              |
| `ws://localhost:3000/ws/interview` | WebSocket interview endpoint |

### 2. Client (HR Dashboard)

```bash
cd client

# 1. Install dependencies
npm install

# 2. Create .env.local with:
#    NEXT_PUBLIC_API_URL=http://localhost:3000
#    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# 3. Start development server
npm run dev
```

The HR dashboard starts at **http://localhost:3001**.

### 3. Interview Client (Candidate UI)

```bash
cd interview_client

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The interview client starts at **http://localhost:3002**.
Candidates access it via: `http://localhost:3002?tokenId=<unique-candidate-token>`

---

## Environment Variables

### Server (`server/.env`)

| Variable                | Required | Description                                           |
| ----------------------- | -------- | ----------------------------------------------------- |
| `JWT_SECRET`            | ✅        | Secret key for signing JWTs. Use a 64+ char random hex. |
| `JWT_EXPIRES_IN`        | No       | Token expiry (default: `7d`)                          |
| `DATABASE_URL`          | ✅        | PostgreSQL connection string (pooled, for Prisma)     |
| `DIRECT_URL`            | ✅        | Direct PostgreSQL connection (for migrations)         |
| `GROQ_API_KEY`          | ✅*       | Groq API key (*if using Groq as LLM provider)        |
| `SARVAM_API_KEY`        | ✅        | Sarvam AI API key for STT/TTS                        |
| `LLM_PROVIDER`          | No       | `groq` (default), `openai`, or `gemini`              |
| `OPENAI_API_KEY`        | No       | Required only if `LLM_PROVIDER=openai`               |
| `GEMINI_API_KEY`        | No       | Required only if `LLM_PROVIDER=gemini`               |
| `CORS_ORIGINS`          | No       | Comma-separated allowed origins (production)         |
| `CANDIDATE_APP_URL`     | No       | Interview client base URL (for email links)          |

### Client (`client/.env.local`)

| Variable                           | Required | Description                     |
| ---------------------------------- | -------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`              | ✅        | Server URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL`         | ✅        | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | ✅        | Supabase anonymous key          |

---

## Database Schema Overview

The Prisma schema defines **6 models** in a relational hierarchy:

```
User (HR account)
 └─→ Organisation (workspace)
      └─→ HiringDrive (recruitment campaign)
           └─→ DriveCandidate (imported candidate)
                └─→ Interview (session)
                     └─→ Message (transcript turn)
```

| Model            | Key Fields                                  | Purpose                                  |
| ---------------- | ------------------------------------------- | ---------------------------------------- |
| `User`           | email, passwordHash, supabaseUserId         | HR user (manual + OAuth auth)            |
| `Organisation`   | name, orgCode, category                     | Workspace for an HR team                 |
| `HiringDrive`    | role, description, organisationId           | Recruitment campaign for a specific role |
| `DriveCandidate` | email, fullName, token, status              | Candidate within a drive                 |
| `Interview`      | candidateId, status, startTime, endTime     | An interview session attempt             |
| `Message`        | interviewId, role, content, timestamp       | Single conversation turn                 |

---

## API Reference

### REST Endpoints

#### Authentication (`/api/auth/user`)

| Method | Path      | Auth | Description                                |
| ------ | --------- | ---- | ------------------------------------------ |
| POST   | `/signup` | No   | Manual registration (email + password)     |
| POST   | `/login`  | No   | Manual login (returns JWT)                 |
| POST   | `/oauth`  | No   | Supabase OAuth (auto-links existing accounts) |

#### Organisation (`/api/organisation`)

| Method | Path     | Auth | Description                              |
| ------ | -------- | ---- | ---------------------------------------- |
| GET    | `/`      | JWT  | Get current user's org details           |
| POST   | `/setup` | JWT  | Create new org or join via orgCode       |

#### Hiring Drives (`/api/drive`)

| Method | Path                          | Auth | Description                          |
| ------ | ----------------------------- | ---- | ------------------------------------ |
| POST   | `/`                           | JWT  | Create a new hiring drive            |
| POST   | `/:id/candidates/import`      | JWT  | Import candidates (batch upsert)     |
| GET    | `/:id/candidates`             | JWT  | List all candidates for a drive      |
| POST   | `/:id/candidates/send-links`  | JWT  | Mock-send invitation links to candidates |

### WebSocket Protocol

**Endpoint:** `ws://localhost:3000/ws/interview?sessionId=<uuid>&tokenId=<candidate-token>&mode=default|coding`

#### Client → Server Events

| Event Type        | Payload                                    | Description                          |
| ----------------- | ------------------------------------------ | ------------------------------------ |
| `start_interview` | `{}`                                       | Triggers AI self-introduction        |
| `audio_chunk`     | `{ audio, encoding, sampleRate }`          | Streams PCM audio for STT            |
| `audio_end`       | `{}`                                       | Signals end of audio recording       |
| `text_answer`     | `{ text }`                                 | Manual text input (fallback)         |
| `code_submission` | `{ code }`                                 | Code submission (coding mode only)   |
| `cancel_turn`     | `{}`                                       | Interrupts current AI response       |

#### Server → Client Events

| Event Type          | Payload                                      | Description                              |
| ------------------- | -------------------------------------------- | ---------------------------------------- |
| `state_change`      | `{ state, reason, error, turnId, mode }`     | FSM state transition notification        |
| `transcript_partial`| `{ transcript, turnId }`                     | Partial STT transcription (live)         |
| `transcript_final`  | `{ transcript, turnId }`                     | Final STT transcription                  |
| `ai_text_chunk`     | `{ text, turnId }`                           | Streaming LLM text token                 |
| `tts_audio_chunk`   | `{ audio, contentType, turnId }`             | Base64-encoded audio chunk for playback  |

---

## Authentication Flow

```
Manual Flow:
  Signup → POST /api/auth/user/signup → JWT issued
  Login  → POST /api/auth/user/login  → JWT issued

OAuth Flow (Google):
  1. Client calls supabase.auth.signInWithOAuth({ provider: 'google' })
  2. Supabase redirects to Google → user consents → redirects to /auth/callback
  3. Callback page exchanges code for Supabase session
  4. POST /api/auth/user/oauth { supabaseUserId, email, ... }
  5. Server finds/creates user, auto-links if email match exists → JWT issued
```

---

## Interview Pipeline

The real-time interview follows a **streaming pipeline** orchestrated by `InterviewSession`:

```
Candidate speaks          STT (Sarvam)       LLM (Groq/OpenAI)    TTS (Sarvam)
────────────────    →    ────────────    →   ────────────────   →  ────────────
  Audio chunks            Transcript           AI Response          Audio out
  (PCM16 base64)          (streaming)          (token stream)       (MP3 base64)
                                                     │
                                                     ▼
                                              SentenceBuffer
                                              (batches tokens
                                               into complete
                                               sentences for
                                               natural TTS)
```

**State Machine:** `LISTENING` ↔ `PROCESSING` ↔ `SPEAKING`

- **LISTENING**: Accepts audio/text input from the candidate.
- **PROCESSING**: Transcription complete, LLM generating response.
- **SPEAKING**: TTS audio streaming to the candidate.

---

## Key Design Decisions

1. **Monorepo without a workspace manager**: The three apps (`server`, `client`, `interview_client`) are independent npm projects. No Turborepo/Nx. Install and run each separately.

2. **In-memory session management**: `SessionManager` uses a `Map<string, InterviewSession>`. This is simple and fast but means sessions are lost on server restart. For production HA, consider Redis-backed sessions.

3. **Configurable LLM provider**: `llmService.js` routes to Groq, OpenAI, or Gemini based on `LLM_PROVIDER` env var. All use streaming SSE for real-time token delivery.

4. **SentenceBuffer for TTS**: Instead of sending individual LLM tokens to TTS (too small) or waiting for the full response (too slow), the `SentenceBuffer` accumulates tokens and emits complete sentences — giving a natural speech cadence.

5. **Token-based candidate isolation**: Each candidate gets a cryptographic `token` (32 random bytes, hex-encoded). The interview client receives this via URL query param. No candidate auth system — the token IS the credential.

6. **Client-side drive cache**: The HR dashboard caches drive metadata in `localStorage` to avoid an API round-trip on every page visit. This is a speed optimization, not a source of truth.

7. **Dual auth support**: Users can sign up manually (email/password) or via Google OAuth. If a user signs up manually first and later uses Google with the same email, the accounts are auto-linked.

---

## Production Checklist

- [ ] Replace `JWT_SECRET` with a cryptographically strong random string.
- [ ] Set `CORS_ORIGINS` to only allow your production domains.
- [ ] Run `npx prisma migrate deploy` **before** starting the server (never inside it).
- [ ] Consider rate-limiting on `/api/auth/*` to prevent brute-force attacks.
- [ ] Replace the mock email sender in `sendLinksToAll` with a real SMTP/SendGrid integration.
- [ ] Add Redis-backed session management for horizontal scaling.
- [ ] Add a reverse proxy (Nginx/Cloudflare) for SSL termination and WebSocket upgrades.
- [ ] Set `NODE_ENV=production` to suppress verbose Prisma query logs.
- [ ] Rotate API keys (Sarvam, Groq) periodically and never commit `.env` files.
