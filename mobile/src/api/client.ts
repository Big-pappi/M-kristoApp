import * as SecureStore from "expo-secure-store"

/**
 * Base URL for the Django backend.
 *
 * Set EXPO_PUBLIC_API_URL in mobile/.env (see .env.example) to point at:
 *  - Android emulator:      http://10.0.2.2:8000
 *  - iOS simulator:         http://127.0.0.1:8000
 *  - Physical device:       http://<your-machine-lan-ip>:8000
 *  - Production:            https://api.mkristo.app (or your domain)
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

const ACCESS_TOKEN_KEY = "mkristo_access_token"
const REFRESH_TOKEN_KEY = "mkristo_refresh_token"

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export async function setTokens(access: string, refresh?: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access)
  if (refresh) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh)
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API request failed with status ${status}`)
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  auth?: boolean
}

/**
 * Thin fetch wrapper for the Django REST API. Automatically attaches the
 * JWT access token (from accounts.LoginView / apps.accounts) unless
 * `auth: false` is passed, and tries one silent refresh on a 401 before
 * giving up.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (auth) {
    const token = await getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return apiFetch<T>(path, options)
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json")
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(res.status, data)
  }

  return data as T
}

async function tryRefreshToken() {
  const refresh = await getRefreshToken()
  if (!refresh) return false

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    await setTokens(data.access)
    return true
  } catch {
    return false
  }
}
