import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"

import { listHymns, type Hymn } from "../src/api/hymns"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

export default function HymnsScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const isEnglish = i18n.language === "en"

  const [hymns, setHymns] = useState<Hymn[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const handle = setTimeout(() => {
      listHymns(query.trim() || undefined)
        .then(setHymns)
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("hymns.title") }} />

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
          placeholder={t("hymns.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, flex: 1, padding: spacing.sm }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : hymns.length === 0 ? (
        <Text style={{ color: colors.textMuted, marginTop: spacing.lg, textAlign: "center" }}>
          {t("common.empty")}
        </Text>
      ) : (
        hymns.map((hymn) => {
          const isOpen = expanded === hymn.id
          const title = isEnglish && hymn.title_en ? hymn.title_en : hymn.title_sw
          const lyrics = isEnglish && hymn.lyrics_en ? hymn.lyrics_en : hymn.lyrics_sw
          return (
            <Card key={hymn.id} style={{ marginTop: spacing.sm }}>
              <Pressable
                onPress={() => setExpanded(isOpen ? null : hymn.id)}
                style={styles.hymnHeader}
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>
                  {hymn.number}. {title}
                </Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
              {isOpen ? (
                <Text style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 24 }}>
                  {lyrics}
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
  hymnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
