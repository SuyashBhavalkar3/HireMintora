/**
 * @file auth.ts
 * @description Lightweight helpers for persisting and reading authentication
 * data (JWT token + serialized User) from localStorage.
 * These are used by both the AuthContext and the API client.
 */

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  organisationId?: string | null;
  organisationRole?: string | null;
  supabaseUserId?: string | null;
  oauthProvider?: string | null;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "hm_token";
const USER_KEY = "hm_user";

// ─── Token Helpers ────────────────────────────────────────────────────────────

/** Retrieves the stored JWT token, or null if not present. Returns null during SSR. */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/** Persists the JWT token to localStorage. */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** Clears both the JWT token and cached user from localStorage (used on logout). */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ─── User Helpers ─────────────────────────────────────────────────────────────

/** Retrieves and parses the cached User object, or null if absent / invalid JSON. Returns null during SSR. */
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Serializes and stores the User object to localStorage. */
export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
