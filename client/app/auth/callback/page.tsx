"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiOAuth, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/**
 * OAuth Callback Page
 *
 * Supabase redirects here after Google OAuth with a `code` query param (PKCE flow).
 * We exchange the code for a session, then POST the supabaseUserId to our server
 * to receive an app-level JWT.
 */
export default function AuthCallbackPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Exchange the OAuth code for a Supabase session (PKCE flow)
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        // If no session yet, try exchanging the code manually
        if (!data.session && typeof window !== "undefined") {
          const code = new URLSearchParams(window.location.search).get("code");
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }

        // Re-fetch session after potential code exchange
        const { data: sessionData, error: fetchErr } =
          await supabase.auth.getSession();

        if (fetchErr || !sessionData.session) {
          router.push("/auth/login?error=oauth_failed");
          return;
        }

        const { session } = sessionData;

        // POST to our server to get the app JWT
        const res = await apiOAuth({
          supabaseUserId: session.user.id,
          email: session.user.email,
          fullName:
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            session.user.email?.split("@")[0],
          oauthProvider:
            session.user.app_metadata?.provider ?? "google",
        });

        login(res.token, res.user);

        // Route based on whether the user has an organisation
        router.push(res.user.organisationId ? "/dashboard" : "/onboarding");
      } catch (err) {
        console.error("OAuth callback error:", err);
        if (err instanceof ApiError) {
          router.push("/auth/login?error=server_error");
        } else {
          router.push("/auth/login?error=oauth_failed");
        }
      }
    }

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-loading">
      <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <p>Completing sign-in…</p>
    </div>
  );
}
