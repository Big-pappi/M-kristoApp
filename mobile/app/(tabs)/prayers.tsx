import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

import { listPrayerCategories, type PrayerCategory } from "../../src/api/prayers"
import { Card } from "../../src/components/Card"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"

export default function PrayersScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing } = useTheme()
  const isEnglish = i18n.language === "en"

  const [categories, setCategories] = useState<PrayerCategory[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPrayerCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>{t("prayers.title")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        categories.map((category) => {
          const isOpen = expanded === category.id
          const name = isEnglish && category.name_en ? category.name_en : category.name_sw
          return (
            <Card key={category.id} style={{ marginTop: spacing.md }}>
              <Pressable
                onPress={() => setExpanded(isOpen ? null : category.id)}
                style={styles.categoryHeader}
              >
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                  {name}
                </Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>

              {isOpen &&
                category.prayers.map((prayer) => {
                  const title = isEnglish && prayer.title_en ? prayer.title_en : prayer.title_sw
                  const body = isEnglish && prayer.body_en ? prayer.body_en : prayer.body_sw
                  return (
                    <View key={prayer.id} style={{ marginTop: spacing.md }}>
                      <Text style={{ color: colors.primary, fontWeight: "600" }}>{title}</Text>
                      <Text style={{ color: colors.text, marginTop: 4, lineHeight: 22 }}>
                        {body}
                      </Text>
                    </View>
                  )
                })}
            </Card>
          )
        })
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800" },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
})
