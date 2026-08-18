import type { ReactNode } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

import { useTheme } from "../theme/useTheme"
import { useNotifications } from "../notifications/useNotifications"
import { useProfile } from "../hooks/useProfile"

type AppHeaderProps = {
  /** Small overline above the title, e.g. "Bible". */
  eyebrow?: string
  title?: string
  /** Show a back chevron instead of the user avatar. */
  back?: boolean
  /**
   * Show the round user avatar on the left (tap → profile). Defaults to true
   * on top-level screens; pass `back` for detail screens to get a chevron.
   */
  showAvatar?: boolean
  /** Extra control rendered to the left of the bell. */
  action?: ReactNode
}

/**
 * The single header used across every screen. It owns the avatar (top-left,
 * tap → profile) and the notification bell (top-right, app-wide) so the app
 * chrome never shifts between pages.
 */
export function AppHeader({ eyebrow, title, back = false, showAvatar = true, action }: AppHeaderProps) {
  const { colors, spacing, radius, type } = useTheme()
  const router = useRouter()
  const { unreadCount } = useNotifications()
  const { user } = useProfile()

  const avatarUrl = user?.profile_picture_url

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
      ) : showAvatar ? (
        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          style={({ pressed }) => [
            styles.avatar,
            {
              backgroundColor: colors.primarySoft,
              borderColor: colors.border,
              borderRadius: radius.full,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImg} accessibilityIgnoresInvertColors />
          ) : (
            <Ionicons name="person" size={20} color={colors.primary} />
          )}
        </Pressable>
      ) : null}

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
  avatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
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
