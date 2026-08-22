import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { AppHeader } from "../src/components/AppHeader"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

const KEY = "@mkristo/community-posts"
type Post = { id: string; name: string; text: string; reference?: string; likes: number; replies: number }
const starter: Post[] = [
  { id: "1", name: "Amani K.", text: "Neno la leo limenigusa. Mungu anatuita tusimame katika tumaini.", reference: "Warumi 8:28", likes: 42, replies: 8 },
  { id: "2", name: "Neema M.", text: "Ninawaombea wote wanaosoma sura hii leo.", reference: "Zaburi 23", likes: 31, replies: 5 },
]

export default function CommunityScreen() {
  const { i18n } = useTranslation()
  const { colors, spacing, radius, type, elevation } = useTheme()
  const params = useLocalSearchParams<{ text?: string; reference?: string }>()
  const isEnglish = i18n.language === "en"
  const [posts, setPosts] = useState<Post[]>(starter)
  const [draft, setDraft] = useState("")

  useEffect(() => { AsyncStorage.getItem(KEY).then((value) => value && setPosts(JSON.parse(value))) }, [])
  async function publish() {
    const text = draft.trim() || params.text?.trim()
    if (!text) return
    const next = [{ id: Date.now().toString(), name: isEnglish ? "You" : "Wewe", text, reference: params.reference, likes: 0, replies: 0 }, ...posts]
    setPosts(next); setDraft(""); await AsyncStorage.setItem(KEY, JSON.stringify(next))
  }
  return <Screen header={<AppHeader title={isEnglish ? "Community" : "Jamii"} />}>
    <View style={[styles.hero, { backgroundColor: colors.primary, borderRadius: radius.xl }, elevation.md]}>
      <View style={styles.heroTop}><View style={[styles.liveDot, { backgroundColor: colors.accent }]} /><Text style={[type.overline, { color: colors.primaryForeground }]}>{isEnglish ? "READ TOGETHER" : "TUSOME PAMOJA"}</Text></View>
      <Text style={[type.display, { color: colors.primaryForeground, marginTop: spacing.sm }]}>{isEnglish ? "A living Scripture circle." : "Mduara hai wa Neno."}</Text>
      <Text style={[type.body, { color: colors.primaryMuted, marginTop: spacing.sm }]}>{isEnglish ? "Encourage one another as you read." : "Tiana moyo mnaposoma pamoja."}</Text>
    </View>
    <View style={[styles.composer, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, marginTop: spacing.lg }]}>
      <TextInput value={draft} onChangeText={setDraft} placeholder={isEnglish ? "Share a thought or verse..." : "Shiriki wazo au kifungu..."} placeholderTextColor={colors.textMuted} multiline style={[type.body, styles.input, { color: colors.text }]} />
      <Pressable onPress={publish} style={[styles.publish, { backgroundColor: colors.accent, borderRadius: radius.full }]}><Ionicons name="arrow-up" size={18} color={colors.accentForeground} /></Pressable>
    </View>
    <View style={{ gap: spacing.md, marginTop: spacing.xl }}>{posts.map((post) => <View key={post.id} style={[styles.post, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
      <View style={styles.postHead}><View style={{ flex: 1 }}><Text style={[type.heading, { color: colors.text }]}>{post.name}</Text><Text style={[type.caption, { color: colors.textMuted }]}>{isEnglish ? "Reading with the community" : "Anasoma na jamii"}</Text></View><Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} /></View>
      <Text style={[type.body, { color: colors.text, marginTop: spacing.md }]}>{post.text}</Text>{post.reference && <View style={[styles.reference, { backgroundColor: colors.surfaceMuted, borderRadius: radius.sm }]}><Ionicons name="book-outline" size={16} color={colors.accent} /><Text style={[type.label, { color: colors.accent }]}>{post.reference}</Text></View>}
      <View style={[styles.postActions, { borderTopColor: colors.border }]}><Pressable style={styles.action}><Ionicons name="heart-outline" size={19} color={colors.textMuted} /><Text style={[type.caption, { color: colors.textMuted }]}>{post.likes}</Text></Pressable><Pressable style={styles.action}><Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} /><Text style={[type.caption, { color: colors.textMuted }]}>{post.replies}</Text></Pressable><Pressable style={[styles.action, { marginLeft: "auto" as const }]}><Ionicons name="share-outline" size={19} color={colors.textMuted} /></Pressable></View>
    </View>)}</View>
  </Screen>
}
const styles = StyleSheet.create({ hero: { padding: 22 }, heroTop: { flexDirection: "row", alignItems: "center", gap: 8 }, liveDot: { width: 8, height: 8, borderRadius: 4 }, composer: { minHeight: 104, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "flex-end", gap: 10 }, input: { flex: 1, minHeight: 60, padding: 0 }, publish: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }, post: { padding: 16, borderWidth: 1 }, postHead: { flexDirection: "row", alignItems: "center", gap: 10 }, avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" }, reference: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, marginTop: 14, alignSelf: "flex-start" }, postActions: { flexDirection: "row", alignItems: "center", gap: 22, borderTopWidth: 1, marginTop: 16, paddingTop: 13 }, action: { flexDirection: "row", alignItems: "center", gap: 6 } })
