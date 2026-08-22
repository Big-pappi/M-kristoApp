import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { useTheme } from "../../src/theme/useTheme"

export default function TabsLayout() {
  const { t, i18n } = useTranslation()
  const { colors, radius } = useTheme()
  const isEnglish = i18n.language === "en"
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: [styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }], tabBarLabelStyle: styles.label, tabBarItemStyle: styles.item, tabBarIcon: ({ color, focused }) => { const icons: Record<string, keyof typeof Ionicons.glyphMap> = { index: focused ? "sunny" : "sunny-outline", bible: focused ? "book" : "book-outline", explore: focused ? "compass" : "compass-outline", calendar: focused ? "heart" : "heart-outline", profile: focused ? "person" : "person-outline" }; return <View style={[styles.icon, focused && { backgroundColor: colors.accentSoft, borderRadius: radius.full }]}><Ionicons name={icons[route.name] ?? "ellipse-outline"} color={color} size={19} /></View> } })}>
    <Tabs.Screen name="index" options={{ title: t("tabs.today") }} />
    <Tabs.Screen name="explore" options={{ title: t("tabs.explore") }} />
    <Tabs.Screen name="calendar" options={{ title: t("tabs.journal") }} />
    <Tabs.Screen name="bible" options={{ title: t("tabs.bible") }} />
    <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    <Tabs.Screen name="prayers" options={{ href: null }} />
    <Tabs.Screen name="more" options={{ href: null }} />
  </Tabs>
}
const styles = StyleSheet.create({ bar: { position: "absolute", left: 12, right: 12, bottom: 10, height: 70, paddingTop: 7, paddingBottom: 7, borderWidth: 1, borderRadius: 28, elevation: 10, shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 7 } }, item: { minHeight: 52 }, icon: { minWidth: 34, minHeight: 28, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.1 } })
