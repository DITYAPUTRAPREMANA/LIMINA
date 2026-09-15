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
  if (!trimmed) return { valid: false, error: "Email cannot be empty." };
  if (trimmed.length > 254) return { valid: false, error: "Email is too long." };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: "Invalid email format." };
  return { valid: true, error: null };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password cannot be empty." };
  if (password.length < MIN_PASSWORD_LENGTH)
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  if (password.length > MAX_PASSWORD_LENGTH)
    return { valid: false, error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` };
  return { valid: true, error: null };
}

export function validatePasswordMatch(password: string, confirm: string): ValidationResult {
  if (password !== confirm) return { valid: false, error: "Passwords do not match." };
  return { valid: true, error: null };
}

export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: "Name cannot be empty." };
  if (!SAFE_NAME_REGEX.test(trimmed))
    return { valid: false, error: "Name contains invalid characters." };
  return { valid: true, error: null };
}

export function validateOtp(otp: string): ValidationResult {
  const trimmed = otp.trim();
  if (!trimmed) return { valid: false, error: "Verification code cannot be empty." };
  if (!OTP_REGEX.test(trimmed)) return { valid: false, error: "Verification code must be 6 digits." };
  return { valid: true, error: null };
}

export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}
