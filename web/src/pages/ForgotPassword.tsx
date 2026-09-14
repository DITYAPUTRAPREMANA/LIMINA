import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, Loader2, Mail, RotateCcw, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../lib/validation";
import type { View } from "../App";

type ForgotPasswordPageProps = {
  onNavigate: (view: View) => void;
};

const ForgotPasswordPage = ({ onNavigate }: ForgotPasswordPageProps) => {
  const { resetPassword, updatePassword, session } = useAuth();

  const isResetMode =
    window.location.search.includes("reset=true") ||
    window.location.hash.includes("type=recovery") ||
    (session?.user?.aud === "authenticated" &&
      window.location.hash.includes("access_token"));

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const strength = (() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (newPassword.length >= 12) score += 15;
    if (/[A-Z]/.test(newPassword)) score += 15;
    if (/[0-9]/.test(newPassword)) score += 15;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 20;
    if (/[a-z]/.test(newPassword)) score += 10;
    return Math.min(100, score);
  })();

  const strengthLabel = strength < 30 ? "Lemah" : strength < 70 ? "Sedang" : "Kuat";
  const strengthColor = strength < 30
    ? "bg-red-500"
    : strength < 70
      ? "bg-amber-500"
      : "bg-emerald-500";

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setSendError(null);

    const result = validateEmail(email);
    if (!result.valid) {
      setEmailError(result.error);
      return;
    }

    setSendLoading(true);
    await resetPassword(email);
    setSendLoading(false);
    setSendSuccess(true);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    const errors: Record<string, string> = {};

    const passwordResult = validatePassword(newPassword);
    if (!passwordResult.valid && passwordResult.error) errors.password = passwordResult.error;

    const matchResult = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchResult.valid && matchResult.error) errors.confirm = matchResult.error;

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors({});

    setUpdateLoading(true);
    const { error } = await updatePassword(newPassword);
    setUpdateLoading(false);

    if (error) {
      setUpdateError(error);
      return;
    }

    setUpdateSuccess(true);
    setTimeout(() => onNavigate("login"), 2000);
  };

  useEffect(() => {
    if (isResetMode && window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname + "?reset=true");
    }
  }, [isResetMode]);

  return (
    <div className="min-h-screen w-full bg-[#f2f1ee] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <header className="flex items-center justify-between border-b border-[#dfe4ea] dark:border-slate-700 bg-[#f2f1ee] dark:bg-[#13141a] px-5 py-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-9 w-auto" alt="Limina logo" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f26a4d]">
            Recovery Gate
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1f2d3d] dark:text-slate-300 transition hover:text-[#f26a4d]"
        >
          <span className="text-base">←</span> Kembali ke Login
        </button>
      </header>

      <main className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-stretch lg:justify-center lg:gap-8 lg:py-16">
        {/* ── Step 1: Request Reset ── */}
        <section className="w-full max-w-[520px] rounded-2xl border border-[#dfe4ea] dark:border-slate-700 bg-[#f8f7f5] dark:bg-slate-800 p-5 shadow-sm sm:p-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f4b28f] bg-[#fff3ea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d26c3d]">
            Langkah 1: Kirim Link Reset
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff2eb] text-[#f26a4d] shadow-inner ring-1 ring-[#f8d5c3]">
            <Mail className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-[#101827] dark:text-slate-50">
            Lupa Password
          </h1>

          <p className="mt-4 max-w-[420px] text-[1.05rem] leading-relaxed text-[#546176] dark:text-slate-400">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan link
            reset terenkripsi yang berlaku selama 15 menit.
          </p>

          {sendSuccess ? (
            <div className="mt-8 rounded-xl border border-[#cfe7dd] bg-[#ebfff7] p-4 text-sm text-[#1f7d5d]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1db77b] text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  Jika email tersebut terdaftar, kami telah mengirimkan link reset
                  password. Periksa inbox Anda (termasuk folder spam).
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendReset} className="mt-8" noValidate>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                Account Email
              </label>
              <div className={`flex items-center rounded-xl border bg-white dark:bg-slate-900 px-3 py-3 shadow-sm ${emailError ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                <span className="mr-2 text-gray-500 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
              {sendError && <p className="mt-2 text-sm text-red-500">{sendError}</p>}

              <button
                type="submit"
                disabled={sendLoading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0c1526] dark:bg-slate-700 px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(12,21,38,0.18)] transition hover:bg-[#17253d] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim…</>
                ) : (
                  <>Kirim Link Reset <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 text-sm text-[#4f5f75] dark:text-slate-400">
            <span>Ingat password Anda?</span>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="font-semibold text-[#f26a4d] transition hover:text-[#d95e39]"
            >
              Login sekarang
            </button>
          </div>
        </section>

        {/* ── Step 2: Set new password (only available via reset link) ── */}
        <section className="w-full max-w-[520px] rounded-2xl border border-[#dfe4ea] dark:border-slate-700 bg-[#f8f7f5] dark:bg-slate-800 p-5 shadow-sm sm:p-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d3e1ee] bg-[#edf4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d6f9a]">
            Langkah 2: Set Password Baru
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#eef5ff] text-[#4d6f9a] shadow-inner ring-1 ring-[#d7e2f4]">
            <RotateCcw className="h-7 w-7" />
          </div>

          <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-[#101827] dark:text-slate-50">
            Reset Password
          </h2>

          {!isResetMode ? (
            <div className="mt-6 rounded-xl border border-[#d6e4f0] bg-[#eef6ff] dark:bg-slate-900 p-4 text-sm text-[#4d6f9a] dark:text-slate-400">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>
                  Langkah 2 hanya tersedia setelah Anda mengklik link reset
                  password di email Anda. Setelah mengklik link tersebut, halaman
                  ini akan otomatis terbuka untuk mengatur password baru.
                </span>
              </div>
            </div>
          ) : updateSuccess ? (
            <div className="mt-6 rounded-xl border border-[#cfe7dd] bg-[#ebfff7] p-4 text-sm text-[#1f7d5d]">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5" />
                <span>Password berhasil diubah! Mengarahkan ke halaman login…</span>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-4 max-w-[420px] text-[1.05rem] leading-relaxed text-[#546176] dark:text-slate-400">
                Buat password baru yang kuat untuk akun Limina Anda.
              </p>

              {updateError && (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="mt-8 space-y-5" noValidate>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Password Baru
                  </label>
                  <div className={`flex items-center rounded-xl border bg-white dark:bg-slate-900 px-3 py-3 shadow-sm ${passwordErrors.password ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                    <input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors((p) => { const n = { ...p }; delete n.password; return n; }); }}
                      placeholder="Buat password baru"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowNew((v) => !v)} className="ml-2 text-gray-400 hover:text-slate-600">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.password && <p className="mt-1 text-xs text-red-500">{passwordErrors.password}</p>}

                  {/* Strength bar */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-[#6d788a] mb-1">
                        <span>Kekuatan</span>
                        <span>{strengthLabel}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#dfe5e6]">
                        <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${strength}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Konfirmasi Password Baru
                  </label>
                  <div className={`flex items-center rounded-xl border bg-white dark:bg-slate-900 px-3 py-3 shadow-sm ${passwordErrors.confirm ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                    <input
                      id="confirm-new-password"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => { const n = { ...p }; delete n.confirm; return n; }); }}
                      placeholder="Ulangi password baru"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="ml-2 text-gray-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirm && <p className="mt-1 text-xs text-red-500">{passwordErrors.confirm}</p>}
                </div>

                {/* Requirements checklist */}
                <div className="rounded-xl border border-[#d6e8d9] dark:border-slate-600 bg-[#ebfff7] dark:bg-slate-900 p-3 text-sm text-[#1d7e5d] dark:text-emerald-400">
                  {[
                    { label: "Minimal 8 karakter", met: newPassword.length >= 8 },
                    { label: "Mengandung angka atau simbol", met: /[0-9!@#$%^&*]/.test(newPassword) },
                    { label: "Password cocok", met: newPassword === confirmPassword && confirmPassword.length > 0 },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-2 mt-1 first:mt-0">
                      <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${req.met ? "bg-[#22a56d] text-white" : "bg-[#d6e8d9] dark:bg-slate-700 text-[#7db594]"}`}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={req.met ? "text-[#1d7e5d] dark:text-emerald-400" : "text-[#6d788a]"}>{req.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(180deg,#f48e62_0%,#f26a4d_100%)] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(242,106,77,0.25)] transition hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updateLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</>
                  ) : (
                    <>Simpan Password <Check className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
