import { Stack, useRouter } from "expo-router"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { usePremium } from "../../src/subscription/usePremium"
import { useTheme } from "../../src/theme/useTheme"

const resources = [
  ["Books", "Read inside the app", "books.webp"],
  ["Devotionals", "A quiet practice for every day", "devotionals.webp"],
  ["Prayers", "Guided words for every season", "prayers.webp"],
  ["Hymns", "Songs for worship and reflection", "hymns.webp"],
  ["Courses", "Grow at your own pace", "courses.webp"],
  ["Verse Studio", "Create and save verse cards", "verse-studio.webp"],
  ["Community", "Share verses and reflections", "community.webp"],
] as const

export default function ExploreScreen() {
  const { colors, spacing, radius, type } = useTheme()
  const router = useRouter()
  const { isPremium } = usePremium()
  return <Screen scroll header={<><Stack.Screen options={{ headerShown: false }} /><AppHeader title="Explore" /></>}>
    <Text style={[type.display, { color: colors.text, marginTop: spacing.md }]}>Explore</Text>
    <Text style={[type.body, { color: colors.textMuted, marginTop: 6 }]}>Resources to help you read, pray, and grow.</Text>
    <Pressable onPress={() => router.push("/subscription")} style={[styles.membership, { backgroundColor: colors.primary, borderRadius: radius.lg, marginTop: spacing.lg }]}>
      <Text style={[type.overline, { color: colors.accent }]}>MEMBERSHIP</Text><Text style={[type.heading, { color: colors.primaryForeground, marginTop: 6 }]}>Go deeper in your faith</Text><Text style={[type.body, { color: colors.primaryForeground, opacity: 0.72, marginTop: 4 }]}>Unlock every book, course, prayer guide, and studio tool.</Text><Text style={[type.label, { color: colors.accent, marginTop: 16 }]}>VIEW PLANS  →</Text>
    </Pressable>
    <Text style={[type.overline, { color: colors.text, marginTop: spacing.xl }]}>LIBRARY</Text>
    <View style={styles.grid}>{resources.map(([title, body, file]) => <Pressable key={title} onPress={() => title === "Community" ? router.push("/community") : !isPremium && router.push("/subscription")} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}>
      <Image source={{ uri: `/images/explore/${file}` }} style={[styles.image, { backgroundColor: colors.surfaceMuted, borderRadius: radius.sm }]} accessibilityLabel={`${title} resource cover`} />
      <View style={styles.cardBody}><Text style={[type.heading, { color: colors.text }]}>{title}</Text><Text style={[type.caption, { color: colors.textMuted, marginTop: 4 }]}>{body}</Text><Text style={[type.overline, { color: isPremium ? colors.success : colors.accent, marginTop: 14 }]}>{isPremium ? "OPEN" : "PREMIUM  ·  LOCKED"}</Text></View>
    </Pressable>)}</View>
    <Text style={[type.caption, { color: colors.textFaint, textAlign: "center", marginTop: spacing.lg }]}>Premium reading stays inside the application.</Text>
  </Screen>
}
const styles = StyleSheet.create({ membership: { padding: 22 }, grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, marginTop: 12 }, card: { width: "49%", overflow: "hidden", borderWidth: 1 }, image: { width: "100%", aspectRatio: 1.35 }, cardBody: { padding: 12, minHeight: 108 } })
