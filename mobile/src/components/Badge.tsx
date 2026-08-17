import { StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useTheme } from "../theme/useTheme"

type BadgeProps = {
  label: string
  /** gold = gilded premium chip, muted = neutral, tint = primary soft. */
  variant?: "gold" | "muted" | "tint"
  icon?: keyof typeof Ionicons.glyphMap
}

export function Badge({ label, variant = "muted", icon }: BadgeProps) {
  const { colors, radius } = useTheme()

  const bg =
    variant === "gold" ? colors.accentSoft : variant === "tint" ? colors.primarySoft : colors.surfaceMuted
  const fg =
    variant === "gold" ? colors.accent : variant === "tint" ? colors.primary : colors.textMuted

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderRadius: radius.full }]}>
      {icon ? <Ionicons name={icon} size={12} color={fg} /> : null}
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
})
