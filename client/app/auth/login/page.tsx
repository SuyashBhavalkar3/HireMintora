/**
 * @file login/page.tsx
 * @description Login page supporting two authentication methods:
 *   1. Manual email/password login → POST /api/auth/user/login → JWT.
 *   2. Google OAuth via Supabase → redirects to /auth/callback.
 *
 * After successful login, routes the user:
 *   - If they have an organisation → /dashboard
 *   - If not → /onboarding (to create/join an org)
 *
 * Also handles OAuth error callbacks via URL query params (?error=oauth_failed).
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiLogin, ApiError } from "@/lib/api";
import { supabase } from "@/lib/supabase";

// ─── Google SVG Icon ──────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  // Read error from OAuth callback via query string
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "oauth_failed") setError("Google sign-in failed. Please try again.");
    if (err === "server_error") setError("Authentication error. Please try again.");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiLogin({ email: email.trim(), password });
      login(res.token, res.user);
      router.push(res.user.organisationId ? "/dashboard" : "/onboarding");
    } catch (err) {
      if (err instanceof ApiError) setError(err.messages.join(" "));
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <span className="spinner" />
        Loading…
      </div>
    );
  }

  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-left-deco" />
        <div className="auth-left-deco-2" />
        <div className="auth-left-brand">HireMintora</div>
        <h2 className="auth-left-headline">
          Welcome
          <br />
          Back.
        </h2>
        <p className="auth-left-sub">
          Sign in to manage your hiring drives and reach top candidates faster.
        </p>
        <div className="auth-left-feats">
          {[
            ["🤖", "AI-powered automated interviews"],
            ["📋", "Organized hiring drives by role"],
            ["🔗", "One-click candidate invitations"],
          ].map(([icon, text]) => (
            <div key={text} className="auth-left-feat">
              <div className="auth-left-feat-icon">{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <span className="auth-form-brand">HireMintora</span>
          <h1 className="auth-form-title">Sign in to your account</h1>
          <p className="auth-form-sub">Enter your credentials or use Google</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* Google */}
          <button
            className="btn-google"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
          >
            {googleLoading ? <span className="spinner" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="divider" style={{ margin: "12px 0" }}>
            or
          </div>

          {/* Manual Form */}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field">
              <label className="field-label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="auth-footer-link">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup">Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
