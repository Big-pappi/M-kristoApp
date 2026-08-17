import type { PropsWithChildren } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"

import { useTheme } from "../theme/useTheme"
import { usePremium } from "../subscription/usePremium"

type PremiumGateProps = PropsWithChildren<{
  /** When true the gate is inactive and children render normally. */
  unlocked?: boolean
  /** Height of the blurred preview area. */
  minHeight?: number
}>

/**
 * Wraps premium content. When the member is not subscribed the children are
 * rendered blurred (a real preview, not an empty box) with a gilded lock CTA
 * layered on top that routes to the subscription screen.
 */
export function PremiumGate({ children, unlocked, minHeight = 180 }: PremiumGateProps) {
  const { colors, radius, isDark, type } = useTheme()
  const { isPremium } = usePremium()
  const { t } = useTranslation()
  const router = useRouter()

  if (unlocked ?? isPremium) return <>{children}</>

  return (
    <View style={[styles.wrap, { borderRadius: radius.lg, minHeight }]}>
      <View pointerEvents="none" style={styles.preview}>
        {children}
      </View>

      <BlurView
        intensity={28}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={
          isDark
            ? ["rgba(15,12,34,0.35)", "rgba(15,12,34,0.82)"]
            : ["rgba(251,247,239,0.35)", "rgba(251,247,239,0.86)"]
        }
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <View
          style={[
            styles.lockCircle,
            { backgroundColor: colors.accentSoft, borderColor: colors.accent },
          ]}
        >
          <Ionicons name="lock-closed" size={22} color={colors.accent} />
        </View>
        <Text style={[type.heading, { color: colors.text, marginTop: 10 }]}>
          {t("premium.locked")}
        </Text>
        <Text
          style={[type.caption, { color: colors.textMuted, textAlign: "center", marginTop: 4 }]}
        >
          {t("premium.lockedBody")}
        </Text>
        <Pressable
          onPress={() => router.push("/subscription")}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cta, { borderRadius: radius.full, opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={["#E3BD6C", "#C99A3E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ctaInner, { borderRadius: radius.full }]}
          >
            <Ionicons name="sparkles" size={15} color="#221B10" />
            <Text style={styles.ctaText}>{t("premium.unlock")}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", position: "relative" },
  preview: { opacity: 0.85 },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  lockCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: { marginTop: 16, overflow: "hidden" },
  ctaInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  ctaText: { color: "#221B10", fontWeight: "800", fontSize: 14 },
})
