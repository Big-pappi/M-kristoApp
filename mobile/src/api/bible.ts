import { apiFetch } from "./client"

// Import KJV book data (default version)
import GenesisData from "../../books/versions/KJV/Genesis.json"
import ExodusData from "../../books/versions/KJV/Exodus.json"
import LeviticusData from "../../books/versions/KJV/Leviticus.json"
import NumbersData from "../../books/versions/KJV/Numbers.json"
import DeuteronomyData from "../../books/versions/KJV/Deuteronomy.json"
import JoshuaData from "../../books/versions/KJV/Joshua.json"
import JudgesData from "../../books/versions/KJV/Judges.json"
import RuthData from "../../books/versions/KJV/Ruth.json"
import Samuel1Data from "../../books/versions/KJV/1Samuel.json"
import Samuel2Data from "../../books/versions/KJV/2Samuel.json"
import Kings1Data from "../../books/versions/KJV/1Kings.json"
import Kings2Data from "../../books/versions/KJV/2Kings.json"
import Chronicles1Data from "../../books/versions/KJV/1Chronicles.json"
import Chronicles2Data from "../../books/versions/KJV/2Chronicles.json"
import EzraData from "../../books/versions/KJV/Ezra.json"
import NehemiahData from "../../books/versions/KJV/Nehemiah.json"
import EstherData from "../../books/versions/KJV/Esther.json"
import JobData from "../../books/versions/KJV/Job.json"
import PsalmsData from "../../books/versions/KJV/Psalms.json"
import ProverbsData from "../../books/versions/KJV/Proverbs.json"
import EcclesiastesData from "../../books/versions/KJV/Ecclesiastes.json"
import SongofSolomonData from "../../books/versions/KJV/SongofSolomon.json"
import IsaiahData from "../../books/versions/KJV/Isaiah.json"
import JeremiahData from "../../books/versions/KJV/Jeremiah.json"
import LamentationsData from "../../books/versions/KJV/Lamentations.json"
import EzekielData from "../../books/versions/KJV/Ezekiel.json"
import DanielData from "../../books/versions/KJV/Daniel.json"
import HoseaData from "../../books/versions/KJV/Hosea.json"
import JoelData from "../../books/versions/KJV/Joel.json"
import AmosData from "../../books/versions/KJV/Amos.json"
import ObadiahData from "../../books/versions/KJV/Obadiah.json"
import JonahData from "../../books/versions/KJV/Jonah.json"
import MicahData from "../../books/versions/KJV/Micah.json"
import NahumData from "../../books/versions/KJV/Nahum.json"
import HabakkukData from "../../books/versions/KJV/Habakkuk.json"
import ZephaniahData from "../../books/versions/KJV/Zephaniah.json"
import HaggaiData from "../../books/versions/KJV/Haggai.json"
import ZechariahData from "../../books/versions/KJV/Zechariah.json"
import MalachiData from "../../books/versions/KJV/Malachi.json"
import MatthewData from "../../books/versions/KJV/Matthew.json"
import MarkData from "../../books/versions/KJV/Mark.json"
import LukeData from "../../books/versions/KJV/Luke.json"
import JohnData from "../../books/versions/KJV/John.json"
import ActsData from "../../books/versions/KJV/Acts.json"
import RomansData from "../../books/versions/KJV/Romans.json"
import Corinthians1Data from "../../books/versions/KJV/1Corinthians.json"
import Corinthians2Data from "../../books/versions/KJV/2Corinthians.json"
import GalatiansData from "../../books/versions/KJV/Galatians.json"
import EphesiansData from "../../books/versions/KJV/Ephesians.json"
import PhilippiansData from "../../books/versions/KJV/Philippians.json"
import ColossiansData from "../../books/versions/KJV/Colossians.json"
import Thessalonians1Data from "../../books/versions/KJV/1Thessalonians.json"
import Thessalonians2Data from "../../books/versions/KJV/2Thessalonians.json"
import Timothy1Data from "../../books/versions/KJV/1Timothy.json"
import Timothy2Data from "../../books/versions/KJV/2Timothy.json"
import TitusData from "../../books/versions/KJV/Titus.json"
import PhilemonData from "../../books/versions/KJV/Philemon.json"
import HebrewsData from "../../books/versions/KJV/Hebrews.json"
import JamesData from "../../books/versions/KJV/James.json"
import Peter1Data from "../../books/versions/KJV/1Peter.json"
import Peter2Data from "../../books/versions/KJV/2Peter.json"
import John1Data from "../../books/versions/KJV/1John.json"
import John2Data from "../../books/versions/KJV/2John.json"
import John3Data from "../../books/versions/KJV/3John.json"
import JudeData from "../../books/versions/KJV/Jude.json"
import RevelationData from "../../books/versions/KJV/Revelation.json"

const bookDataMap: Record<string, any> = {
  Genesis: GenesisData,
  Exodus: ExodusData,
  Leviticus: LeviticusData,
  Numbers: NumbersData,
  Deuteronomy: DeuteronomyData,
  Joshua: JoshuaData,
  Judges: JudgesData,
  Ruth: RuthData,
  "1Samuel": Samuel1Data,
  "2Samuel": Samuel2Data,
  "1Kings": Kings1Data,
  "2Kings": Kings2Data,
  "1Chronicles": Chronicles1Data,
  "2Chronicles": Chronicles2Data,
  Ezra: EzraData,
  Nehemiah: NehemiahData,
  Esther: EstherData,
  Job: JobData,
  Psalms: PsalmsData,
  Proverbs: ProverbsData,
  Ecclesiastes: EcclesiastesData,
  SongofSolomon: SongofSolomonData,
  Isaiah: IsaiahData,
  Jeremiah: JeremiahData,
  Lamentations: LamentationsData,
  Ezekiel: EzekielData,
  Daniel: DanielData,
  Hosea: HoseaData,
  Joel: JoelData,
  Amos: AmosData,
  Obadiah: ObadiahData,
  Jonah: JonahData,
  Micah: MicahData,
  Nahum: NahumData,
  Habakkuk: HabakkukData,
  Zephaniah: ZephaniahData,
  Haggai: HaggaiData,
  Zechariah: ZechariahData,
  Malachi: MalachiData,
  Matthew: MatthewData,
  Mark: MarkData,
  Luke: LukeData,
  John: JohnData,
  Acts: ActsData,
  Romans: RomansData,
  "1Corinthians": Corinthians1Data,
  "2Corinthians": Corinthians2Data,
  Galatians: GalatiansData,
  Ephesians: EphesiansData,
  Philippians: PhilippiansData,
  Colossians: ColossiansData,
  "1Thessalonians": Thessalonians1Data,
  "2Thessalonians": Thessalonians2Data,
  "1Timothy": Timothy1Data,
  "2Timothy": Timothy2Data,
  Titus: TitusData,
  Philemon: PhilemonData,
  Hebrews: HebrewsData,
  James: JamesData,
  "1Peter": Peter1Data,
  "2Peter": Peter2Data,
  "1John": John1Data,
  "2John": John2Data,
  "3John": John3Data,
  Jude: JudeData,
  Revelation: RevelationData,
}

export type VerseOfDay = {
  id: string
  date: string
  reference_sw: string
  reference_en: string | null
  text_sw: string
  text_en: string | null
}

export type BibleVersion = {
  id: string
  code: string
  name_sw: string
  name_en: string
  language: "sw" | "en"
  is_active: boolean
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
  audio_url?: string
}

export type Chapter = {
  chapter: string
  verses: Verse[]
}

export type BookData = {
  book: string
  version: string
  language: string
  chapters: Chapter[]
}

export function getVerseOfTheDay() {
  return apiFetch<VerseOfDay>("/api/v1/bible/verse-of-the-day/", { auth: false })
}

export function listBooks() {
  return apiFetch<Book[]>("/api/v1/bible/books/", { auth: false })
}

export function listBibleVersions() {
  return apiFetch<BibleVersion[]>("/api/v1/bible/versions/", { auth: false })
}

export function listVerses(bookId: string, chapter: number, versionId?: string) {
  const versionParam = versionId ? `&version=${versionId}` : ""
  return apiFetch<Verse[]>(`/api/v1/bible/verses/?book=${bookId}&chapter=${chapter}${versionParam}`, {
    auth: false,
  })
}

export function searchVerses(query: string, versionId?: string) {
  const versionParam = versionId ? `&version=${versionId}` : ""
  return apiFetch<Verse[]>(`/api/v1/bible/verses/?search=${encodeURIComponent(query)}${versionParam}`, {
    auth: false,
  })
}

// Local data functions
export async function getLocalBooks(): Promise<Book[]> {
  const bookNames = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
  ]
  
  const oldTestamentBooks = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ]
  
  const books: Book[] = bookNames.map((name, index) => {
    const fileName = name.replace(/\s+/g, "")
    const bookData = bookDataMap[fileName]
    return {
      id: fileName,
      name_sw: name,
      name_en: name,
      testament: oldTestamentBooks.includes(name) ? "old" : "new",
      order_index: index,
      chapter_count: bookData?.chapters?.length || 0
    }
  })
  
  return books
}

export async function getLocalBookData(bookId: string, version: string = "KJV"): Promise<BookData | null> {
  const bookData = bookDataMap[bookId]
  if (!bookData) return null
  
  // Return with version info for future compatibility
  return {
    ...bookData,
    version: version,
    language: "en" // Default to English for KJV
  }
}

export async function getLocalBibleVersions(): Promise<BibleVersion[]> {
  return [
    {
      id: "1",
      code: "KJV",
      name_sw: "KJV - Tafsiri ya Kifaransa ya Kale",
      name_en: "KJV - King James Version",
      language: "en",
      is_active: true
    },
    {
      id: "2",
      code: "NIV",
      name_sw: "NIV - Tafsiri ya Kimataifa Mpya",
      name_en: "NIV - New International Version",
      language: "en",
      is_active: true
    },
    {
      id: "3",
      code: "NLT",
      name_sw: "NLT - Tafsiri ya Mpya ya Kimaisha",
      name_en: "NLT - New Living Translation",
      language: "en",
      is_active: true
    },
    {
      id: "4",
      code: "LSB",
      name_sw: "LSB - Tafsiri ya Kisasa ya Legasi",
      name_en: "LSB - Legacy Standard Bible",
      language: "en",
      is_active: true
    },
    {
      id: "5",
      code: "ESV",
      name_sw: "ESV - Tafsiri ya Kiingereza ya Kisasa",
      name_en: "ESV - English Standard Version",
      language: "en",
      is_active: true
    },
    {
      id: "6",
      code: "CPDV",
      name_sw: "CPDV - Tafsiri ya Kikatoliki ya Umma",
      name_en: "CPDV - Catholic Public Domain Version",
      language: "en",
      is_active: true
    }
  ]
}
