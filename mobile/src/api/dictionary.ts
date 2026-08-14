import { apiFetch } from "./client"

export type DictionaryTerm = {
  id: string
  term_sw: string
  term_en: string | null
  definition_sw: string
  definition_en: string | null
  related_scripture_reference: string | null
}

export function searchDictionary(query: string) {
  return apiFetch<DictionaryTerm[]>(`/api/v1/dictionary/?search=${encodeURIComponent(query)}`, {
    auth: false,
  })
}

export function listDictionary() {
  return apiFetch<DictionaryTerm[]>("/api/v1/dictionary/", { auth: false })
}
