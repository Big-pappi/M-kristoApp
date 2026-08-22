import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { AppHeader } from "../src/components/AppHeader"
import { Screen } from "../src/components/Screen"
import { useProfile } from "../src/hooks/useProfile"
import { usePremium } from "../src/subscription/usePremium"
import { logout } from "../src/api/auth"
import { setLanguage } from "../src/i18n"
import { setThemeMode, useTheme } from "../src/theme/useTheme"

export default function ProfileScreen() {
  const { i18n } = useTranslation(); const { colors, spacing, radius, type, isDark } = useTheme(); const router = useRouter(); const { user } = useProfile(); const { isPremium } = usePremium(); const [notifications, setNotifications] = React.useState(true)
  return <Screen scroll header={<><Stack.Screen options={{ headerShown: false }} /><AppHeader title="Profile" /></>}>
    <View style={[styles.account, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}><Text style={[type.overline, { color: colors.accent }]}>ACCOUNT</Text><Text style={[type.title, { color: colors.text, marginTop: 10 }]}>{user?.full_name || "Your profile"}</Text><Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>{user?.email || user?.phone_number || "Personal settings and preferences"}</Text>{isPremium && <Text style={[type.overline, { color: colors.success, marginTop: 12 }]}>MEMBERSHIP ACTIVE</Text>}</View>
    {!isPremium && <Pressable onPress={() => router.push("/subscription")} style={[styles.upgrade, { backgroundColor: colors.accent, borderRadius: radius.md, marginTop: spacing.md }]}><Text style={[type.heading, { color: colors.accentForeground }]}>Unlock the full library</Text><Ionicons name="arrow-forward" size={19} color={colors.accentForeground} /></Pressable>}
    <Text style={[type.overline, { color: colors.accent, marginTop: spacing.xl }]}>PREFERENCES</Text><View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.sm }]}><Row icon={i18n.language === "en" ? "text-outline" : "language-outline"} label="Language" value={i18n.language === "en" ? "English" : "Swahili"} colors={colors} onPress={() => setLanguage(i18n.language === "en" ? "sw" : "en")} /><Row icon="notifications-outline" label="Notifications" colors={colors} right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.success, false: colors.border }} />} /><Row icon={isDark ? "sunny-outline" : "moon-outline"} label="Appearance" value={isDark ? "Dark" : "Light"} colors={colors} onPress={() => setThemeMode(isDark ? "light" : "dark")} /></View>
    <Text style={[type.overline, { color: colors.accent, marginTop: spacing.xl }]}>ABOUT</Text><View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.sm }]}><Row icon="card-outline" label="Subscription" colors={colors} onPress={() => router.push("/subscription")} /><Row icon="information-circle-outline" label="About" value="Version 1.0.0" colors={colors} />{user ? <Row icon="log-out-outline" label="Log out" colors={colors} onPress={async () => { await logout(); Alert.alert("Log out", "You have been signed out.") }} /> : <Row icon="log-in-outline" label="Sign in" colors={colors} onPress={() => router.push("/auth/login")} />}</View>
  </Screen>
}
function Row({ icon, label, value, right, colors, onPress }: any) { return <Pressable onPress={onPress} style={styles.row}><View style={[styles.rowIcon, { backgroundColor: colors.surfaceMuted, borderRadius: 8 }]}><Ionicons name={icon} size={18} color={colors.accent} /></View><Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>{value && <Text style={{ color: colors.textMuted, fontSize: 12 }}>{value}</Text>}{right}</Pressable> }
const styles = StyleSheet.create({ account: { padding: 18, borderWidth: 1 }, upgrade: { padding: 17, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, group: { borderWidth: 1, overflow: "hidden" }, row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "rgba(128,128,128,0.18)" }, rowIcon: { width: 32, height: 32, alignItems: "center", justifyContent: "center" }, rowLabel: { flex: 1, fontSize: 15, fontWeight: "600" } })
