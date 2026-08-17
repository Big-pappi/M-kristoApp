import type { PropsWithChildren } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useTheme } from "../theme/useTheme"

type ScreenProps = PropsWithChildren<{
  scroll?: boolean
  padded?: boolean
}>

/**
 * Shared page frame: safe-area aware, themed background, optional
 * scrolling. Every tab screen should be wrapped in this.
 */
export function Screen({ children, scroll = true, padded = true }: ScreenProps) {
  const { colors, spacing } = useTheme()
  const Container = scroll ? ScrollView : View

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <Container
        style={styles.flex}
        contentContainerStyle={padded ? { padding: spacing.md, paddingBottom: spacing.xl } : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
