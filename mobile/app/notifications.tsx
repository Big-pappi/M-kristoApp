import { Ionicons } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { AppHeader } from "../src/components/AppHeader"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"
import {
  formatRelative,
  NOTIFICATION_ICONS,
  useNotifications,
  type AppNotification,
} from "../src/notifications/useNotifications"

const KIND_TINT: Record<AppNotification["kind"], "primary" | "accent"> = {
  verse: "primary",
  devotion: "accent",
  prayer: "primary",
  premium: "accent",
  system: "primary",
}

export default function NotificationsScreen() {
  const { colors, spacing, radius, type, elevation } = useTheme()
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isEnglish = i18n.language === "en"
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader
            back
            title={t("notifications.title")}
            action={
              unreadCount > 0 ? (
                <Pressable
                  onPress={markAllRead}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={t("notifications.markAllRead")}
                  style={({ pressed }) => [
                    styles.markAll,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderStrong,
                      borderRadius: radius.full,
                      opacity: pressed ? 0.65 : 1,
                    },
                  ]}
                >
                  <Ionicons name="checkmark-done-outline" size={19} color={colors.primary} />
                </Pressable>
              ) : null
            }
          />
        </>
      }
    >
      {notifications.length === 0 ? (
        <View style={[styles.empty, { marginTop: spacing.xxl }]}>
          <Ionicons name="notifications-off-outline" size={40} color={colors.textFaint} />
          <Text style={[type.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
            {t("notifications.empty")}
          </Text>
        </View>
      ) : (
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {notifications.map((n) => {
            const tint = KIND_TINT[n.kind] === "accent" ? colors.accent : colors.primary
            const tintSoft = KIND_TINT[n.kind] === "accent" ? colors.accentSoft : colors.primarySoft
            return (
              <Pressable
                key={n.id}
                onPress={() => {
                  markRead(n.id)
                  if (n.href) router.push(n.href as never)
                }}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: colors.surface,
                    borderColor: n.read ? colors.border : colors.borderStrong,
                    borderRadius: radius.lg,
                    opacity: pressed ? 0.85 : 1,
                  },
                  n.read ? null : elevation.sm,
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: tintSoft, borderRadius: radius.md }]}>
                  <Ionicons name={NOTIFICATION_ICONS[n.kind]} size={20} color={tint} />
                </View>
                <View style={styles.body}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[type.heading, { color: colors.text, flex: 1 }]}
                      numberOfLines={1}
                    >
                      {isEnglish ? n.title_en : n.title_sw}
                    </Text>
                    {!n.read ? (
                      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                    ) : null}
                  </View>
                  <Text
                    style={[type.body, { color: colors.textMuted, marginTop: 2 }]}
                    numberOfLines={2}
                  >
                    {isEnglish ? n.body_en : n.body_sw}
                  </Text>
                  <Text style={[type.caption, { color: colors.textFaint, marginTop: 6 }]}>
                    {formatRelative(n.createdAt, isEnglish)}
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
  markAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    height: 34,
  },
  markAllText: { fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center" },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
})
