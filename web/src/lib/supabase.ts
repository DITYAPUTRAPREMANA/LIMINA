/**
 * Supabase Client — LIMINA
 *
 * Security Notes:
 * - Uses VITE_ prefixed env vars (only these are exposed to client bundle)
 * - Anon key is public by design; security is enforced via RLS on Supabase
 * - Auth tokens managed by @supabase/supabase-js via secure httpOnly-like pattern
 * - PKCE flow enabled: prevents authorization code interception attacks
 *
 * TODO(security): For production, configure a BFF (Backend-for-Frontend) proxy
 * so the anon key is never visible in network requests.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? "";

const PLACEHOLDER_URL = "https://YOUR_PROJECT_ID.supabase.co";
const PLACEHOLDER_KEY = "YOUR_ANON_PUBLIC_KEY_HERE";

/** True when both env vars are set and not placeholder values */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseUrl !== PLACEHOLDER_URL &&
  supabaseAnonKey.length > 0 &&
  supabaseAnonKey !== PLACEHOLDER_KEY;

if (!isSupabaseConfigured) {
  // Warn in console but DO NOT throw — allows app to render with setup banner
  console.warn(
    "[LIMINA] Supabase belum dikonfigurasi.\n" +
      "Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env\n" +
      "Auth tidak akan berfungsi sampai konfigurasi selesai."
  );
}

// Create client regardless (with whatever values exist).
// API calls will fail gracefully when misconfigured; errors are caught in AuthContext.
export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY,
  {
    auth: {
      // Use PKCE flow for enhanced security (prevents authorization code interception)
      flowType: "pkce",
      // Auto-refresh tokens before expiry
      autoRefreshToken: true,
      // Detect session from URL (for password reset links)
      detectSessionInUrl: true,
      // Persist session across browser tabs
      persistSession: true,
    },
    global: {
      headers: {
        "x-application-name": "limina-web",
      },
    },
  }
);

