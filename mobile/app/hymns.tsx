import { useEffect, useState } from "react"
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
import { Stack, useRouter } from "expo-router"

import { listHymns, type Hymn } from "../src/api/hymns"
import { AppHeader } from "../src/components/AppHeader"
import { Badge } from "../src/components/Badge"
import { PremiumGate } from "../src/components/PremiumGate"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"
import { usePremium } from "../src/subscription/usePremium"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function HymnsScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, elevation } = useTheme()
  const router = useRouter()
  const { isPremium } = usePremium()
  const isEnglish = i18n.language === "en"

  const [hymns, setHymns] = useState<Hymn[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true)
      listHymns(query.trim() || undefined)
        .then(setHymns)
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(handle)
  }, [query])

  function onPressHymn(hymn: Hymn) {
    if (hymn.is_premium && !isPremium) {
      router.push("/subscription")
      return
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded((prev) => (prev === hymn.id ? null : hymn.id))
  }

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("common.appName")} title={t("hymns.title")} />
        </>
      }
    >
      <PremiumGate unlocked={isPremium} minHeight={420}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.full,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("hymns.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, flex: 1, paddingVertical: 10 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : hymns.length === 0 ? (
        <Text style={[type.body, { color: colors.textMuted, marginTop: spacing.xl, textAlign: "center" }]}>
          {t("common.empty")}
        </Text>
      ) : (
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {hymns.map((hymn) => {
            const isOpen = expanded === hymn.id
            const locked = hymn.is_premium && !isPremium
            const title = isEnglish && hymn.title_en ? hymn.title_en : hymn.title_sw
            const lyrics = isEnglish && hymn.lyrics_en ? hymn.lyrics_en : hymn.lyrics_sw
            return (
              <View
                key={hymn.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg },
                  elevation.sm,
                ]}
              >
                <Pressable onPress={() => onPressHymn(hymn)} style={styles.header} accessibilityRole="button">
                  <View style={[styles.number, { backgroundColor: colors.primarySoft, borderRadius: radius.sm }]}>
                    <Text style={[styles.numberText, { color: colors.primary }]}>{hymn.number}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[type.heading, { color: colors.text }]} numberOfLines={2}>
                      {title}
                    </Text>
                    {hymn.is_premium ? (
                      <Badge label={t("premium.badge")} variant="gold" icon="sparkles" />
                    ) : null}
                  </View>
                  <Ionicons
                    name={locked ? "lock-closed" : isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={locked ? colors.accent : colors.textMuted}
                  />
                </Pressable>
                {isOpen && !locked ? (
                  <Text style={[styles.lyrics, { color: colors.text }]}>{lyrics}</Text>
                ) : null}
              </View>
            )
          })}
        </View>
      )}
      </PremiumGate>
    </Screen>
  )
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  card: { padding: 14, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  number: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  numberText: { fontWeight: "800", fontSize: 15 },
  lyrics: { marginTop: 12, lineHeight: 26, fontSize: 15 },
})
