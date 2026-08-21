import "../src/i18n"

import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { restoreLanguage } from "../src/i18n"
import { restoreTheme, useTheme } from "../src/theme/useTheme"

export default function RootLayout() {
  const { colors } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([restoreLanguage(), restoreTheme()]).finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <ImageBackground source={require("../assets/backgrounds/mountain-sunrise.png")} style={styles.splash} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} />
        <View style={styles.splashContent}>
          <Image source={require("../assets/splash-icon.png")} style={styles.logo} />
          <Text style={styles.brand}>M-KRISTO</Text>
          <View style={styles.rule} />
          <Text style={styles.welcome}>Imani ya kila siku, karibu nawe.</Text>
        </View>
      </ImageBackground>
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

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: "#191338", alignItems: "center", justifyContent: "center" },
  splashContent: { alignItems: "center", padding: 32 },
  logo: { width: 92, height: 92, marginBottom: 22 },
  brand: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", letterSpacing: 4 },
  rule: { width: 44, height: 2, backgroundColor: "#C99A3E", marginVertical: 18 },
  welcome: { color: "rgba(255,255,255,0.78)", fontSize: 14, letterSpacing: 0.3 },
})
