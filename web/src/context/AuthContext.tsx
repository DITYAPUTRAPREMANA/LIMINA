/**
 * AuthContext — LIMINA
 *
 * Global authentication state using Supabase Auth.
 *
 * Security measures implemented:
 * - Session managed by Supabase (PKCE flow, automatic token refresh)
 * - No tokens stored in localStorage manually
 * - Logout triggers full page reload to clear all in-memory state
 * - Generic error messages surfaced to users (no internal detail leakage)
 * - Auth state changes listened via onAuthStateChange (secure reactive pattern)
 * - TODO(security): Implement MFA (TOTP/FIDO2) via supabase.auth.mfa.*
 * - TODO(security): Add leaked-password check via HaveIBeenPwned API before signup
 * - TODO(security): Add OAuth providers (Google, GitHub) as alternative auth
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextValue {
  /** Current authenticated user, or null if not logged in */
  user: User | null;
  /** Current session (contains JWT access token managed by Supabase) */
  session: Session | null;
  /** True while the initial session check is in progress */
  loading: boolean;

  /** Sign in with email + password */
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  /** Register a new account — triggers OTP email */
  signUp: (
    email: string,
    password: string,
    metadata: { full_name: string; alias?: string }
  ) => Promise<{ error: string | null }>;

  /** Verify email OTP code after signup or sign-in-with-OTP */
  verifyEmailOtp: (
    email: string,
    token: string
  ) => Promise<{ error: string | null }>;

  /** Send Magic Link to email for passwordless sign-in / registration */
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;

  /** Resend OTP or confirmation email */
  resendOtp: (email: string) => Promise<{ error: string | null }>;

  /** Request a password reset email */
  resetPassword: (email: string) => Promise<{ error: string | null }>;

  /** Update password (only valid after clicking reset link) */
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;

  /** Update profile metadata */
  updateProfile: (
    metadata: Partial<{
      full_name: string;
      alias: string;
      phone: string;
      company: string;
      role: string;
      location: string;
    }>
  ) => Promise<{ error: string | null }>;

  /** Sign out and clear all session state */
  signOut: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Generic error mapper (never expose internal Supabase messages to UI) ─────

function mapAuthError(code: string | undefined, fallback: string): string {
  // Map known Supabase error codes to safe user-facing messages
  const messages: Record<string, string> = {
    invalid_credentials: "Email atau password salah.",
    user_already_exists: "Email ini sudah terdaftar. Silakan login.",
    email_not_confirmed:
      "Email belum diverifikasi. Periksa inbox Anda untuk kode OTP.",
    over_email_send_rate_limit:
      "Terlalu banyak permintaan email. Coba lagi dalam beberapa menit.",
    otp_expired: "Kode OTP sudah kedaluwarsa. Minta kode baru.",
    token_has_expired: "Kode OTP sudah kedaluwarsa. Minta kode baru.",
    otp_disabled: "Verifikasi OTP tidak aktif. Hubungi administrator.",
    same_password: "Password baru tidak boleh sama dengan password lama.",
    weak_password:
      "Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.",
    user_not_found: "Akun tidak ditemukan.",
    session_not_found: "Sesi tidak ditemukan. Silakan login ulang.",
    signup_disabled: "Pendaftaran akun baru sedang dinonaktifkan.",
    captcha_failed: "Verifikasi bot (captcha) gagal atau perlu dinonaktifkan di dashboard Supabase.",
    gateway_timeout: "Server Supabase timeout (504) saat mengirim email. Coba beberapa saat lagi atau cek SMTP Supabase.",
    timeout: "Koneksi ke server timeout. Coba beberapa saat lagi.",
  };
  if (code?.includes("504") || code?.includes("timeout")) {
    return "Server Supabase timeout saat memproses pengiriman email. Silakan coba lagi.";
  }
  return messages[code ?? ""] ?? fallback;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Supabase auth state changes
  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth events (login, logout, token refresh, password recovery)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth Actions ───────────────────────────────────────────────────────────

  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        // Log safely — no credentials in log output
        console.warn("[LIMINA Auth] Sign-in failed:", error.code);
        return { error: mapAuthError(error.code, "Login gagal. Coba lagi.") };
      }
      return { error: null };
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata: { full_name: string; alias?: string }
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: metadata.full_name.trim(),
            alias: metadata.alias?.trim() ?? "",
          },
          // Redirect after email confirmation (password reset, magic link)
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        console.warn("[LIMINA Auth] Sign-up failed:", error.code);
        return {
          error: mapAuthError(
            error.code,
            "Pendaftaran gagal. Coba lagi nanti."
          ),
        };
      }
      return { error: null };
    },
    []
  );

  const verifyEmailOtp = useCallback(
    async (
      email: string,
      token: string
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: "email",
      });
      if (error) {
        console.warn("[LIMINA Auth] OTP verify failed:", error.code);
        return {
          error: mapAuthError(
            error.code,
            "Kode OTP salah atau sudah kedaluwarsa."
          ),
        };
      }
      return { error: null };
    },
    []
  );

  const sendMagicLink = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
        },
      });
      if (error) {
        console.warn("[LIMINA Auth] Send magic link failed:", error.code);
        return {
          error: mapAuthError(
            error.code,
            "Gagal mengirim link verifikasi. Coba lagi nanti."
          ),
        };
      }
      return { error: null };
    },
    []
  );

  const resendOtp = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.resend({
        email: email.trim().toLowerCase(),
        type: "signup",
      });
      if (error) {
        console.warn("[LIMINA Auth] Resend OTP failed:", error.code);
        return {
          error: mapAuthError(
            error.code,
            "Gagal mengirim ulang kode. Coba lagi."
          ),
        };
      }
      return { error: null };
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/?reset=true`,
        }
      );
      if (error) {
        console.warn("[LIMINA Auth] Reset password failed:", error.code);
        // Deliberately vague: don't reveal if the email exists (prevents enumeration)
        return {
          error: mapAuthError(
            error.code,
            "Gagal mengirim link reset. Coba lagi."
          ),
        };
      }
      // Always return success message even if email not found (prevent email enumeration)
      return { error: null };
    },
    []
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.warn("[LIMINA Auth] Update password failed:", error.code);
        return {
          error: mapAuthError(
            error.code,
            "Gagal mengubah password. Coba lagi."
          ),
        };
      }
      return { error: null };
    },
    []
  );

  const updateProfile = useCallback(
    async (
      metadata: Partial<{
        full_name: string;
        alias: string;
        phone: string;
        company: string;
        role: string;
        location: string;
      }>
    ): Promise<{ error: string | null }> => {
      // 1. Update Supabase Auth metadata
      const { data: updateData, error: authError } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (authError) {
        console.warn("[LIMINA Auth] Update user metadata failed:", authError.code);
        return {
          error: mapAuthError(authError.code, "Gagal menyimpan profil. Coba lagi."),
        };
      }

      // 2. Sync to Supabase Database `profiles` table
      const targetUserId = updateData?.user?.id || user?.id;
      if (targetUserId) {
        try {
          const { error: dbError } = await supabase.from("profiles").upsert(
            {
              id: targetUserId,
              full_name: metadata.full_name ?? "",
              alias: metadata.alias ?? "",
              phone: metadata.phone ?? "",
              company: metadata.company ?? "",
              role: metadata.role ?? "Retail Analyst",
              location: metadata.location ?? "",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (dbError) {
            console.warn("[LIMINA Auth] Sync to profiles table error:", dbError.message);
          }
        } catch (e) {
          console.warn("[LIMINA Auth] DB update exception:", e);
        }
      }

      // 3. Update local user state immediately
      if (updateData?.user) {
        setUser(updateData.user);
      }

      return { error: null };
    },
    [user]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Clear all in-memory auth state immediately
    setUser(null);
    setSession(null);
    // Full page reload to flush any cached state (security: session lifecycle)
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        sendMagicLink,
        verifyEmailOtp,
        resendOtp,
        resetPassword,
        updatePassword,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
