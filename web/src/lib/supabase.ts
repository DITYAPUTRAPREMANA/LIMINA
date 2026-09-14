import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? "";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder-key";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== FALLBACK_URL &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== FALLBACK_KEY;

export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
    global: {
      headers: {
        "x-application-name": "limina-web",
      },
    },
  }
);
