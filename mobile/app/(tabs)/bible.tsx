import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { useRouter } from "expo-router"

import { listBooks, type Book } from "../../src/api/bible"
import { Card } from "../../src/components/Card"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"

export default function BibleScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const router = useRouter()
  const isEnglish = i18n.language === "en"

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    listBooks()
      .then(setBooks)
      .finally(() => setLoading(false))
  }, [])

  const filtered = books.filter((b) => {
    const name = isEnglish ? b.name_en : b.name_sw
    return name.toLowerCase().includes(query.toLowerCase())
  })

  const oldTestament = filtered.filter((b) => b.testament === "old")
  const newTestament = filtered.filter((b) => b.testament === "new")

  return (
    <Screen scroll={false}>
      <Text style={[styles.title, { color: colors.text }]}>{t("bible.title")}</Text>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("bible.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, padding: spacing.sm }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={[
            { key: "old", title: t("bible.oldTestament"), data: oldTestament },
            { key: "new", title: t("bible.newTestament"), data: newTestament },
          ]}
          keyExtractor={(section) => section.key}
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xl }}
          renderItem={({ item: section }) => (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {section.title}
              </Text>
              {section.data.map((book) => (
                <Pressable
                  key={book.id}
                  onPress={() => router.push({ pathname: "/bible/[bookId]", params: { bookId: book.id } })}
                >
                  <Card style={{ marginBottom: spacing.sm }}>
                    <Text style={{ color: colors.text, fontWeight: "600" }}>
                      {isEnglish ? book.name_en : book.name_sw}
                    </Text>
                    <Text style={{ color: colors.textMuted, marginTop: 2 }}>
                      {book.chapter_count} {t("bible.chapter")}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          )}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800" },
  searchBox: { borderWidth: 1, marginTop: 12 },
  sectionTitle: { fontWeight: "700", textTransform: "uppercase", fontSize: 12, marginBottom: 8, letterSpacing: 0.5 },
})
