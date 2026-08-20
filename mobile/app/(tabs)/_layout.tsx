import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../src/theme/useTheme"

export default function TabsLayout() {
  const { t } = useTranslation(); const { colors } = useTheme()
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 64, paddingTop: 6, paddingBottom: 8 }, tabBarLabelStyle: { fontSize: 11, fontWeight: "700" }, tabBarItemStyle: { minHeight: 48 } }}><Tabs.Screen name="index" options={{ title: t("tabs.home"), tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} /><Tabs.Screen name="bible" options={{ title: t("tabs.bible"), tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} /> }} /><Tabs.Screen name="prayers" options={{ title: t("tabs.prayers"), tabBarIcon: ({ color, size }) => <Ionicons name="hand-left-outline" color={color} size={size} /> }} /><Tabs.Screen name="calendar" options={{ title: t("tabs.calendar"), tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} /> }} /><Tabs.Screen name="more" options={{ title: t("tabs.more"), tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal-circle-outline" color={color} size={size} /> }} /></Tabs>
}
