import type { PropsWithChildren } from "react"
import { StyleSheet, View, type ViewStyle } from "react-native"

import { useTheme } from "../theme/useTheme"

type CardVariant = "default" | "raised" | "muted" | "outline"

type CardProps = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[]
  variant?: CardVariant
}>

export function Card({ children, style, variant = "default" }: CardProps) {
  const { colors, spacing, radius, elevation } = useTheme()

  const variantStyle: ViewStyle =
    variant === "raised"
      ? { backgroundColor: colors.surfaceRaised, borderColor: colors.border, ...elevation.md }
      : variant === "muted"
        ? { backgroundColor: colors.surfaceMuted, borderColor: "transparent" }
        : variant === "outline"
          ? { backgroundColor: "transparent", borderColor: colors.border }
          : { backgroundColor: colors.surface, borderColor: colors.border, ...elevation.sm }

  return (
    <View
      style={[styles.card, { padding: spacing.md, borderRadius: radius.md }, variantStyle, style]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
})
