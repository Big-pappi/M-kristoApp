import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

import { useTheme } from "../theme/useTheme"

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  /** solid = indigo, gold = gilded gradient (premium CTAs), outline, ghost. */
  variant?: "solid" | "gold" | "outline" | "ghost"
  size?: "md" | "sm"
  icon?: keyof typeof Ionicons.glyphMap
  style?: ViewStyle
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "solid",
  size = "md",
  icon,
  style,
}: PrimaryButtonProps) {
  const { colors, radius, gradients, elevation } = useTheme()
  const isGold = variant === "gold"
  const isSolid = variant === "solid"
  const isOutline = variant === "outline"

  const fg = isGold
    ? colors.accentForeground
    : isSolid
      ? colors.primaryForeground
      : colors.primary

  const padding = size === "sm" ? 10 : 15
  const inactive = disabled || loading

  const content = loading ? (
    <ActivityIndicator color={fg} />
  ) : (
    <View style={styles.inner}>
      {icon ? <Ionicons name={icon} size={size === "sm" ? 15 : 17} color={fg} /> : null}
      <Text style={[styles.label, { color: fg, fontSize: size === "sm" ? 14 : 15 }]}>{label}</Text>
    </View>
  )

  if (isGold) {
    return (
      <Pressable
        onPress={onPress}
        disabled={inactive}
        accessibilityRole="button"
        style={({ pressed }) => [
          { borderRadius: radius.md, opacity: inactive ? 0.6 : pressed ? 0.9 : 1 },
          elevation.sm,
          style,
        ]}
      >
        <LinearGradient
          colors={gradients.gild}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            { borderRadius: radius.md, paddingVertical: padding, borderColor: "transparent" },
          ]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isSolid
            ? colors.primary
            : isOutline
              ? "transparent"
              : colors.primarySoft,
          borderColor: isOutline ? colors.borderStrong : "transparent",
          borderRadius: radius.md,
          paddingVertical: padding,
          opacity: inactive ? 0.6 : pressed ? 0.9 : 1,
        },
        isSolid ? elevation.sm : null,
        style,
      ]}
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontWeight: "700" },
})
