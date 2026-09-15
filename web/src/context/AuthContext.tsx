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

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    metadata: { full_name: string; alias?: string }
  ) => Promise<{ error: string | null }>;
  verifyEmailOtp: (
    email: string,
    token: string
  ) => Promise<{ error: string | null }>;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  resendOtp: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthError(code: string | undefined, fallback: string): string {
  const messages: Record<string, string> = {
    invalid_credentials: "Invalid email or password.",
    user_already_exists: "This email is already registered. Please sign in.",
    email_not_confirmed:
      "Email has not been verified. Please check your inbox for verification code or link.",
    over_email_send_rate_limit:
      "Too many email requests. Please try again in a few minutes.",
    otp_expired: "Verification code has expired. Please request a new one.",
    token_has_expired: "Verification code has expired. Please request a new one.",
    otp_disabled: "OTP verification is disabled. Please contact the administrator.",
    same_password: "New password cannot be the same as the old password.",
    weak_password:
      "Password is too weak. Please use a combination of letters, numbers, and symbols.",
    user_not_found: "Account not found.",
    session_not_found: "Session expired. Please sign in again.",
    signup_disabled: "New account registration is currently disabled.",
    captcha_failed: "Security verification failed. Please try again.",
    gateway_timeout: "Server timeout while sending email. Please try again in a moment.",
    timeout: "Connection to server timed out. Please try again shortly.",
  };
  if (code?.includes("504") || code?.includes("timeout")) {
    return "Server timeout occurred while sending email. Please try again shortly.";
  }
  return messages[code ?? ""] ?? fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        return { error: mapAuthError(error.code, "Sign-in failed. Please try again.") };
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
            "Registration failed. Please try again later."
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
            "Invalid or expired verification code."
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
            "Failed to send verification link. Please try again."
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
            "Failed to resend code. Please try again."
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
        return {
          error: mapAuthError(
            error.code,
            "Failed to send password reset link. Please try again."
          ),
        };
      }
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
            "Failed to update password. Please try again."
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
      const { data: updateData, error: authError } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (authError) {
        console.warn("[LIMINA Auth] Update user metadata failed:", authError.code);
        return {
          error: mapAuthError(authError.code, "Failed to save profile. Please try again."),
        };
      }

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

      if (updateData?.user) {
        setUser(updateData.user);
      }

      return { error: null };
    },
    [user]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
