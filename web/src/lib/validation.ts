const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const SAFE_NAME_REGEX = /^[\p{L}\p{N}\s'\-.,]{1,100}$/u;
const OTP_REGEX = /^\d{6}$/;

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
  const trimmed = otp.trim();
  if (!trimmed) return { valid: false, error: "Kode OTP tidak boleh kosong." };
  if (!OTP_REGEX.test(trimmed)) return { valid: false, error: "Kode OTP harus 6 digit angka." };
  return { valid: true, error: null };
}

export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}
