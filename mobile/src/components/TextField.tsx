import type { ComponentProps } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { useTheme } from "../theme/useTheme"

type TextFieldProps = ComponentProps<typeof TextInput> & {
  label?: string
}

export function TextField({ label, style, ...props }: TextFieldProps) {
  const { colors, spacing, radius } = useTheme()

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
          style,
        ]}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
})
