import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Audio } from 'expo-av'

import { addFavorite, removeFavorite, listFavorites } from "../../src/api/favorites"
import { getLocalBooks, getLocalBookData, type Book, type Chapter } from "../../src/api/bible"
import { ApiError } from "../../src/api/client"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"
import { useBibleVersion } from "../../src/hooks/useBibleVersion"

type LocalVerse = {
  verse: string
  text: string
  audio_url?: string
}

export default function ChapterReaderScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, elevation } = useTheme()
  const isEnglish = i18n.language === "en"
  const router = useRouter()
  const { bookId, chapter: chapterParam, version: versionParam } = useLocalSearchParams<{
    bookId: string
    chapter?: string
    version?: string
  }>()
  const { selectedVersion, setVersion } = useBibleVersion()

  const [book, setBook] = useState<Book | null>(null)
  const [chapter, setChapter] = useState(Number(chapterParam) || 1)
  const [verses, setVerses] = useState<LocalVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<Record<string, string>>({})
  const [currentAudio, setCurrentAudio] = useState<string | null>(null)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    getLocalBooks().then((books) => {
      setBook(books.find((b) => b.id === bookId) ?? null)
    })
  }, [bookId])

  useEffect(() => {
    if (!bookId) return
    setLoading(true)
    const versionToUse = versionParam || selectedVersion
    getLocalBookData(bookId, versionToUse)
      .then((data: { chapters: Chapter[] } | null) => {
        if (data) {
          const chapterData = data.chapters.find((c) => c.chapter === String(chapter))
          setVerses(chapterData?.verses || [])
        }
      })
      .finally(() => setLoading(false))
  }, [bookId, chapter, versionParam, selectedVersion])

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  async function playAudio(audioUrl: string) {
    if (currentAudio === audioUrl && isPlaying) {
      // Pause if playing the same audio
      await sound?.pauseAsync()
      setIsPlaying(false)
      return
    }

    if (currentAudio === audioUrl && !isPlaying) {
      // Resume if paused
      await sound?.playAsync()
      setIsPlaying(true)
      return
    }

    // Load new audio
    if (sound) {
      await sound.unloadAsync()
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      )
      setSound(newSound)
      setCurrentAudio(audioUrl)
      setIsPlaying(true)
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
          setCurrentAudio(null)
        }
      })
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  async function stopAudio() {
    if (sound) {
      await sound.stopAsync()
      await sound.unloadAsync()
      setSound(null)
      setCurrentAudio(null)
      setIsPlaying(false)
    }
  }

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
    }
  }

  function shareVerse(verse: LocalVerse) {
    router.push({
      pathname: "/verse-studio",
      params: {
        text: verse.text,
        reference: `${bookName ?? bookId} ${chapter}:${verse.verse}`,
      },
    })
  }

  return (
    <Screen
      scroll={false}
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("bible.chapter") + " " + chapter} title={bookName ?? t("bible.title")} />
        </>
      }
    >
      <FlatList
        horizontal
        data={chapters}
        keyExtractor={(c) => String(c)}
        showsHorizontalScrollIndicator={false}
        style={styles.chapterList}
        contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.md }}
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
                active ? elevation.sm : null,
              ]}
            >
              <Text style={{ color: active ? colors.primaryForeground : colors.text, fontWeight: "700" }}>
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
          contentContainerStyle={{
            paddingTop: spacing.md,
            paddingBottom: spacing.xxl,
            paddingHorizontal: spacing.md,
          }}
          ListHeaderComponent={
            <View style={styles.chapterHeading}>
              <Text style={[type.overline, { color: colors.accent }]}>
                {t("bible.chapter")} {chapter}
              </Text>
              <View style={[styles.rule, { backgroundColor: colors.border }]} />
            </View>
          }
          renderItem={({ item: verse }) => {
            const verseId = `${bookId}-${chapter}-${verse.verse}`
            const isFavorite = Boolean(favoriteIds[verseId])
            const hasAudio = Boolean(verse.audio_url)
            const isCurrentAudio = currentAudio === verse.audio_url
            
            return (
              <View
                style={[
                  styles.verseRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.verseNumber, { color: colors.accent }]}>{verse.verse}</Text>
                <Text style={[styles.verseText, { color: colors.text }]}>{verse.text}</Text>
                <View style={styles.verseActions}>
                  {hasAudio && (
                    <Pressable 
                      onPress={() => verse.audio_url && playAudio(verse.audio_url)} 
                      hitSlop={8}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <Ionicons
                        name={isCurrentAudio && isPlaying ? "pause-circle" : "play-circle"}
                        size={18}
                        color={isCurrentAudio ? colors.primary : colors.textMuted}
                      />
                    </Pressable>
                  )}
                  <Pressable onPress={() => shareVerse(verse)} hitSlop={8}>
                    <Ionicons name="color-wand-outline" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => toggleFavorite(verse)} hitSlop={8}>
                    <Ionicons
                      name={isFavorite ? "star" : "star-outline"}
                      size={18}
                      color={isFavorite ? colors.accent : colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>
            )
          }}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  chapterList: { flexGrow: 0, marginTop: 4, marginBottom: 4 },
  chapterChip: { paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, minWidth: 44, alignItems: "center" },
  chapterHeading: { alignItems: "center", marginBottom: 8, gap: 8 },
  rule: { width: 48, height: 2, borderRadius: 1 },
  verseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  verseNumber: { fontWeight: "800", fontSize: 13, marginTop: 4, minWidth: 22 },
  verseText: { flex: 1, fontSize: 17, lineHeight: 28 },
  verseActions: { gap: 14, alignItems: "center", paddingTop: 2 },
})
