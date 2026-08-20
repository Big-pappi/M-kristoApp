import type { PropsWithChildren, ReactNode } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useTheme } from "../theme/useTheme"

type ScreenProps = PropsWithChildren<{
  scroll?: boolean
  padded?: boolean
  header?: ReactNode
  footer?: ReactNode
}>

export function Screen({ children, scroll = true, padded = true, header, footer }: ScreenProps) {
  const { colors, spacing } = useTheme()
  const contentStyle = padded
    ? { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl + spacing.lg, paddingTop: spacing.md }
    : undefined

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {header}
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {scroll ? (
            <ScrollView style={styles.flex} contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.flex, contentStyle]}>{children}</View>
          )}
        </KeyboardAvoidingView>
        {footer}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({ flex: { flex: 1 } })
