import { apiFetch } from "./client"

export type Note = {
  id: string
  note_date: string
  title: string | null
  body: string
  linked_verse: string | null
  created_at: string
  updated_at: string
}

export type NoteInput = {
  note_date: string
  title?: string
  body: string
  linked_verse?: string | null
}

export function listNotes() {
  return apiFetch<Note[]>("/api/v1/notes/")
}

export function getNotesForDate(date: string) {
  return apiFetch<Note[]>(`/api/v1/notes/?date=${date}`)
}

export function createNote(input: NoteInput) {
  return apiFetch<Note>("/api/v1/notes/", { method: "POST", body: input })
}

export function updateNote(id: string, input: Partial<NoteInput>) {
  return apiFetch<Note>(`/api/v1/notes/${id}/`, { method: "PATCH", body: input })
}

export function deleteNote(id: string) {
  return apiFetch<void>(`/api/v1/notes/${id}/`, { method: "DELETE" })
}
