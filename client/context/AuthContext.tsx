/**
 * @file AuthContext.tsx
 * @description Global authentication state provider for the HireMintora client.
 *
 * Wraps the entire app (via <AuthProvider> in layout.tsx) and provides:
 *   - `user` / `token` — Current logged-in user state.
 *   - `isLoading` — True while rehydrating auth from localStorage on first mount.
 *   - `isAuthenticated` — Derived flag for route guards.
 *   - `login()` — Persists token + user and updates React state.
 *   - `logout()` — Clears storage and redirects to /auth/login.
 *   - `updateUser()` — Used after onboarding (org setup) to refresh user context.
 *
 * Consumers use the `useAuth()` hook to access this context.
 * Throws if used outside <AuthProvider>.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUser,
  setUser as saveUser,
  User,
} from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const t = getToken();
    const u = getUser();
    if (t && u) {
      setTokenState(t);
      setUserState(u);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    saveToken(newToken);
    saveUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUserState(null);
    router.push("/auth/login");
  }, [router]);

  const updateUser = useCallback((updatedUser: User) => {
    saveUser(updatedUser);
    setUserState(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
