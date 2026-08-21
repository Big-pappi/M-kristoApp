import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { AppHeader } from "../../src/components/AppHeader"
import { Card } from "../../src/components/Card"
import { Screen } from "../../src/components/Screen"
import { useTheme } from "../../src/theme/useTheme"
const topics = ["All", "Devotionals", "Prayer", "Wisdom"]
export default function ExploreScreen() {
 const { colors, spacing, radius, type } = useTheme(); const router = useRouter(); const [selected, setSelected] = useState("All")
 return <Screen scroll header={<AppHeader eyebrow="Find something to carry" title="Explore" />}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}><>{topics.map((topic) => <Pressable key={topic} onPress={() => setSelected(topic)} style={[styles.filter, { backgroundColor: selected === topic ? colors.primary : colors.surface, borderColor: colors.border, borderRadius: radius.full }]}><Text style={[type.label, { color: selected === topic ? colors.primaryForeground : colors.text }]}>{topic}</Text></Pressable>)}</></ScrollView>
  <Text style={[type.title, { color: colors.text, marginTop: spacing.xl }]}>For this season</Text>
  <Card style={{ padding: 0, overflow: "hidden", marginTop: spacing.md }}><View style={[styles.feature, { backgroundColor: colors.accentSoft }]}><Ionicons name="leaf-outline" size={34} color={colors.accent} /><Text style={[type.title, { color: colors.text, marginTop: 22 }]}>A slower way to read</Text><Text style={[type.body, { color: colors.textMuted, marginTop: 8 }]}>Short reflections for ordinary days, rooted in Scripture.</Text><Pressable onPress={() => router.push("/devotion")} style={[styles.featureButton, { backgroundColor: colors.primary, borderRadius: 6 }]}><Text style={{ color: colors.primaryForeground, fontWeight: "800" }}>START READING</Text><Ionicons name="arrow-forward" size={17} color={colors.primaryForeground} /></Pressable></View></Card>
  <View style={[styles.sectionHead, { marginTop: spacing.xl }]}><Text style={[type.title, { color: colors.text }]}>Library</Text><Text style={[type.label, { color: colors.accent }]}>VIEW ALL</Text></View>
  {[{ icon: "library-outline" as const, title: "Bible Dictionary", detail: "Understand the words behind the Word", route: "/dictionary" }, { icon: "musical-notes-outline" as const, title: "Hymns", detail: "Songs for quiet and gathered moments", route: "/hymns" }, { icon: "bookmark-outline" as const, title: "Saved passages", detail: "Return to what spoke to you", route: "/favorites" }].map((item) => <Pressable key={item.title} onPress={() => router.push(item.route as never)} style={[styles.libraryRow, { borderBottomColor: colors.border }]}><View style={[styles.libraryIcon, { backgroundColor: colors.surfaceMuted, borderRadius: radius.sm }]}><Ionicons name={item.icon} size={20} color={colors.accent} /></View><View style={{ flex: 1 }}><Text style={[type.heading, { color: colors.text }]}>{item.title}</Text><Text style={[type.caption, { color: colors.textMuted, marginTop: 3 }]}>{item.detail}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textFaint} /></Pressable>)}
 </Screen>
}
const styles = StyleSheet.create({ filter: { paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1 }, feature: { padding: 20, minHeight: 238 }, featureButton: { marginTop: 22, paddingVertical: 13, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, libraryRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 76, borderBottomWidth: 1 }, libraryIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center" } })
