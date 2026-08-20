import "../src/i18n"

import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { restoreLanguage } from "../src/i18n"
import { useTheme } from "../src/theme/useTheme"

export default function RootLayout() {
  const { colors } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    restoreLanguage().finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  )
}
