import { apiFetch, clearTokens, setTokens } from "./client"

export type AuthUser = {
  public_id: string
  phone_number: string
  email: string | null
  full_name: string
  profile_picture_url: string | null
  language_preference: "sw" | "en"
  theme_preference: "light" | "dark" | "system"
  is_phone_verified: boolean
  created_at: string
}

export function register(input: {
  phone_number: string
  full_name: string
  password: string
  email?: string
  language_preference?: "sw" | "en"
}) {
  return apiFetch<{ detail: string }>("/api/v1/auth/register/", {
    method: "POST",
    body: input,
    auth: false,
  })
}

export function requestOtp(phone_number: string, purpose: "signup" | "login" | "reset_password") {
  return apiFetch<{ detail: string }>("/api/v1/auth/otp/request/", {
    method: "POST",
    body: { phone_number, purpose },
    auth: false,
  })
}

export async function verifyOtp(
  phone_number: string,
  code: string,
  purpose: "signup" | "login" | "reset_password",
) {
  const result = await apiFetch<{ access: string; refresh: string; user: AuthUser }>(
    "/api/v1/auth/otp/verify/",
    { method: "POST", body: { phone_number, code, purpose }, auth: false },
  )
  await setTokens(result.access, result.refresh)
  return result.user
}

export async function login(phone_number: string, password: string) {
  const result = await apiFetch<{ access: string; refresh: string }>("/api/v1/auth/login/", {
    method: "POST",
    body: { phone_number, password },
    auth: false,
  })
  await setTokens(result.access, result.refresh)
  return result
}

export function getMe() {
  return apiFetch<AuthUser>("/api/v1/auth/me/")
}

export function updateMe(input: Partial<AuthUser>) {
  return apiFetch<AuthUser>("/api/v1/auth/me/", { method: "PATCH", body: input })
}

export async function logout() {
  await clearTokens()
}
