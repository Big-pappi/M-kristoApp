import { useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import * as MediaLibrary from "expo-media-library"
import * as Sharing from "expo-sharing"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import ViewShot, { captureRef } from "react-native-view-shot"

import { AppHeader } from "../src/components/AppHeader"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"
import { usePremium } from "../src/subscription/usePremium"
import {
  VERSE_BACKGROUNDS,
  VERSE_FONTS,
  type VerseBackground,
  type VerseFont,
} from "../src/theme/backgrounds"

/** Map the abstract font family to a concrete platform font. */
function fontFamily(font: VerseFont) {
  if (font.family === "serif") return Platform.select({ ios: "Georgia", default: "serif" })
  if (font.family === "monospace") return Platform.select({ ios: "Courier New", default: "monospace" })
  return Platform.select({ ios: "System", default: "sans-serif" })
}

export default function VerseStudioScreen() {
  const { colors, spacing, radius, type, gradients } = useTheme()
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { isPremium } = usePremium()
  const isEnglish = i18n.language === "en"

  const params = useLocalSearchParams<{ text?: string; reference?: string }>()
  const verseText =
    params.text ??
    (isEnglish
      ? "The Lord is my shepherd; I shall not want."
      : "Bwana ndiye mchungaji wangu, sitapungukiwa na kitu.")
  const reference = params.reference ?? (isEnglish ? "Psalm 23:1" : "Zaburi 23:1")

  const [bgId, setBgId] = useState<string>(VERSE_BACKGROUNDS[0].id)
  const [fontId, setFontId] = useState<string>(VERSE_FONTS[0].id)
  const [busy, setBusy] = useState<"save" | "share" | null>(null)

  const shotRef = useRef<ViewShot>(null)
  const background = VERSE_BACKGROUNDS.find((b) => b.id === bgId) ?? VERSE_BACKGROUNDS[0]
  const font = VERSE_FONTS.find((f) => f.id === fontId) ?? VERSE_FONTS[0]

  async function capture() {
    return captureRef(shotRef, { format: "png", quality: 1 })
  }

  async function handleSave() {
    try {
      setBusy("save")
      const uri = await capture()
      const perm = await MediaLibrary.requestPermissionsAsync()
      if (!perm.granted) {
        Alert.alert(t("verseStudio.title"), t("verseStudio.permissionNeeded"))
        return
      }
      await MediaLibrary.saveToLibraryAsync(uri)
      Alert.alert(t("verseStudio.title"), t("verseStudio.saved"))
    } catch {
      Alert.alert(t("verseStudio.title"), t("verseStudio.saveFailed"))
    } finally {
      setBusy(null)
    }
  }

  async function handleShare() {
    try {
      setBusy("share")
      const uri = await capture()
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri)
      }
    } catch {
      Alert.alert(t("verseStudio.title"), t("verseStudio.saveFailed"))
    } finally {
      setBusy(null)
    }
  }

  function selectBackground(b: VerseBackground) {
    if (b.premium && !isPremium) {
      router.push("/subscription")
      return
    }
    setBgId(b.id)
  }

  return (
    <Screen
      header={
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <AppHeader back eyebrow={t("verseStudio.title")} title={t("verseStudio.subtitle")} />
        </>
      }
    >
      {/* Preview canvas — this exact view is what gets captured. */}
      <View style={[styles.canvasWrap, { borderRadius: radius.xl }]}>
        <ViewShot ref={shotRef} style={styles.canvas}>
          {background.kind === "photo" ? (
            <Image source={background.source} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <LinearGradient colors={background.stops} style={StyleSheet.absoluteFill} />
          )}
          <LinearGradient
            colors={[
              `rgba(8,6,24,${background.scrim * 0.5})`,
              `rgba(8,6,24,${Math.min(background.scrim + 0.25, 0.95)})`,
            ]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.canvasContent}>
            <Ionicons name="book" size={22} color="rgba(255,255,255,0.9)" />
            <Text
              style={[
                styles.verse,
                {
                  fontFamily: fontFamily(font),
                  fontStyle: font.italic ? "italic" : "normal",
                  fontWeight: font.weight,
                  letterSpacing: font.letterSpacing ?? 0,
                },
              ]}
            >
              {`\u201C${verseText}\u201D`}
            </Text>
            <View style={styles.refRow}>
              <View style={styles.refLine} />
              <Text style={styles.reference}>{reference}</Text>
              <View style={styles.refLine} />
            </View>
          </View>

          {/* Watermark */}
          <View style={styles.watermark}>
            <View style={styles.wmMark}>
              <Text style={styles.wmMarkText}>M</Text>
            </View>
            <Text style={styles.wmText}>{t("verseStudio.watermark")}</Text>
          </View>
        </ViewShot>
      </View>

      {/* Actions */}
      <View style={[styles.actions, { marginTop: spacing.md }]}>
        <Pressable
          onPress={handleShare}
          disabled={busy !== null}
          accessibilityRole="button"
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={gradients.gild}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.actionInner, { borderRadius: radius.md }]}
          >
            {busy === "share" ? (
              <ActivityIndicator color="#221B10" />
            ) : (
              <>
                <Ionicons name="share-social" size={17} color="#221B10" />
                <Text style={styles.goldText}>{t("verseStudio.share")}</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={busy !== null}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.actionBtn,
            styles.saveBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderStrong,
              borderRadius: radius.md,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          {busy === "save" ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="download-outline" size={17} color={colors.text} />
              <Text style={[styles.saveText, { color: colors.text }]}>{t("verseStudio.save")}</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Background picker */}
      <Text style={[type.overline, { color: colors.textFaint, marginTop: spacing.lg }]}>
        {t("verseStudio.background")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: spacing.sm, paddingRight: spacing.md }}
      >
        {VERSE_BACKGROUNDS.map((b) => {
          const active = b.id === bgId
          const locked = b.premium && !isPremium
          return (
            <Pressable
              key={b.id}
              onPress={() => selectBackground(b)}
              accessibilityRole="button"
              accessibilityLabel={b.label}
              style={[
                styles.swatch,
                {
                  borderRadius: radius.md,
                  borderColor: active ? colors.accent : colors.border,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              {b.kind === "photo" ? (
                <Image source={b.source} style={styles.swatchImg} resizeMode="cover" />
              ) : (
                <LinearGradient colors={b.stops} style={styles.swatchImg} />
              )}
              {locked ? (
                <View style={styles.swatchLock}>
                  <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
                </View>
              ) : null}
              <View style={styles.swatchLabelWrap}>
                <Text style={styles.swatchLabel} numberOfLines={1}>
                  {b.label}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Style picker */}
      <Text style={[type.overline, { color: colors.textFaint, marginTop: spacing.sm }]}>
        {t("verseStudio.style")}
      </Text>
      <View style={[styles.fontRow, { marginTop: spacing.sm }]}>
        {VERSE_FONTS.map((f) => {
          const active = f.id === fontId
          return (
            <Pressable
              key={f.id}
              onPress={() => setFontId(f.id)}
              accessibilityRole="button"
              style={[
                styles.fontChip,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? colors.primaryForeground : colors.text,
                  fontFamily: fontFamily(f),
                  fontStyle: f.italic ? "italic" : "normal",
                  fontWeight: "700",
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  canvasWrap: { overflow: "hidden", marginTop: 8 },
  canvas: {
    width: "100%",
    aspectRatio: 4 / 5,
    justifyContent: "center",
  },
  canvasContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 18,
  },
  verse: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  refRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  refLine: { width: 24, height: 1, backgroundColor: "rgba(255,255,255,0.6)" },
  reference: {
    color: "#F4D68A",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  watermark: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wmMark: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  wmMarkText: { color: "#F4D68A", fontWeight: "800", fontSize: 12 },
  wmText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, overflow: "hidden" },
  actionInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  goldText: { color: "#221B10", fontWeight: "800", fontSize: 15 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 14,
  },
  saveText: { fontWeight: "700", fontSize: 15 },
  swatch: { width: 76, height: 96, overflow: "hidden", position: "relative" },
  swatchImg: { width: "100%", height: "100%" },
  swatchLock: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(8,6,24,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  swatchLabelWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(8,6,24,0.55)",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  swatchLabel: { color: "#FFFFFF", fontSize: 10, fontWeight: "700", textAlign: "center" },
  fontRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fontChip: { paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1 },
})
