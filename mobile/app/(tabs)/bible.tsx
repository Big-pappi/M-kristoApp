import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

import { getLocalBooks, type Book } from "../../src/api/bible"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"
import { useBibleVersion } from "../../src/hooks/useBibleVersion"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Testament = "old" | "new"

export default function BibleScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, gradients, elevation } = useTheme()
  const router = useRouter()
  const isEnglish = i18n.language === "en"
  const { selectedVersion, versions, setVersion, loading: versionLoading } = useBibleVersion()

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<Testament | null>(null)
  const [showVersionSelector, setShowVersionSelector] = useState(false)

  useEffect(() => {
    getLocalBooks()
      .then(setBooks)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      books.filter((b) => {
        const name = isEnglish ? b.name_en : b.name_sw
        return name.toLowerCase().includes(query.toLowerCase())
      }),
    [books, query, isEnglish],
  )

  const oldBooks = filtered.filter((b) => b.testament === "old")
  const newBooks = filtered.filter((b) => b.testament === "new")
  const searching = query.trim().length > 0

  function toggle(testament: Testament) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((prev) => (prev === testament ? null : testament))
  }

  function openBook(book: Book) {
    router.push({ 
      pathname: "/bible/[bookId]", 
      params: { bookId: book.id, version: selectedVersion } 
    })
  }

  const testaments: {
    key: Testament
    title: string
    subtitle: string
    icon: keyof typeof Ionicons.glyphMap
    books: Book[]
    stops: readonly [string, string, ...string[]]
  }[] = [
    {
      key: "old",
      title: t("bible.oldTestament"),
      subtitle: isEnglish ? "Law, history, poetry & prophets" : "Torati, historia, mashairi na manabii",
      icon: "flame",
      books: oldBooks,
      stops: gradients.hero,
    },
    {
      key: "new",
      title: t("bible.newTestament"),
      subtitle: isEnglish ? "Gospels, letters & revelation" : "Injili, nyaraka na ufunuo",
      icon: "sunny",
      books: newBooks,
      stops: gradients.gild,
    },
  ]

  return (
    <Screen
      header={<AppHeader eyebrow={t("common.appName")} title={t("bible.title")} />}
    >
      {/* Hero */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderRadius: radius.xl }, elevation.md]}
      >
        <View style={styles.heroIcon}>
          <Ionicons name="book" size={20} color="#F4D68A" />
        </View>
        <Text style={[styles.heroTitle]}>{t("bible.title")}</Text>
        <Text style={styles.heroSub}>
          {isEnglish ? "66 books, two testaments, one Word." : "Vitabu 66, maagano mawili, Neno moja."}
        </Text>
      </LinearGradient>

      {/* Search */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.full,
            marginTop: spacing.md,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("bible.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, flex: 1, paddingVertical: 10 }}
        />
        {searching ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Version Selector */}
      <Pressable
        onPress={() => setShowVersionSelector(!showVersionSelector)}
        style={({ pressed }) => [
          styles.versionSelector,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.lg,
            marginTop: spacing.md,
            opacity: pressed ? 0.9 : 1,
          },
          elevation.sm,
        ]}
      >
        <View style={[styles.versionIcon, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="book-outline" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.label, { color: colors.text }]}>
            {isEnglish ? "Bible Version" : "Tafsiri ya Biblia"}
          </Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>
            {selectedVersion}
          </Text>
        </View>
        <Ionicons
          name={showVersionSelector ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>

      {showVersionSelector && !versionLoading && (
        <View
          style={[
            styles.versionList,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.lg,
              marginTop: spacing.sm,
            },
            elevation.sm,
          ]}
        >
          {versions.map((version) => (
            <Pressable
              key={version.id}
              onPress={() => {
                setVersion(version.code)
                setShowVersionSelector(false)
              }}
              style={({ pressed }) => [
                styles.versionItem,
                {
                  backgroundColor: selectedVersion === version.code ? colors.primarySoft : "transparent",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  type.label,
                  {
                    color: selectedVersion === version.code ? colors.primary : colors.text,
                  },
                ]}
              >
                {isEnglish ? version.name_en : version.name_sw}
              </Text>
              {selectedVersion === version.code && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <View style={{ marginTop: spacing.md, gap: spacing.md }}>
          {testaments.map((section) => {
            const expanded = searching || open === section.key
            return (
              <View key={section.key}>
                <Pressable
                  onPress={() => toggle(section.key)}
                  accessibilityRole="button"
                  style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
                >
                  <LinearGradient
                    colors={section.stops}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.banner, { borderRadius: radius.lg }, elevation.sm]}
                  >
                    <View style={styles.bannerIcon}>
                      <Ionicons name={section.icon} size={22} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bannerTitle}>{section.title}</Text>
                      <Text style={styles.bannerSub} numberOfLines={1}>
                        {section.books.length} {isEnglish ? "books" : "vitabu"} · {section.subtitle}
                      </Text>
                    </View>
                    <Ionicons
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="rgba(255,255,255,0.9)"
                    />
                  </LinearGradient>
                </Pressable>

                {expanded ? (
                  section.books.length === 0 ? (
                    <Text style={[type.body, { color: colors.textMuted, padding: spacing.md }]}>
                      {t("common.empty")}
                    </Text>
                  ) : (
                    <View style={styles.grid}>
                      {section.books.map((book) => (
                        <Pressable
                          key={book.id}
                          onPress={() => openBook(book)}
                          accessibilityRole="button"
                          style={({ pressed }) => [
                            styles.bookCard,
                            {
                              backgroundColor: colors.surface,
                              borderColor: colors.border,
                              borderRadius: radius.md,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          <Text
                            style={[type.heading, { color: colors.text }]}
                            numberOfLines={1}
                          >
                            {isEnglish ? book.name_en : book.name_sw}
                          </Text>
                          <View style={styles.bookMeta}>
                            <Ionicons name="layers-outline" size={12} color={colors.accent} />
                            <Text style={[type.caption, { color: colors.textMuted }]}>
                              {book.chapter_count} {t("bible.chapter")}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  )
                ) : null}
              </View>
            )
          })}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { padding: 20, marginTop: 4 },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "800", marginTop: 14, letterSpacing: -0.4 },
  heroSub: { color: "rgba(255,255,255,0.78)", fontSize: 14, marginTop: 4 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  versionSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  versionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  versionList: {
    borderWidth: 1,
    padding: 8,
  },
  versionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  bookCard: {
    flexBasis: "48%",
    flexGrow: 1,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  bookMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
})
