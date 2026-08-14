import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"

import { listDictionary, searchDictionary, type DictionaryTerm } from "../src/api/dictionary"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

export default function DictionaryScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const isEnglish = i18n.language === "en"

  const [terms, setTerms] = useState<DictionaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    listDictionary()
      .then(setTerms)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      if (!query.trim()) {
        listDictionary().then(setTerms)
        return
      }
      searchDictionary(query.trim()).then(setTerms)
    }, 300)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("dictionary.title") }} />

      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("dictionary.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, flex: 1, padding: spacing.sm }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : terms.length === 0 ? (
        <Text style={{ color: colors.textMuted, marginTop: spacing.lg, textAlign: "center" }}>
          {t("common.empty")}
        </Text>
      ) : (
        terms.map((term) => {
          const title = isEnglish && term.term_en ? term.term_en : term.term_sw
          const definition =
            isEnglish && term.definition_en ? term.definition_en : term.definition_sw
          return (
            <Card key={term.id} style={{ marginTop: spacing.sm }}>
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}>
                {title}
              </Text>
              <Text style={{ color: colors.textMuted, marginTop: 2, fontWeight: "600", fontSize: 11, textTransform: "uppercase" }}>
                {t("dictionary.meaning")}
              </Text>
              <Text style={{ color: colors.text, marginTop: 4, lineHeight: 22 }}>{definition}</Text>
              {term.related_scripture_reference ? (
                <Text style={{ color: colors.accent, marginTop: spacing.sm, fontWeight: "600" }}>
                  {term.related_scripture_reference}
                </Text>
              ) : null}
            </Card>
          )
        })
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
})
