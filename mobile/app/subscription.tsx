import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Stack } from "expo-router"

import { listPlans, type Plan } from "../src/api/subscriptions"
import { AppHeader } from "../src/components/AppHeader"
import { Badge } from "../src/components/Badge"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"
import { usePremium } from "../src/subscription/usePremium"

const PERK_KEYS = ["perkHymns", "perkBackgrounds", "perkDevotion", "perkOffline"] as const

export default function SubscriptionScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, gradients, elevation } = useTheme()
  const { isPremium, setPremium } = usePremium()
  const isEnglish = i18n.language === "en"

  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    listPlans()
      .then((p) => {
        setPlans(p)
        if (p.length) setSelected(p[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("common.appName")} title={t("subscription.title")} />
        </>
      }
      footer={
        !loading && plans.length > 0 ? (
          <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <Pressable
              onPress={() => setPremium(!isPremium)}
              accessibilityRole="button"
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <LinearGradient
                colors={gradients.gild}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.cta, { borderRadius: radius.md }]}
              >
                <Ionicons name={isPremium ? "checkmark-circle" : "sparkles"} size={18} color="#221B10" />
                <Text style={styles.ctaText}>
                  {isPremium ? t("premium.active") : t("subscription.subscribe")}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : null
      }
    >
      {/* Hero */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderRadius: radius.xl }, elevation.md]}
      >
        <View style={styles.crown}>
          <Ionicons name="ribbon" size={24} color="#F4D68A" />
        </View>
        <Text style={styles.heroTitle}>{t("subscription.hero")}</Text>
        <Text style={styles.heroBody}>{t("subscription.heroBody")}</Text>
        {isPremium ? (
          <View style={styles.activeRow}>
            <Ionicons name="checkmark-circle" size={16} color="#8FE3B4" />
            <Text style={styles.activeText}>{t("premium.active")}</Text>
          </View>
        ) : null}
      </LinearGradient>

      {/* Perks */}
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        {PERK_KEYS.map((perk) => (
          <View key={perk} style={styles.perkRow}>
            <View style={[styles.perkIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="checkmark" size={15} color={colors.accent} />
            </View>
            <Text style={[type.body, { color: colors.text, flex: 1 }]}>
              {t(`subscription.${perk}`)}
            </Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <Text style={[type.overline, { color: colors.textFaint, marginTop: spacing.xl }]}>
        {t("subscription.choosePlan")}
      </Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {plans.map((plan, index) => {
            const active = selected === plan.id
            const name = isEnglish && plan.name_en ? plan.name_en : plan.name_sw
            const description =
              isEnglish && plan.description_en ? plan.description_en : plan.description_sw
            const best = index === plans.length - 1 && plans.length > 1
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                accessibilityRole="button"
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                    borderWidth: active ? 2 : 1,
                    borderRadius: radius.lg,
                  },
                  active ? elevation.sm : null,
                ]}
              >
                <View style={styles.planTop}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.planNameRow}>
                      <Text style={[type.heading, { color: colors.text }]}>{name}</Text>
                      {best ? <Badge label={t("subscription.bestValue")} variant="gold" /> : null}
                    </View>
                    {description ? (
                      <Text style={[type.caption, { color: colors.textMuted }]}>{description}</Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.radio,
                      { borderColor: active ? colors.accent : colors.borderStrong },
                    ]}
                  >
                    {active ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                  </View>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {plan.price_amount} {plan.price_currency}
                  </Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>
                    / {plan.duration_days} {isEnglish ? "days" : "siku"}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { padding: 22, marginTop: 4 },
  crown: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "800", marginTop: 16, letterSpacing: -0.4 },
  heroBody: { color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 22, marginTop: 8 },
  activeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 },
  activeText: { color: "#8FE3B4", fontWeight: "700", fontSize: 13 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  perkIcon: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  planCard: { padding: 16 },
  planTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  planNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 12 },
  price: { fontSize: 22, fontWeight: "800" },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  ctaText: { color: "#221B10", fontWeight: "800", fontSize: 16 },
})
