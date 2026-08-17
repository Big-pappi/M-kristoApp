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
  verse: string
  text: string
}

export type Chapter = {
  chapter: string
  verses: Verse[]
}

export type BookData = {
  book: string
  chapters: Chapter[]
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

// Local data functions
export async function getLocalBooks(): Promise<Book[]> {
  const bookNames = require("../../books/Books.json") as string[]
  
  const oldTestamentBooks = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ]
  
  const newTestamentBooks = [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
  ]
  
  const books: Book[] = bookNames.map((name, index) => {
    const fileName = name.replace(/\s+/g, "")
    try {
      const bookData = require(`../../books/${fileName}.json`) as BookData
      return {
        id: fileName,
        name_sw: name,
        name_en: name,
        testament: oldTestamentBooks.includes(name) ? "old" : "new",
        order_index: index,
        chapter_count: bookData.chapters.length
      }
    } catch (error) {
      return {
        id: fileName,
        name_sw: name,
        name_en: name,
        testament: oldTestamentBooks.includes(name) ? "old" : "new",
        order_index: index,
        chapter_count: 0
      }
    }
  })
  
  return books
}

export async function getLocalBookData(bookId: string): Promise<BookData | null> {
  try {
    const bookData = require(`../../books/${bookId}.json`) as BookData
    return bookData
  } catch (error) {
    return null
  }
}
