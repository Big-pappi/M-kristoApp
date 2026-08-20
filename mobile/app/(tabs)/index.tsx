import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native"
import { getVerseOfTheDay, type VerseOfDay } from "../../src/api/bible"
import { AppHeader } from "../../src/components/AppHeader"
import { Screen } from "../../src/components/Screen"
import { useProfile } from "../../src/hooks/useProfile"
import { usePremium } from "../../src/subscription/usePremium"
import { useTheme } from "../../src/theme/useTheme"

export default function HomeScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing, radius, type } = useTheme()
  const router = useRouter()
  const { firstName } = useProfile()
  const { isPremium } = usePremium()
  const [verse, setVerse] = useState<VerseOfDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const isEnglish = i18n.language === "en"

  useEffect(() => {
    let mounted = true
    getVerseOfTheDay().then((value) => mounted && setVerse(value)).catch(() => mounted && setError(true)).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const verseText = verse && (isEnglish && verse.text_en ? verse.text_en : verse.text_sw)
  const verseRef = verse && (isEnglish && verse.reference_en ? verse.reference_en : verse.reference_sw)

  return (
    <Screen header={<AppHeader eyebrow={t("home.greeting")} title={firstName ?? t("common.appName")} />}>
      <View style={styles.intro}>
        <Text style={[type.display, { color: colors.text }]}>{isEnglish ? "A little room for faith." : "Nafasi kidogo ya imani."}</Text>
        <Text style={[type.body, { color: colors.textMuted, marginTop: spacing.sm }]}>{isEnglish ? "Read, pray, and carry something good into today." : "Soma, omba, na beba jambo jema katika siku yako."}</Text>
      </View>

      <Text style={[type.overline, { color: colors.accent, marginTop: spacing.xl, marginBottom: spacing.sm }]}>{t("home.verseOfDay")}</Text>
      <ImageBackground source={require("../../assets/backgrounds/mountain-sunrise.png")} style={[styles.verse, { borderRadius: radius.xl }]} imageStyle={{ borderRadius: radius.xl }}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, borderRadius: radius.xl }]} />
        <View style={styles.verseContent}>
          {loading ? <ActivityIndicator color={colors.accent} /> : error || !verse ? <Text style={[type.body, { color: colors.onImage }]}>{t("common.empty")}</Text> : <>
            <Text style={[type.scripture, { color: colors.onImage }]}>{`“${verseText}”`}</Text>
            <Text style={[type.label, { color: colors.accent, marginTop: spacing.md }]}>{verseRef}</Text>
            <Pressable onPress={() => router.push({ pathname: "/verse-studio", params: { text: verseText ?? "", reference: verseRef ?? "" } })} style={[styles.verseCta, { backgroundColor: colors.accent, borderRadius: radius.full }]}>
              <Ionicons name="color-wand" size={16} color={colors.accentForeground} />
              <Text style={{ color: colors.accentForeground, fontWeight: "800" }}>{t("home.share")}</Text>
            </Pressable>
          </>}
        </View>
      </ImageBackground>

      <Pressable onPress={() => router.push("/bible")} style={[styles.readRow, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, marginTop: spacing.md }]}>
        <View style={[styles.rowIcon, { backgroundColor: colors.primarySoft, borderRadius: radius.full }]}><Ionicons name="book" size={20} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Text style={[type.heading, { color: colors.text }]}>{t("home.exploreBible")}</Text><Text style={[type.caption, { color: colors.textMuted, marginTop: 3 }]}>{isEnglish ? "Old & New Testament · 66 books" : "Agano la Kale na Jipya · vitabu 66"}</Text></View>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </Pressable>

      {!isPremium && <Pressable onPress={() => router.push("/subscription")} style={[styles.membership, { backgroundColor: colors.primary, borderRadius: radius.lg, marginTop: spacing.md }]}><View style={{ flex: 1 }}><Text style={[type.overline, { color: colors.accent }]}>{t("premium.badge")}</Text><Text style={[type.heading, { color: colors.primaryForeground, marginTop: 3 }]}>{isEnglish ? "Make more room for faith" : "Tengeneza nafasi zaidi ya imani"}</Text></View><Ionicons name="arrow-forward-circle" size={28} color={colors.accent} /></Pressable>}

      <View style={[styles.sectionHeading, { marginTop: spacing.xl }]}><Text style={[type.title, { color: colors.text }]}>{t("home.quickLinks")}</Text><Text style={[type.caption, { color: colors.accent }]}>{isEnglish ? "For today" : "Kwa leo"}</Text></View>
      <View style={[styles.linkList, { borderTopColor: colors.border }]}>
        <QuickLink icon="hand-left-outline" label={t("tabs.prayers")} detail={isEnglish ? "A quiet moment to begin" : "Muda wa utulivu kuanza"} onPress={() => router.push("/prayers")} colors={colors} />
        <QuickLink icon="sparkles-outline" label={t("verseStudio.title")} detail={isEnglish ? "Make the words yours" : "Fanya maneno yawe yako"} onPress={() => router.push("/verse-studio")} colors={colors} />
      </View>
    </Screen>
  )
}

function QuickLink({ icon, label, detail, onPress, colors }: { icon: keyof typeof Ionicons.glyphMap; label: string; detail: string; onPress: () => void; colors: ReturnType<typeof useTheme>["colors"] }) {
  return <Pressable onPress={onPress} style={styles.link}><View style={[styles.linkIcon, { backgroundColor: colors.surfaceMuted, borderRadius: radius.full }]}><Ionicons name={icon} size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>{label}</Text><Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{detail}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textFaint} /></Pressable>
}

const radius = { full: 999 }
const styles = StyleSheet.create({ intro: { maxWidth: 290 }, verse: { minHeight: 270, overflow: "hidden" }, verseContent: { flex: 1, justifyContent: "flex-end", padding: 20 }, verseCta: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, marginTop: 18 }, readRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 15, borderWidth: 1 }, rowIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }, membership: { flexDirection: "row", alignItems: "center", padding: 17 }, sectionHeading: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }, linkList: { borderTopWidth: 1, marginTop: 10 }, link: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 70, borderBottomWidth: 1, borderBottomColor: "rgba(128,118,100,0.28)" }, linkIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center" }, })
