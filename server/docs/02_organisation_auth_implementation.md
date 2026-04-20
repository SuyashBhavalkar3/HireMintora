# Document 02 — Organisation Model & Auth (Implementation 01)
> **Implementation Number**: 01
> **Date**: 2026-04-20
> **Built on top of**: `docs/01_preexisting_codebase.md` baseline

---

## 1. What Was Implemented

The first feature built on this backend: **Organisation (HR employer) authentication**.

An Organisation is any company or recruiter that will use HireMintora to create job postings and
conduct AI interviews. This implementation covers the full auth lifecycle:

| Flow          | Method   | Description                                              |
|---------------|----------|----------------------------------------------------------|
| Manual Signup | POST     | Email + password registration with `confirmPassword`    |
| Manual Login  | POST     | Email + password login                                   |
| OAuth Signup  | POST     | Register/link account via Supabase OAuth                 |
| OAuth Login   | POST     | Authenticate an existing OAuth-linked account            |

---

## 2. Files Added / Modified

### New Files

| # | File | Purpose |
|---|------|---------|
| 1 | `prisma/schema.prisma` | Added `Organisation` model (was empty before) |
| 2 | `prisma/migrations/20260420084526_add_organisation_model/migration.sql` | Auto-generated migration — creates `organisations` table in Supabase |
| 3 | `src/lib/prismaClient.js` | Singleton Prisma client (one connection pool per process) |
| 4 | `src/api/auth/orgAuth.validators.js` | Input validation functions for all 4 auth routes |
| 5 | `src/api/auth/orgAuth.controller.js` | Business logic for signup / login (manual + OAuth) |
| 6 | `src/api/auth/orgAuth.routes.js` | Express router with full Swagger JSDoc annotations |
| 7 | `src/api/index.js` | Barrel export for all API routers |

### Modified Files

| # | File | Change |
|---|------|--------|
| 1 | `prisma/schema.prisma` | Reverted to Prisma 6 for stability. Added `Organisation` model. |
| 2 | `src/lib/prismaClient.js` | Updated path to `../generated/prisma-client`. |
| 3 | `src/api/auth/orgAuth.validators.js` | Validation for manual and oauth flows. |
| 4 | `src/api/auth/orgAuth.controller.js` | Single `oauthAuth` endpoint replacing separate signup/login for OAuth. |
| 5 | `src/api/auth/orgAuth.routes.js` | Express routes for `/signup`, `/login`, and `/oauth`. |

---

## 3. Database Schema — `Organisation` Model

```prisma
model Organisation {
  id             String   @id @default(uuid())
  fullName       String
  email          String   @unique         // Primary unique identifier

  // Manual auth
  passwordHash   String?                  // Nullable — OAuth-only orgs skip this

  // Supabase OAuth
  supabaseUserId String?  @unique         // Supabase auth.users.id
  oauthProvider  String?                  // "google", "github", etc.

  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("organisations")                  // Postgres table name
}
```

**Key design decisions:**
- `email` is ALWAYS the canonical unique identifier — an org has one account regardless of auth method
- `passwordHash` is nullable so OAuth-only orgs are valid without a password
- `supabaseUserId` is nullable so manual-only orgs are valid without OAuth
- An org CAN have both — e.g., signed up manually, later linked OAuth
- `isActive` flag allows soft-disabling accounts without deletion

---

## 4. API Endpoints Added

Base path: `/api/auth/org`

### 4.1 `POST /api/auth/org/signup` — Manual Signup

**Request body:**
```json
{
  "fullName": "Acme Corp",
  "email": "hr@acmecorp.com",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123"
}
```

**Rules:**
- `fullName` — required, non-empty string
- `email` — valid email format
- `password` — minimum 8 characters
- `confirmPassword` — must exactly match `password`

**Success `201`:**
```json
{
  "success": true,
  "token": "<JWT>",
  "organisation": { "id": "...", "fullName": "...", "email": "...", ... }
}
```

**Errors:**
- `400` — validation failed (returns `errors` array)
- `409` — email already registered

---

### 4.2 `POST /api/auth/org/login` — Manual Login

**Request body:**
```json
{
  "email": "hr@acmecorp.com",
  "password": "SecurePass@123"
}
```

**Rules:**
- `email` + `password` required
- Generic `"Invalid email or password."` on any auth failure (prevents user enumeration)

**Success `200`:**
```json
{
  "success": true,
  "token": "<JWT>",
  "organisation": { ... }
}
```

**Errors:** `400` validation | `401` bad credentials | `403` account inactive

---

### 4.3 `POST /api/auth/org/oauth` — OAuth Auth (Signup & Login)

A unified endpoint that handles both registration and session issuance for OAuth users.

**Request body:**
```json
{
  "supabaseUserId": "uuid-from-supabase",
  "email": "hr@acmecorp.com",
  "fullName": "Acme Corp",
  "oauthProvider": "google"
}
```

**Behaviour:**
1. **Lookup by ID**: If `supabaseUserId` found, logs in.
2. **Lookup by Email**: If not found by ID but email exists, links the account.
3. **Creation**: If not found by either, creates a new entry (requires `email` and `fullName`).

**Success `200`:** Same shape as manual login.

**Errors:** `400` validation | `500` server error.

---

## 5. Authentication Token

| Property   | Value                              |
|------------|------------------------------------|
| Algorithm  | HS256 (HMAC-SHA256)                |
| Signing key | `JWT_SECRET` env var              |
| Expiry     | `JWT_EXPIRES_IN` env var (default `7d`) |
| Payload    | `{ sub: orgId, email, type: "organisation" }` |

> ⚠️ **Production action required**: Replace `JWT_SECRET` in `.env` with a 64-byte random hex string:
> ```
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 6. Security Decisions

| Concern                     | How It's Handled                                       |
|-----------------------------|--------------------------------------------------------|
| Password storage            | `bcryptjs` with **12 rounds** — resistant to brute force |
| User enumeration on login   | Always returns generic `"Invalid email or password."` |
| Password in API response    | `passwordHash` stripped from every response via `safeOrg()` |
| OAuth identity collision    | Unique constraint on `supabaseUserId` — returns `409` if re-linked to different email |
| Inactive accounts           | Checked on login before issuing token, returns `403`  |

---

## 7. New Environment Variables

| Variable        | Required | Description                                  |
|-----------------|----------|----------------------------------------------|
| `JWT_SECRET`    | ✅ Yes   | Secret for signing JWTs — **must be changed before production** |
| `JWT_EXPIRES_IN`| No       | Token expiry (default: `7d`)                 |

---

## 8. New NPM Dependencies (added this implementation)

| Package       | Version  | Purpose                              |
|---------------|----------|--------------------------------------|
| `bcryptjs`    | latest   | Password hashing (12 rounds)         |
| `jsonwebtoken`| latest   | JWT signing and verification         |

---

## 9. What's NOT Yet Implemented (Next Steps)

These are intentionally deferred for upcoming implementation documents:

- [ ] **JWT middleware** — `authenticateOrg` middleware to protect future routes
- [ ] **Refresh tokens** — long-lived refresh + short-lived access token flow
- [ ] **Email verification** — confirm email after manual signup
- [ ] **Password reset** — forgot password / reset link flow
- [ ] **Candidate model** — separate auth model for interview candidates
- [ ] **Job Posting model** — org creates postings linked to their account

---

*Document generated: 2026-04-20 | Implementation 01 for: HireMintora Node.js backend*
