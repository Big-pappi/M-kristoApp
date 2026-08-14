import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native"
import { Stack } from "expo-router"

import { listPlans, type Plan } from "../src/api/subscriptions"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

export default function SubscriptionScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
  const isEnglish = i18n.language === "en"

  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("settings.subscription") }} />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        plans.map((plan) => {
          const name = isEnglish && plan.name_en ? plan.name_en : plan.name_sw
          const description =
            isEnglish && plan.description_en ? plan.description_en : plan.description_sw
          return (
            <Card key={plan.id} style={{ marginTop: spacing.sm }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{name}</Text>
              <Text style={{ color: colors.textMuted, marginTop: 4, lineHeight: 20 }}>
                {description}
              </Text>
              <Text style={{ color: colors.primary, fontWeight: "700", marginTop: spacing.sm }}>
                {plan.price_amount} {plan.price_currency} / {plan.duration_days}{" "}
                {isEnglish ? "days" : "siku"}
              </Text>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.primary, borderRadius: radius.sm, marginTop: spacing.sm },
                ]}
              >
                <Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>
                  {t("settings.subscription")}
                </Text>
              </Pressable>
            </Card>
          )
        })
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  button: { alignItems: "center", paddingVertical: 10 },
})
