import { apiFetch } from "./client"

// Import all book data statically
import GenesisData from "../../books/Genesis.json"
import ExodusData from "../../books/Exodus.json"
import LeviticusData from "../../books/Leviticus.json"
import NumbersData from "../../books/Numbers.json"
import DeuteronomyData from "../../books/Deuteronomy.json"
import JoshuaData from "../../books/Joshua.json"
import JudgesData from "../../books/Judges.json"
import RuthData from "../../books/Ruth.json"
import Samuel1Data from "../../books/1Samuel.json"
import Samuel2Data from "../../books/2Samuel.json"
import Kings1Data from "../../books/1Kings.json"
import Kings2Data from "../../books/2Kings.json"
import Chronicles1Data from "../../books/1Chronicles.json"
import Chronicles2Data from "../../books/2Chronicles.json"
import EzraData from "../../books/Ezra.json"
import NehemiahData from "../../books/Nehemiah.json"
import EstherData from "../../books/Esther.json"
import JobData from "../../books/Job.json"
import PsalmsData from "../../books/Psalms.json"
import ProverbsData from "../../books/Proverbs.json"
import EcclesiastesData from "../../books/Ecclesiastes.json"
import SongofSolomonData from "../../books/SongofSolomon.json"
import IsaiahData from "../../books/Isaiah.json"
import JeremiahData from "../../books/Jeremiah.json"
import LamentationsData from "../../books/Lamentations.json"
import EzekielData from "../../books/Ezekiel.json"
import DanielData from "../../books/Daniel.json"
import HoseaData from "../../books/Hosea.json"
import JoelData from "../../books/Joel.json"
import AmosData from "../../books/Amos.json"
import ObadiahData from "../../books/Obadiah.json"
import JonahData from "../../books/Jonah.json"
import MicahData from "../../books/Micah.json"
import NahumData from "../../books/Nahum.json"
import HabakkukData from "../../books/Habakkuk.json"
import ZephaniahData from "../../books/Zephaniah.json"
import HaggaiData from "../../books/Haggai.json"
import ZechariahData from "../../books/Zechariah.json"
import MalachiData from "../../books/Malachi.json"
import MatthewData from "../../books/Matthew.json"
import MarkData from "../../books/Mark.json"
import LukeData from "../../books/Luke.json"
import JohnData from "../../books/John.json"
import ActsData from "../../books/Acts.json"
import RomansData from "../../books/Romans.json"
import Corinthians1Data from "../../books/1Corinthians.json"
import Corinthians2Data from "../../books/2Corinthians.json"
import GalatiansData from "../../books/Galatians.json"
import EphesiansData from "../../books/Ephesians.json"
import PhilippiansData from "../../books/Philippians.json"
import ColossiansData from "../../books/Colossians.json"
import Thessalonians1Data from "../../books/1Thessalonians.json"
import Thessalonians2Data from "../../books/2Thessalonians.json"
import Timothy1Data from "../../books/1Timothy.json"
import Timothy2Data from "../../books/2Timothy.json"
import TitusData from "../../books/Titus.json"
import PhilemonData from "../../books/Philemon.json"
import HebrewsData from "../../books/Hebrews.json"
import JamesData from "../../books/James.json"
import Peter1Data from "../../books/1Peter.json"
import Peter2Data from "../../books/2Peter.json"
import John1Data from "../../books/1John.json"
import John2Data from "../../books/2John.json"
import John3Data from "../../books/3John.json"
import JudeData from "../../books/Jude.json"
import RevelationData from "../../books/Revelation.json"

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

export async function getLocalBookData(bookId: string): Promise<BookData | null> {
  const bookData = bookDataMap[bookId]
  return bookData || null
}
