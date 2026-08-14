import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Text } from "react-native"
import { Stack, useRouter } from "expo-router"

import { register, requestOtp } from "../../src/api/auth"
import { ApiError } from "../../src/api/client"
import { PrimaryButton } from "../../src/components/PrimaryButton"
import { Screen } from "../../src/components/Screen"
import { TextField } from "../../src/components/TextField"
import { useTheme } from "../../src/theme/useTheme"

export default function RegisterScreen() {
  const { t, i18n } = useTranslation()
  const { colors, spacing } = useTheme()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!fullName.trim() || !phone.trim() || password.length < 6) return
    setLoading(true)
    try {
      await register({
        full_name: fullName.trim(),
        phone_number: phone.trim(),
        password,
        language_preference: i18n.language === "en" ? "en" : "sw",
      })
      await requestOtp(phone.trim(), "signup")
      router.push({ pathname: "/auth/verify-otp", params: { phone: phone.trim(), purpose: "signup" } })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("common.error")
      Alert.alert(t("common.error"), message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("auth.register") }} />

      <Text style={{ color: colors.textMuted, marginBottom: spacing.lg }}>
        {t("common.appName")}
      </Text>

      <TextField label={t("auth.fullName")} value={fullName} onChangeText={setFullName} />
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

      <PrimaryButton label={t("auth.sendCode")} onPress={handleRegister} loading={loading} />
    </Screen>
  )
}
