import { StyleSheet, Text, View } from "react-native"

import { useTheme } from "../theme/useTheme"

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  const { colors, spacing } = useTheme()
  return (
    <View style={[styles.row, { marginBottom: spacing.sm }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {action ? <Text style={{ color: colors.primary, fontWeight: "600" }}>{action}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
})
