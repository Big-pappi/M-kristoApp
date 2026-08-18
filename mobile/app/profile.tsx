import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Stack, useRouter } from "expo-router"

import { AppHeader } from "../src/components/AppHeader"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"
import { useProfile } from "../src/hooks/useProfile"
import { usePremium } from "../src/subscription/usePremium"

function formatMemberSince(iso: string | undefined, isEnglish: boolean) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(isEnglish ? "en-US" : "sw-TZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type, gradients, elevation } = useTheme()
  const router = useRouter()
  const isEnglish = i18n.language === "en"

  const { user, loading } = useProfile()
  const { isPremium } = usePremium()

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login")
  }, [loading, user, router])

  const memberSince = formatMemberSince(user?.created_at, isEnglish)

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("common.appName")} title={t("profile.title")} />
        </>
      }
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
      ) : user ? (
        <>
          {/* Identity */}
          <View style={styles.identity}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primarySoft, borderColor: colors.border, borderRadius: radius.full },
              ]}
            >
              {user.profile_picture_url ? (
                <Image
                  source={{ uri: user.profile_picture_url }}
                  style={styles.avatarImg}
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <Ionicons name="person" size={44} color={colors.primary} />
              )}
            </View>

            {isPremium ? (
              <View style={[styles.memberChip, { backgroundColor: colors.accentSoft, borderRadius: radius.full }]}>
                <Ionicons name="sparkles" size={13} color={colors.accent} />
                <Text style={[styles.memberChipText, { color: colors.accent }]}>
                  {t("premium.active")}
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push("/subscription")}
                accessibilityRole="button"
                style={({ pressed }) => [styles.goPremium, { opacity: pressed ? 0.9 : 1 }]}
              >
                <LinearGradient
                  colors={gradients.gild}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.goPremiumInner, { borderRadius: radius.full }]}
                >
                  <Ionicons name="sparkles" size={14} color="#221B10" />
                  <Text style={styles.goPremiumText}>{t("profile.goPremium")}</Text>
                </LinearGradient>
              </Pressable>
            )}

            <Text style={[styles.name, { color: colors.text }]}>{user.full_name}</Text>
            {memberSince ? (
              <Text style={[type.caption, { color: colors.textMuted, marginTop: 4 }]}>
                {t("profile.memberSince")}: {memberSince}
              </Text>
            ) : null}
          </View>

          {/* Contact details */}
          <Card style={{ marginTop: spacing.lg }}>
            <DetailRow icon="call" label={t("auth.phoneNumber")} value={user.phone_number} />
            {user.email ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <DetailRow icon="mail" label="Email" value={user.email} />
              </>
            ) : null}
          </Card>

          {/* Actions */}
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <ActionRow
              icon="card"
              label={t("settings.subscription")}
              onPress={() => router.push("/subscription")}
            />
            <ActionRow
              icon="settings"
              label={t("settings.title")}
              onPress={() => router.push("/more")}
            />
          </View>
        </>
      ) : null}
    </Screen>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
}) {
  const { colors } = useTheme()
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.surfaceMuted }]}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textFaint, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 }}>
          {label}
        </Text>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600", marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  )
}

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}) {
  const { colors, radius, elevation } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.actionRow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          opacity: pressed ? 0.85 : 1,
        },
        elevation.sm,
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={{ flex: 1, color: colors.text, fontSize: 15, fontWeight: "600" }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  identity: { alignItems: "center", marginTop: 12 },
  avatar: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  memberChipText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  goPremium: { overflow: "hidden", marginTop: 12, borderRadius: 999 },
  goPremiumInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  goPremiumText: { color: "#221B10", fontWeight: "800", fontSize: 14 },
  name: { fontSize: 22, fontWeight: "800", marginTop: 14, letterSpacing: -0.3 },
  divider: { height: 1, marginVertical: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
})
