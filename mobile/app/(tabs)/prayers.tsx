import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native"

import { listPrayerCategories, type PrayerCategory } from "../../src/api/prayers"
import { AppHeader } from "../../src/components/AppHeader"
import { Badge } from "../../src/components/Badge"
import { PremiumGate } from "../../src/components/PremiumGate"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const KIND_ICON: Record<PrayerCategory["kind"], keyof typeof import("@expo/vector-icons").Ionicons.glyphMap> = {
  common: "hand-left",
  novena: "flower",
  rosary: "ellipse",
  other: "book",
}

export default function PrayersScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, elevation } = useTheme()
  const isEnglish = i18n.language === "en"

  const [categories, setCategories] = useState<PrayerCategory[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPrayerCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  function toggle(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <Screen header={<AppHeader eyebrow={t("common.appName")} title={t("prayers.title")} />}>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <View style={{ gap: spacing.md, marginTop: spacing.xs }}>
          {categories.map((category) => {
            const isOpen = expanded === category.id
            const name = isEnglish && category.name_en ? category.name_en : category.name_sw
            return (
              <View
                key={category.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg },
                  elevation.sm,
                ]}
              >
                <Pressable
                  onPress={() => toggle(category.id)}
                  accessibilityRole="button"
                  style={styles.header}
                >
                  <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft, borderRadius: radius.md }]}>
                    <Ionicons name={KIND_ICON[category.kind]} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[type.heading, { color: colors.text }]}>{name}</Text>
                    <View style={styles.metaRow}>
                      <Text style={[type.caption, { color: colors.textMuted }]}>
                        {category.prayers.length} {isEnglish ? "prayers" : "sala"}
                      </Text>
                      {category.is_premium ? (
                        <Badge label={t("premium.badge")} variant="gold" icon="sparkles" />
                      ) : null}
                    </View>
                  </View>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>

                {isOpen ? (
                  <View style={{ marginTop: spacing.sm }}>
                    <PremiumGate unlocked={!category.is_premium} minHeight={160}>
                      <View style={{ gap: spacing.md }}>
                        {category.prayers.map((prayer) => {
                          const title = isEnglish && prayer.title_en ? prayer.title_en : prayer.title_sw
                          const body = isEnglish && prayer.body_en ? prayer.body_en : prayer.body_sw
                          return (
                            <View key={prayer.id}>
                              <Text style={[type.label, { color: colors.accent }]}>
                                {prayer.day_number ? `${prayer.day_number}. ` : ""}
                                {title}
                              </Text>
                              <Text style={[type.body, { color: colors.text, marginTop: 4 }]}>
                                {body}
                              </Text>
                            </View>
                          )
                        })}
                      </View>
                    </PremiumGate>
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
})
