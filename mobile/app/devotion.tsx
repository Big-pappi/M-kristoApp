import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Stack, useRouter } from "expo-router"

import { getTodaysDevotion, type Devotion } from "../src/api/devotions"
import { AppHeader } from "../src/components/AppHeader"
import { Badge } from "../src/components/Badge"
import { PremiumGate } from "../src/components/PremiumGate"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

const TYPES: Devotion["type"][] = ["neno_la_leo", "tafakari", "somo"]

const LABEL_KEYS: Record<Devotion["type"], string> = {
  neno_la_leo: "devotion.nenoLaLeo",
  tafakari: "devotion.reflection",
  somo: "devotion.somoLaLeo",
}

const TYPE_ICON: Record<Devotion["type"], keyof typeof Ionicons.glyphMap> = {
  neno_la_leo: "sunny",
  tafakari: "heart",
  somo: "book",
}

export default function DevotionScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, gradients, elevation } = useTheme()
  const router = useRouter()
  const isEnglish = i18n.language === "en"

  const [activeType, setActiveType] = useState<Devotion["type"]>("neno_la_leo")
  const [devotion, setDevotion] = useState<Devotion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTodaysDevotion(activeType)
      .then(setDevotion)
      .finally(() => setLoading(false))
  }, [activeType])

  const title = devotion && (isEnglish && devotion.title_en ? devotion.title_en : devotion.title_sw)
  const body = devotion && (isEnglish && devotion.body_en ? devotion.body_en : devotion.body_sw)

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("common.today")} title={t("devotion.title")} />
        </>
      }
    >
      {/* Type selector */}
      <View style={styles.tabsRow}>
        {TYPES.map((tType) => {
          const active = activeType === tType
          return (
            <Pressable
              key={tType}
              onPress={() => setActiveType(tType)}
              accessibilityRole="button"
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
                active ? elevation.sm : null,
              ]}
            >
              <Ionicons
                name={TYPE_ICON[tType]}
                size={14}
                color={active ? colors.primaryForeground : colors.textMuted}
              />
              <Text
                style={{
                  color: active ? colors.primaryForeground : colors.text,
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                {t(LABEL_KEYS[tType])}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : !devotion ? (
        <Text style={[type.body, { color: colors.textMuted, marginTop: spacing.xl, textAlign: "center" }]}>
          {t("common.empty")}
        </Text>
      ) : (
        <View style={{ marginTop: spacing.lg }}>
          {/* Header banner */}
          <LinearGradient
            colors={gradients.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.banner, { borderRadius: radius.xl }, elevation.md]}
          >
            <View style={styles.bannerTop}>
              <Text style={styles.bannerLabel}>{t(LABEL_KEYS[activeType])}</Text>
              {devotion.is_premium ? <Badge label={t("premium.badge")} variant="gold" icon="sparkles" /> : null}
            </View>
            <Text style={styles.bannerTitle}>{title}</Text>
            {devotion.scripture_reference ? (
              <View style={styles.refRow}>
                <Ionicons name="bookmark" size={13} color="#F4D68A" />
                <Text style={styles.bannerRef}>{devotion.scripture_reference}</Text>
              </View>
            ) : null}
          </LinearGradient>

          {/* Body — gated when premium */}
          <View style={{ marginTop: spacing.md }}>
            <PremiumGate unlocked={!devotion.is_premium} minHeight={220}>
              <View
                style={[
                  styles.bodyCard,
                  { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg },
                  elevation.sm,
                ]}
              >
                <Text style={[styles.bodyText, { color: colors.text }]}>{body}</Text>
              </View>
            </PremiumGate>
          </View>

          {devotion.scripture_reference ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/verse-studio",
                  params: { text: title ?? "", reference: devotion.scripture_reference ?? "" },
                })
              }
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.studioLink,
                {
                  borderColor: colors.borderStrong,
                  borderRadius: radius.md,
                  marginTop: spacing.md,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons name="color-wand-outline" size={17} color={colors.primary} />
              <Text style={[type.label, { color: colors.primary }]}>{t("home.share")}</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  tabsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 11,
    borderWidth: 1,
  },
  banner: { padding: 20 },
  bannerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bannerLabel: {
    color: "#F4D68A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  bannerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 12, lineHeight: 30 },
  refRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  bannerRef: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "700" },
  bodyCard: { padding: 18, borderWidth: 1 },
  bodyText: { fontSize: 16, lineHeight: 27 },
  studioLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 13,
  },
})
