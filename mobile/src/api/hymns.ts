import { apiFetch } from "./client"

export type Hymn = {
  id: string
  number: number
  title_sw: string
  title_en: string | null
  lyrics_sw: string
  lyrics_en: string | null
  is_premium: boolean
}

export function listHymns(search?: string) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ""
  return apiFetch<Hymn[]>(`/api/v1/hymns/${qs}`, { auth: false })
}
