import { apiFetch } from "./client"

export type Favorite = {
  id: string
  content_type: "verse" | "prayer" | "hymn" | "devotion" | "dictionary_term"
  content_id: string
  created_at: string
}

export function listFavorites(contentType?: Favorite["content_type"]) {
  const qs = contentType ? `?content_type=${contentType}` : ""
  return apiFetch<Favorite[]>(`/api/v1/favorites/${qs}`)
}

export function addFavorite(input: { content_type: Favorite["content_type"]; content_id: string }) {
  return apiFetch<Favorite>("/api/v1/favorites/", { method: "POST", body: input })
}

export function removeFavorite(id: string) {
  return apiFetch<void>(`/api/v1/favorites/${id}/`, { method: "DELETE" })
}
