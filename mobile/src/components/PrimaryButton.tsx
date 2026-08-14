import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native"

import { useTheme } from "../theme/useTheme"

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: "solid" | "outline"
  style?: ViewStyle
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "solid",
  style,
}: PrimaryButtonProps) {
  const { colors, radius } = useTheme()
  const isSolid = variant === "solid"

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: isSolid ? colors.primary : "transparent",
          borderColor: colors.primary,
          borderRadius: radius.md,
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? colors.primaryForeground : colors.primary} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isSolid ? colors.primaryForeground : colors.primary },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  label: {
    fontWeight: "700",
    fontSize: 15,
  },
})
