import type { PropsWithChildren, ReactNode } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

import { useTheme } from "../theme/useTheme"

type ScreenProps = PropsWithChildren<{
  scroll?: boolean
  padded?: boolean
  /** Sticky element rendered above the scroll area (e.g. AppHeader). */
  header?: ReactNode
  /** Pinned to the bottom, above the tab bar (e.g. a CTA bar). */
  footer?: ReactNode
}>

/**
 * Shared page frame: safe-area aware, subtly graduated background, optional
 * scrolling, and slots for a sticky header/footer. Every screen uses this so
 * the notification bell and page chrome stay consistent app-wide.
 */
export function Screen({ children, scroll = true, padded = true, header, footer }: ScreenProps) {
  const { colors, spacing, gradients } = useTheme()
  const Container = scroll ? ScrollView : View

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.page}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {header}
        <Container
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            padded
              ? { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl, paddingTop: spacing.xs }
              : undefined
          }
        >
          {children}
        </Container>
        {footer}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
