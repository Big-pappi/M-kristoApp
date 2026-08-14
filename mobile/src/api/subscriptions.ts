import { apiFetch } from "./client"

export type Plan = {
  id: string
  code: string
  name_sw: string
  name_en: string | null
  description_sw: string
  description_en: string | null
  price_amount: string
  price_currency: string
  duration_days: number
}

export type Subscription = {
  id: string
  plan: Plan
  status: "active" | "expired" | "cancelled" | "pending"
  starts_at: string | null
  ends_at: string | null
  created_at: string
}

export function listPlans() {
  return apiFetch<Plan[]>("/api/v1/subscriptions/plans/", { auth: false })
}

export function listMySubscriptions() {
  return apiFetch<Subscription[]>("/api/v1/subscriptions/mine/")
}
