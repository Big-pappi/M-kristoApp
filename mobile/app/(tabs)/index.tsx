import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { getVerseOfTheDay, type VerseOfDay } from "../../src/api/bible"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { useProfile } from "../../src/hooks/useProfile"
import { useTheme } from "../../src/theme/useTheme"

export default function TodayScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type } = useTheme()
  const router = useRouter()
  const { firstName } = useProfile()
  const [verse, setVerse] = useState<VerseOfDay | null>(null)
  const [loading, setLoading] = useState(true)
  const isEnglish = i18n.language === "en"
  useEffect(() => { getVerseOfTheDay().then(setVerse).finally(() => setLoading(false)) }, [])
  const text = verse && (isEnglish && verse.text_en ? verse.text_en : verse.text_sw)
  const reference = verse && (isEnglish && verse.reference_en ? verse.reference_en : verse.reference_sw)
  const tasks = [{ icon: "book-outline" as const, label: isEnglish ? "Read today’s passage" : "Soma kifungu cha leo", done: true }, { icon: "hand-left-outline" as const, label: isEnglish ? "Take a quiet minute to pray" : "Tenga dakika ya kuomba", done: false }, { icon: "create-outline" as const, label: isEnglish ? "Write a reflection" : "Andika tafakari", done: false }]
  return <Screen scroll header={<AppHeader eyebrow={isEnglish ? "A quiet start" : "Mwanzo wa utulivu"} title={firstName ? `Good morning, ${firstName}` : t("tabs.today")} />}>
    <View style={{ gap: spacing.sm }}><Text style={[type.overline, { color: colors.accent }]}>{t("home.verseOfDay")}</Text><Text style={[type.body, { color: colors.textMuted }]}>A verse chosen for your day.</Text></View>
    <View style={[styles.verseCard, { backgroundColor: colors.primary, borderRadius: radius.lg, marginTop: spacing.md }]}>
      <View style={styles.verseTop}><Ionicons name="book-outline" size={18} color={colors.accent} /><Text style={[type.label, { color: colors.accent }]}>WORD FOR TODAY</Text></View>
      {loading ? <ActivityIndicator color={colors.accent} style={{ marginVertical: 58 }} /> : <><Text style={[type.scripture, styles.verseText, { color: colors.primaryForeground }]}>{text ? `“${text}”` : t("common.empty")}</Text><Text style={[type.label, { color: colors.accent, marginTop: spacing.md }]}>{reference}</Text><View style={styles.actions}><Pressable onPress={() => router.push({ pathname: "/bible/[bookId]", params: { bookId: "1" } })} style={[styles.action, { backgroundColor: colors.primaryForeground }]}><Text style={{ color: colors.primary, fontWeight: "800" }}>READ IN BIBLE</Text></Pressable><Pressable onPress={() => router.push({ pathname: "/verse-studio", params: { text: text ?? "", reference: reference ?? "" } })} style={[styles.iconAction, { borderColor: colors.primaryMuted }]}><Ionicons name="share-outline" size={19} color={colors.primaryForeground} /></Pressable></View></>}
    </View>
    <View style={[styles.section, { marginTop: spacing.xl }]}><View style={styles.sectionHeader}><Text style={[type.title, { color: colors.text }]}>Your rhythm</Text><Pressable onPress={() => router.push("/calendar")}><Text style={[type.label, { color: colors.accent }]}>JOURNAL</Text></Pressable></View><Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>Small practices make room for a steady faith.</Text><View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.md }]}>{tasks.map((task) => <View key={task.label} style={styles.task}><View style={[styles.taskIcon, { backgroundColor: task.done ? colors.success : colors.surfaceMuted }]}><Ionicons name={task.done ? "checkmark" : task.icon} size={17} color={task.done ? colors.primaryForeground : colors.primary} /></View><Text style={[type.body, { color: colors.text, flex: 1 }]}>{task.label}</Text><Ionicons name="chevron-forward" size={16} color={colors.textFaint} /></View>)}</View></View>
    <Pressable onPress={() => router.push("/bible")} style={[styles.bibleRow, { borderColor: colors.border, marginTop: spacing.md }]}><Ionicons name="book" size={20} color={colors.accent} /><Text style={[type.heading, { color: colors.text, flex: 1 }]}>Continue reading</Text><Ionicons name="arrow-forward" size={19} color={colors.accent} /></Pressable>
  </Screen>
}
const styles = StyleSheet.create({ verseCard: { padding: 20 }, verseTop: { flexDirection: "row", alignItems: "center", gap: 9 }, verseText: { marginTop: 34 }, actions: { flexDirection: "row", gap: 9, marginTop: 24 }, action: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 6 }, iconAction: { width: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 6 }, sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, section: {}, taskCard: { borderWidth: 1, paddingHorizontal: 14 }, task: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "rgba(128,118,100,0.2)" }, taskIcon: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" }, bibleRow: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 18 } })
