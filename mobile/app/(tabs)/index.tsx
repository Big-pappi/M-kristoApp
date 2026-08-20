import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

import { getVerseOfTheDay, type VerseOfDay } from "../../src/api/bible"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"
import { useProfile } from "../../src/hooks/useProfile"
import { usePremium } from "../../src/subscription/usePremium"

type QuickLink = {
  key: "hymns" | "devotion" | "dictionary"
  icon: keyof typeof Ionicons.glyphMap
  href: string
  premium?: boolean
}

const QUICK_LINKS: QuickLink[] = [
  { key: "hymns", icon: "musical-notes", href: "/hymns", premium: true },
  { key: "devotion", icon: "sunny", href: "/devotion" },
  { key: "dictionary", icon: "book-outline", href: "/dictionary" },
]

export default function HomeScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, gradients, elevation } = useTheme()
  const router = useRouter()
  const { firstName } = useProfile()
  const { isPremium } = usePremium()
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
  const verseText = verse && (isEnglish && verse.text_en ? verse.text_en : verse.text_sw)
  const verseRef = verse && (isEnglish && verse.reference_en ? verse.reference_en : verse.reference_sw)

  return (
    <Screen
      header={<AppHeader eyebrow={t("home.greeting")} title={firstName ?? t("common.appName")} />}
    >
      {/* Verse of the day hero */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.verseCard, { borderRadius: radius.xl }, elevation.md]}
      >
        <View style={styles.verseTop}>
          <View style={styles.verseBadge}>
            <Ionicons name="sparkles" size={13} color="#F4D68A" />
            <Text style={styles.verseBadgeText}>{t("home.verseOfDay")}</Text>
          </View>
          <Text style={styles.verseDate}>{t("common.today")}</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: spacing.lg }} />
        ) : error || !verse ? (
          <Text style={[styles.verseText, { marginTop: spacing.md }]}>{t("common.empty")}</Text>
        ) : (
          <>
            <Text style={[styles.verseText, { marginTop: spacing.md }]}>
              {`\u201C${verseText}\u201D`}
            </Text>
            <Text style={styles.verseRef}>{verseRef}</Text>

            <View style={styles.verseActions}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/verse-studio",
                    params: { text: verseText ?? "", reference: verseRef ?? "" },
                  })
                }
                accessibilityRole="button"
                style={({ pressed }) => [styles.shareBtn, { opacity: pressed ? 0.85 : 1 }]}
              >
                <LinearGradient
                  colors={gradients.gild}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.shareInner}
                >
                  <Ionicons name="color-wand" size={15} color="#221B10" />
                  <Text style={styles.shareText}>{t("home.share")}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </LinearGradient>

      {/* Membership banner — only for free members */}
      {!isPremium ? (
        <Pressable
          onPress={() => router.push("/subscription")}
          accessibilityRole="button"
          style={({ pressed }) => [styles.premiumBanner, { opacity: pressed ? 0.92 : 1, marginTop: spacing.md }]}
        >
          <LinearGradient
            colors={gradients.gild}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.premiumInner, { borderRadius: radius.lg }, elevation.sm]}
          >
            <View style={styles.premiumIcon}>
              <Ionicons name="sparkles" size={20} color="#221B10" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.premiumTitle}>{t("home.premiumBanner")}</Text>
              <Text style={styles.premiumBody} numberOfLines={1}>
                {t("home.premiumBannerBody")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#221B10" />
          </LinearGradient>
        </Pressable>
      ) : null}

      {/* Open the Bible CTA */}
      <Pressable
        onPress={() => router.push("/bible")}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.readCard,
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
        <View style={[styles.readIcon, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="book" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.heading, { color: colors.text }]}>{t("home.exploreBible")}</Text>
          <Text style={[type.caption, { color: colors.textMuted, marginTop: 2 }]}>
            {isEnglish ? "Old & New Testament, 66 books" : "Agano la Kale na Jipya, vitabu 66"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      {/* Quick links */}
      <Text style={[type.overline, { color: colors.textFaint, marginTop: spacing.xl }]}>
        {t("home.quickLinks")}
      </Text>
      <View style={[styles.quickRow, { marginTop: spacing.sm }]}>
        {QUICK_LINKS.map((link) => {
          const locked = link.premium && !isPremium
          return (
            <Pressable
              key={link.key}
              onPress={() => router.push((locked ? "/subscription" : link.href) as never)}
              accessibilityRole="button"
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.quickCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.lg,
                  },
                  elevation.sm,
                ]}
              >
                {locked ? (
                  <View style={[styles.lockPill, { backgroundColor: colors.accentSoft }]}>
                    <Ionicons name="lock-closed" size={11} color={colors.accent} />
                  </View>
                ) : null}
                <View style={[styles.quickIcon, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name={link.icon} size={22} color={colors.accent} />
                </View>
                <Text
                  style={[type.label, { color: colors.text, textAlign: "center" }]}
                  numberOfLines={2}
                >
                  {t(`home.${link.key}`)}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  verseCard: { padding: 20, marginTop: 4 },
  verseTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  verseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  verseBadgeText: {
    color: "#F4D68A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  verseDate: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600" },
  verseText: { color: "#FFFFFF", fontSize: 20, lineHeight: 31, fontWeight: "500" },
  verseRef: { color: "#F4D68A", fontSize: 14, fontWeight: "800", marginTop: 12, letterSpacing: 0.5 },
  verseActions: { flexDirection: "row", marginTop: 18 },
  shareBtn: { overflow: "hidden", borderRadius: 999 },
  shareInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  shareText: { color: "#221B10", fontWeight: "800", fontSize: 14 },
  premiumBanner: { overflow: "hidden" },
  premiumInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTitle: { color: "#221B10", fontWeight: "800", fontSize: 15 },
  premiumBody: { color: "rgba(34,27,16,0.75)", fontSize: 12, fontWeight: "600", marginTop: 2 },
  readCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  readIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickRow: { flexDirection: "row", gap: 10 },
  quickCard: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    position: "relative",
  },
  lockPill: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
})
