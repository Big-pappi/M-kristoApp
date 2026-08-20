import { apiFetch } from "./client"

export type Prayer = {
  id: string
  category: string
  day_number: number | null
  title_sw: string
  title_en: string | null
  body_sw: string
  body_en: string | null
  order_index: number
}

export type PrayerCategory = {
  id: string
  name_sw: string
  name_en: string | null
  kind: "common" | "novena" | "rosary" | "other"
  is_premium: boolean
  order_index: number
  prayers: Prayer[]
}

export function listPrayerCategories() {
  return apiFetch<PrayerCategory[]>("/api/v1/prayers/categories/", { auth: false })
}

export function getPrayerCategory(id: string) {
  return apiFetch<PrayerCategory>(`/api/v1/prayers/categories/${id}/`, { auth: false })
}
