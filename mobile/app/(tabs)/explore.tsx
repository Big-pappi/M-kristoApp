import { Ionicons } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { usePremium } from "../../src/subscription/usePremium"
import { useTheme } from "../../src/theme/useTheme"

const items = [
  ["Books", "Guided Christian books", "book-outline"], ["Devotionals", "Daily paths for deeper faith", "sunny-outline"], ["Prayers", "Prayers for every season", "hand-left-outline"], ["Hymns", "Songs of worship", "musical-notes-outline"], ["Courses", "Learn at your own pace", "school-outline"], ["Verse Studio", "Create beautiful verse cards", "color-palette-outline"],
] as const
export default function ExploreScreen() {
  const { colors, spacing, radius, type } = useTheme(); const router = useRouter(); const { isPremium } = usePremium()
  return <Screen scroll header={<><Stack.Screen options={{ headerShown: false }} /><AppHeader title="Explore" /></>}>
    <View style={[styles.hero, { backgroundColor: colors.primary, borderRadius: radius.lg }]}><Text style={[type.overline, { color: colors.accent }]}>GO DEEPER</Text><Text style={[type.display, { color: colors.primaryForeground, marginTop: 8 }]}>Resources for the road.</Text><Text style={[type.body, { color: colors.primaryForeground, opacity: .72, marginTop: 8 }]}>Books, prayer guides, courses, and worship — kept inside the app.</Text><Pressable onPress={() => router.push("/subscription")} style={[styles.button, { backgroundColor: colors.accent, borderRadius: radius.full }]}><Text style={[type.label, { color: colors.accentForeground }]}>View membership</Text></Pressable></View>
    <Text style={[type.overline, { color: colors.accent, marginTop: spacing.xl }]}>LIBRARY</Text>
    <View style={styles.grid}>{items.map(([title, body, icon]) => <Pressable key={title} onPress={() => !isPremium && router.push("/subscription")} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}><View style={[styles.icon, { backgroundColor: colors.surfaceMuted, borderRadius: radius.sm }]}><Ionicons name={icon} size={21} color={colors.accent} /></View><Text style={[type.heading, { color: colors.text, marginTop: 14 }]}>{title}</Text><Text style={[type.caption, { color: colors.textMuted, marginTop: 5 }]}>{body}</Text><View style={styles.bottom}><Text style={[type.overline, { color: isPremium ? colors.success : colors.accent }]}>{isPremium ? "OPEN" : "PREMIUM"}</Text><Ionicons name={isPremium ? "arrow-forward" : "lock-closed-outline"} size={16} color={colors.textMuted} /></View></Pressable>)}</View>
    <Text style={[type.caption, { color: colors.textFaint, textAlign: "center", marginTop: spacing.lg }]}>Premium reading stays inside the application.</Text>
  </Screen>
}
const styles = StyleSheet.create({ hero: { padding: 22 }, button: { alignSelf: "flex-start", paddingHorizontal: 18, paddingVertical: 12, marginTop: 20 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 }, card: { width: "48%", minHeight: 166, padding: 15, borderWidth: 1 }, icon: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }, bottom: { marginTop: "auto", paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" } })
