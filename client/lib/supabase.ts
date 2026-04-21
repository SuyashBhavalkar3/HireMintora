/**
 * @file supabase.ts
 * @description Singleton Supabase client instance for the HireMintora web client.
 * Used exclusively for triggering OAuth flows (e.g. Google sign-in).
 * After OAuth, the backend's /api/auth/user/oauth endpoint issues the app JWT.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
