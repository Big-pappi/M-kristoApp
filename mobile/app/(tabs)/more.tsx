import { useState } from "react"
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

import { Screen } from "../../src/components/Screen"
import { SectionHeader } from "../../src/components/SectionHeader"
import { Card } from "../../src/components/Card"
import { useTheme } from "../../src/theme/useTheme"
import { setLanguage } from "../../src/i18n"
import { logout } from "../../src/api/auth"

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  right?: React.ReactNode
}

function Row({ icon, label, onPress, right }: RowProps) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceMuted }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </Pressable>
  )
}

export default function MoreScreen() {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()
  const router = useRouter()
  const [notificationsOn, setNotificationsOn] = useState(true)
  const isSwahili = i18n.language === "sw"

  async function handleLogout() {
    await logout()
    Alert.alert(t("settings.logout"), t("common.close"))
  }

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: colors.text }]}>{t("settings.title")}</Text>

      <SectionHeader title={t("home.quickLinks")} />
      <Card style={styles.group}>
        <Row
          icon="library"
          label={t("dictionary.title")}
          onPress={() => router.push("/dictionary")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Row icon="musical-notes" label={t("hymns.title")} onPress={() => router.push("/hymns")} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Row
          icon="star"
          label={t("bible.bookmarked")}
          onPress={() => router.push("/favorites")}
        />
      </Card>

      <SectionHeader title={t("settings.language")} />
      <Card style={styles.group}>
        <Row
          icon="language"
          label={t("settings.swahili")}
          onPress={() => setLanguage("sw")}
          right={isSwahili ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Row
          icon="language"
          label={t("settings.english")}
          onPress={() => setLanguage("en")}
          right={!isSwahili ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
        />
      </Card>

      <SectionHeader title={t("settings.notifications")} />
      <Card style={styles.group}>
        <Row
          icon="notifications"
          label={t("settings.notifications")}
          right={
            <Switch
              value={notificationsOn}
              onValueChange={setNotificationsOn}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          }
        />
      </Card>

      <SectionHeader title={t("settings.account")} />
      <Card style={styles.group}>
        <Row icon="person" label={t("settings.account")} onPress={() => router.push("/profile")} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Row icon="card" label={t("settings.subscription")} onPress={() => router.push("/subscription")} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Row icon="log-out" label={t("settings.logout")} onPress={handleLogout} />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  group: {
    padding: 0,
    marginBottom: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 58,
  },
})
