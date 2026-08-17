import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Stack, useLocalSearchParams } from "expo-router"

import { addFavorite, removeFavorite, listFavorites } from "../../src/api/favorites"
import { getLocalBooks, getLocalBookData, type Book, type Chapter } from "../../src/api/bible"
import { ApiError } from "../../src/api/client"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"

type LocalVerse = {
  verse: string
  text: string
}

export default function ChapterReaderScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const isEnglish = i18n.language === "en"
  const { bookId, chapter: chapterParam } = useLocalSearchParams<{
    bookId: string
    chapter?: string
  }>()

  const [book, setBook] = useState<Book | null>(null)
  const [bookData, setBookData] = useState<Chapter[] | null>(null)
  const [chapter, setChapter] = useState(Number(chapterParam) || 1)
  const [verses, setVerses] = useState<LocalVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<Record<string, string>>({})

  useEffect(() => {
    getLocalBooks().then((books) => {
      const found = books.find((b) => b.id === bookId) ?? null
      setBook(found)
    })
  }, [bookId])

  useEffect(() => {
    if (!bookId) return
    setLoading(true)
    getLocalBookData(bookId)
      .then((data) => {
        if (data) {
          setBookData(data.chapters)
          const chapterData = data.chapters.find((c) => c.chapter === String(chapter))
          setVerses(chapterData?.verses || [])
        }
      })
      .finally(() => setLoading(false))
  }, [bookId, chapter])

  useEffect(() => {
    listFavorites("verse")
      .then((favs) => {
        const map: Record<string, string> = {}
        favs.forEach((f) => {
          map[f.content_id] = f.id
        })
        setFavoriteIds(map)
      })
      .catch(() => {
        // Guests can't have favorites — ignore the 401.
      })
  }, [])

  const bookName = book && (isEnglish ? book.name_en : book.name_sw)
  const chapterCount = book?.chapter_count ?? 1
  const chapters = useMemo(
    () => Array.from({ length: chapterCount }, (_, i) => i + 1),
    [chapterCount],
  )

  async function toggleFavorite(verse: LocalVerse) {
    // Generate a unique ID for local verses
    const verseId = `${bookId}-${chapter}-${verse.verse}`
    const existingId = favoriteIds[verseId]
    try {
      if (existingId) {
        await removeFavorite(existingId)
        setFavoriteIds((prev) => {
          const next = { ...prev }
          delete next[verseId]
          return next
        })
      } else {
        const fav = await addFavorite({ content_type: "verse", content_id: verseId })
        setFavoriteIds((prev) => ({ ...prev, [verseId]: fav.id }))
      }
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) throw err
      // Guests: silently no-op rather than crash the reader.
    }
  }

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ headerShown: true, title: bookName ?? t("bible.title") }} />

      <FlatList
        horizontal
        data={chapters}
        keyExtractor={(c) => String(c)}
        showsHorizontalScrollIndicator={false}
        style={styles.chapterList}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item: c }) => {
          const active = c === chapter
          return (
            <Pressable
              onPress={() => setChapter(c)}
              style={[
                styles.chapterChip,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text style={{ color: active ? colors.primaryForeground : colors.text, fontWeight: "600" }}>
                {c}
              </Text>
            </Pressable>
          )
        }}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={verses}
          keyExtractor={(v, index) => `${chapter}-${index}`}
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xl }}
          renderItem={({ item: verse }) => {
            const verseId = `${bookId}-${chapter}-${verse.verse}`
            const isFavorite = Boolean(favoriteIds[verseId])
            return (
              <View style={styles.verseRow}>
                <Text style={[styles.verseNumber, { color: colors.accent }]}>
                  {verse.verse}
                </Text>
                <Text style={[styles.verseText, { color: colors.text }]}>{verse.text}</Text>
                <Pressable onPress={() => toggleFavorite(verse)} hitSlop={8}>
                  <Ionicons
                    name={isFavorite ? "star" : "star-outline"}
                    size={18}
                    color={isFavorite ? colors.accent : colors.textMuted}
                  />
                </Pressable>
              </View>
            )
          }}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  chapterList: { flexGrow: 0, marginTop: 8 },
  chapterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  verseRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 8 },
  verseNumber: { fontWeight: "700", fontSize: 13, marginTop: 3, minWidth: 18 },
  verseText: { flex: 1, fontSize: 16, lineHeight: 24 },
})
