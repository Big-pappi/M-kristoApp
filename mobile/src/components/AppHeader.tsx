import type { ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

import { useTheme } from "../theme/useTheme"
import { useNotifications } from "../notifications/useNotifications"

type AppHeaderProps = {
  /** Small overline above the title, e.g. "Bible". */
  eyebrow?: string
  title?: string
  /** Show a back chevron instead of the app mark. */
  back?: boolean
  /** Extra control rendered to the left of the bell. */
  action?: ReactNode
}

/**
 * The single header used across every screen. It owns the notification bell
 * (top-right, app-wide) so the entry point never moves between pages.
 */
export function AppHeader({ eyebrow, title, back = false, action }: AppHeaderProps) {
  const { colors, spacing, radius, type } = useTheme()
  const router = useRouter()
  const { unreadCount } = useNotifications()

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.md, paddingBottom: spacing.sm }]}>
      {back ? (
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.full,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
      ) : (
        <View
          style={[
            styles.mark,
            { backgroundColor: colors.primary, borderRadius: radius.sm },
          ]}
        >
          <Text style={[styles.markText, { color: colors.accent }]}>M</Text>
        </View>
      )}

      <View style={styles.titleBlock}>
        {eyebrow ? (
          <Text style={[type.overline, { color: colors.textFaint }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        {title ? (
          <Text style={[type.heading, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {action}

      <Pressable
        onPress={() => router.push("/notifications")}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.full,
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <Ionicons name="notifications-outline" size={20} color={colors.text} />
        {unreadCount > 0 ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.accent, borderColor: colors.background },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.accentForeground }]}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 4,
  },
  titleBlock: { flex: 1 },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  mark: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: { fontWeight: "800", fontSize: 20 },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "800" },
})
