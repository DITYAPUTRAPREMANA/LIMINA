/**
 * Input Validation Utilities — LIMINA
 *
 * All user inputs are validated client-side before sending to Supabase.
 * NOTE: Client-side validation is UX only. Supabase enforces server-side
 * validation + RLS as the authoritative security layer.
 *
 * Security: No user data is logged. Error messages are generic (no internal detail leakage).
 */

// Allow-list for email format — RFC 5322 simplified
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // eslint-disable-line no-useless-escape

// Minimum password requirements (NIST SP 800-63B aligned)
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128; // prevent DoS via huge hashing

// Safe text: allow letters, numbers, spaces, and common name punctuation
const SAFE_NAME_REGEX = /^[\p{L}\p{N}\s'\-.,]{1,100}$/u;

// OTP: exactly 6 numeric digits
const OTP_REGEX = /^\d{6}$/;

/** Validation result — always check `valid` before accessing `error` */
export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, error: "Email tidak boleh kosong." };
  if (trimmed.length > 254) return { valid: false, error: "Email terlalu panjang." };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: "Format email tidak valid." };
  return { valid: true, error: null };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password tidak boleh kosong." };
  if (password.length < MIN_PASSWORD_LENGTH)
    return { valid: false, error: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  if (password.length > MAX_PASSWORD_LENGTH)
    return { valid: false, error: `Password maksimal ${MAX_PASSWORD_LENGTH} karakter.` };
  return { valid: true, error: null };
}

export function validatePasswordMatch(password: string, confirm: string): ValidationResult {
  if (password !== confirm) return { valid: false, error: "Password tidak cocok." };
  return { valid: true, error: null };
}

export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: "Nama tidak boleh kosong." };
  if (!SAFE_NAME_REGEX.test(trimmed))
    return { valid: false, error: "Nama mengandung karakter tidak valid." };
  return { valid: true, error: null };
}

export function validateOtp(otp: string): ValidationResult {
  if (!OTP_REGEX.test(otp)) return { valid: false, error: "Kode OTP harus 6 digit angka." };
  return { valid: true, error: null };
}

/**
 * Sanitize a display string for safe rendering.
 * React JSX auto-escapes, but this extra layer handles edge cases
 * when values are passed to non-JSX contexts.
 */
export function sanitizeDisplay(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Mask email for display: user@example.com → u***@example.com
 * Prevents full PII exposure in UI (security guideline compliance).
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.length > 2 ? local.slice(0, 2) : local[0] ?? "*";
  return `${visible}***@${domain}`;
}
