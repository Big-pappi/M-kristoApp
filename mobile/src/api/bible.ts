import { apiFetch } from "./client"

export type VerseOfDay = {
  id: string
  date: string
  reference_sw: string
  reference_en: string | null
  text_sw: string
  text_en: string | null
}

export type Book = {
  id: string
  name_sw: string
  name_en: string
  testament: "old" | "new"
  order_index: number
  chapter_count: number
}

export type Verse = {
  id: string
  book: string
  chapter: number
  verse_number: number
  text_sw: string
  text_en: string | null
}

export function getVerseOfTheDay() {
  return apiFetch<VerseOfDay>("/api/v1/bible/verse-of-the-day/", { auth: false })
}

export function listBooks() {
  return apiFetch<Book[]>("/api/v1/bible/books/", { auth: false })
}

export function listVerses(bookId: string, chapter: number) {
  return apiFetch<Verse[]>(`/api/v1/bible/verses/?book=${bookId}&chapter=${chapter}`, {
    auth: false,
  })
}

export function searchVerses(query: string) {
  return apiFetch<Verse[]>(`/api/v1/bible/verses/?search=${encodeURIComponent(query)}`, {
    auth: false,
  })
}
