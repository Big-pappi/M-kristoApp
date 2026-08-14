import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Text, View } from "react-native"
import { Link, Stack, useRouter } from "expo-router"

import { login } from "../../src/api/auth"
import { ApiError } from "../../src/api/client"
import { PrimaryButton } from "../../src/components/PrimaryButton"
import { Screen } from "../../src/components/Screen"
import { TextField } from "../../src/components/TextField"
import { useTheme } from "../../src/theme/useTheme"

export default function LoginScreen() {
  const { t } = useTranslation()
  const { colors, spacing } = useTheme()
  const router = useRouter()

  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!phone.trim() || !password) return
    setLoading(true)
    try {
      await login(phone.trim(), password)
      router.replace("/(tabs)")
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("common.error")
      Alert.alert(t("common.error"), message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("auth.login") }} />

      <Text style={[{ color: colors.text, fontSize: 22, fontWeight: "800" }, { marginBottom: spacing.lg }]}>
        {t("common.appName")}
      </Text>

      <TextField
        label={t("auth.phoneNumber")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+255 7XX XXX XXX"
      />
      <TextField
        label={t("auth.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      <PrimaryButton label={t("auth.login")} onPress={handleLogin} loading={loading} />

      <View style={{ marginTop: spacing.lg, alignItems: "center" }}>
        <Link href="/auth/register" style={{ color: colors.primary, fontWeight: "600" }}>
          {t("auth.register")}
        </Link>
      </View>

      <View style={{ marginTop: spacing.md, alignItems: "center" }}>
        <Link href="/(tabs)" style={{ color: colors.textMuted }}>
          {t("auth.continueAsGuest")}
        </Link>
      </View>
    </Screen>
  )
}
