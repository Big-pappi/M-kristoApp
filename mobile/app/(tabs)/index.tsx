import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

import { getVerseOfTheDay, type VerseOfDay } from "../../src/api/bible"
import { Card } from "../../src/components/Card"
import { Screen } from "../../src/components/Screen"
import { SectionHeader } from "../../src/components/SectionHeader"
import { useTheme } from "../../src/theme/useTheme"

const QUICK_LINKS = [
  { key: "dictionary", icon: "book-outline" as const, href: "/dictionary" },
  { key: "hymns", icon: "musical-notes-outline" as const, href: "/hymns" },
  { key: "devotion", icon: "sunny-outline" as const, href: "/devotion" },
] as const

export default function HomeScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const [verse, setVerse] = useState<VerseOfDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true
    getVerseOfTheDay()
      .then((v) => mounted && setVerse(v))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const isEnglish = i18n.language === "en"

  return (
    <Screen>
      <Text style={[styles.greeting, { color: colors.textMuted }]}>{t("home.greeting")}</Text>
      <Text style={[styles.appName, { color: colors.text }]}>{t("common.appName")}</Text>

      <Card
        style={{
          marginTop: spacing.lg,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        }}
      >
        <View style={styles.verseHeaderRow}>
          <Ionicons name="star" size={18} color={colors.accent} />
          <Text style={[styles.verseLabel, { color: colors.primaryForeground }]}>
            {t("home.verseOfDay")}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} style={{ marginTop: spacing.md }} />
        ) : error || !verse ? (
          <Text style={{ color: colors.primaryForeground, marginTop: spacing.sm }}>
            {t("common.empty")}
          </Text>
        ) : (
          <>
            <Text
              style={[styles.verseText, { color: colors.primaryForeground, marginTop: spacing.sm }]}
            >
              &ldquo;{isEnglish && verse.text_en ? verse.text_en : verse.text_sw}&rdquo;
            </Text>
            <Text style={[styles.verseRef, { color: colors.accent, marginTop: spacing.sm }]}>
              {isEnglish && verse.reference_en ? verse.reference_en : verse.reference_sw}
            </Text>
          </>
        )}
      </Card>

      <View style={{ marginTop: spacing.xl }}>
        <SectionHeader title={t("home.quickLinks")} />
        <View style={styles.quickLinksRow}>
          {QUICK_LINKS.map((link) => (
            <Link key={link.key} href={link.href} asChild>
              <Pressable style={{ flex: 1 }}>
                <Card
                  style={{
                    alignItems: "center",
                    gap: spacing.xs,
                    borderRadius: radius.lg,
                  }}
                >
                  <Ionicons name={link.icon} size={26} color={colors.primary} />
                  <Text style={{ color: colors.text, fontWeight: "600", textAlign: "center" }}>
                    {t(`home.${link.key}`)}
                  </Text>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  greeting: { fontSize: 14 },
  appName: { fontSize: 28, fontWeight: "800", marginTop: 2 },
  verseHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  verseLabel: { fontWeight: "700", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 },
  verseText: { fontSize: 17, lineHeight: 26, fontStyle: "italic" },
  verseRef: { fontWeight: "700" },
  quickLinksRow: { flexDirection: "row", gap: 12 },
})
