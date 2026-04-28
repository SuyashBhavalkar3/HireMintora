/**
 * @file api.ts
 * @description Typed HTTP client for the HireMintora backend REST API.
 *
 * All API functions use the shared `req<T>()` helper, which:
 *   1. Reads the JWT from localStorage and attaches it as a Bearer token.
 *   2. Sends JSON requests to the backend base URL (NEXT_PUBLIC_API_URL).
 *   3. Parses the response and throws an ApiError with structured messages on failure.
 *
 * Usage:
 *   import { apiLogin, ApiError } from '@/lib/api';
 *   try {
 *     const { token, user } = await apiLogin({ email, password });
 *   } catch (err) {
 *     if (err instanceof ApiError) console.log(err.messages);
 *   }
 *
 * NOTE: These functions are called from React components (client-side only).
 */

import { getToken } from "./auth";

// ─── Config ───────────────────────────────────────────────────────────────────
// Base URL for all API calls. Set via environment variable in .env.local.
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Error Class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public messages: string[];
  public status: number;

  constructor(status: number, messages: string[]) {
    super(messages.join(", "));
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const data = await res.json();

  if (!res.ok) {
    const msgs: string[] = data.errors
      ? Array.isArray(data.errors)
        ? data.errors
        : [data.errors]
      : [data.error || "Something went wrong."];
    throw new ApiError(res.status, msgs);
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const apiSignup = (body: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => req<{ token: string; user: any }>("/api/auth/user/signup", { method: "POST", body: JSON.stringify(body) });

export const apiLogin = (body: { email: string; password: string }) =>
  req<{ token: string; user: any }>("/api/auth/user/login", { method: "POST", body: JSON.stringify(body) });

export const apiOAuth = (body: {
  supabaseUserId: string;
  email?: string;
  fullName?: string;
  oauthProvider?: string;
}) => req<{ token: string; user: any }>("/api/auth/user/oauth", { method: "POST", body: JSON.stringify(body) });

// ─── Organisation ─────────────────────────────────────────────────────────────

export const apiOrgSetup = (body: {
  action: "CREATE" | "JOIN";
  name?: string;
  description?: string;
  category?: string;
  orgCode?: string;
}) =>
  req<{ success: boolean; organisation: any; role: string; message: string }>(
    "/api/organisation/setup",
    { method: "POST", body: JSON.stringify(body) }
  );

export const apiGetOrg = () =>
  req<{ success: boolean; organisation: any }>("/api/organisation");

// ─── Drive ────────────────────────────────────────────────────────────────────

export const apiCreateDrive = (body: { role: string; description?: string }) =>
  req<{ drive: any; message: string }>("/api/drive", { method: "POST", body: JSON.stringify(body) });

export const apiImportCandidates = (
  driveId: string,
  candidates: { email: string; fullName: string }[]
) =>
  req<{ candidates: any[]; count: number; message: string; errors?: any[] }>(
    `/api/drive/${driveId}/candidates/import`,
    { method: "POST", body: JSON.stringify({ candidates }) }
  );

export const apiGetCandidates = (driveId: string) =>
  req<{ candidates: any[]; driveId: string }>(`/api/drive/${driveId}/candidates`);

export const apiSendLinks = (driveId: string) =>
  req<{ count: number; message: string }>(
    `/api/drive/${driveId}/candidates/send-links`,
    { method: "POST" }
  );
