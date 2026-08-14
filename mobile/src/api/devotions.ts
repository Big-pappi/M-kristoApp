import { apiFetch } from "./client"

export type Devotion = {
  id: string
  type: "neno_la_leo" | "tafakari" | "somo"
  devotion_date: string
  title_sw: string
  title_en: string | null
  body_sw: string
  body_en: string | null
  scripture_reference: string | null
  is_premium: boolean
}

export function listDevotions(type?: Devotion["type"]) {
  const qs = type ? `?type=${type}` : ""
  return apiFetch<Devotion[]>(`/api/v1/devotions/${qs}`, { auth: false })
}

export async function getTodaysDevotion(type: Devotion["type"]) {
  const results = await apiFetch<Devotion[]>(`/api/v1/devotions/?type=${type}&today=1`, {
    auth: false,
  })
  return results[0] ?? null
}
