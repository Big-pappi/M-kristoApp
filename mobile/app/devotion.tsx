import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { Stack } from "expo-router"

import { getTodaysDevotion, type Devotion } from "../src/api/devotions"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

const TYPES: Devotion["type"][] = ["neno_la_leo", "tafakari", "somo"]

const LABEL_KEYS: Record<Devotion["type"], string> = {
  neno_la_leo: "devotion.nenoLaLeo",
  tafakari: "devotion.reflection",
  somo: "devotion.somoLaLeo",
}

export default function DevotionScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius } = useTheme()
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
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("devotion.title") }} />

      <View style={styles.tabsRow}>
        {TYPES.map((type) => {
          const active = activeType === type
          return (
            <Pressable
              key={type}
              onPress={() => setActiveType(type)}
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text style={{ color: active ? colors.primaryForeground : colors.text, fontWeight: "600" }}>
                {t(LABEL_KEYS[type])}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : !devotion ? (
          <Text style={{ color: colors.textMuted }}>{t("common.empty")}</Text>
        ) : (
          <>
            <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 18 }}>{title}</Text>
            {devotion.scripture_reference ? (
              <Text style={{ color: colors.accent, marginTop: 4, fontWeight: "600" }}>
                {devotion.scripture_reference}
              </Text>
            ) : null}
            <Text style={{ color: colors.text, marginTop: spacing.md, lineHeight: 24 }}>{body}</Text>
          </>
        )}
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  tabsRow: { flexDirection: "row", gap: 8 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderWidth: 1 },
})
