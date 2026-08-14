import type { PropsWithChildren } from "react"
import { StyleSheet, View, type ViewStyle } from "react-native"

import { useTheme } from "../theme/useTheme"

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { colors, spacing, radius } = useTheme()
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: spacing.md,
          borderRadius: radius.md,
        },
        style,
      ]}
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
