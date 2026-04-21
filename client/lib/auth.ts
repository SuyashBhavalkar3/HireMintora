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

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ─── User Helpers ─────────────────────────────────────────────────────────────

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
