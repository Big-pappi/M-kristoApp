import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Text } from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

import { verifyOtp } from "../../src/api/auth"
import { ApiError } from "../../src/api/client"
import { PrimaryButton } from "../../src/components/PrimaryButton"
import { Screen } from "../../src/components/Screen"
import { TextField } from "../../src/components/TextField"
import { useTheme } from "../../src/theme/useTheme"

export default function VerifyOtpScreen() {
  const { t } = useTranslation()
  const { colors, spacing } = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams<{
    phone: string
    purpose: "signup" | "login" | "reset_password"
  }>()

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    if (code.trim().length < 4 || !params.phone) return
    setLoading(true)
    try {
      await verifyOtp(params.phone, code.trim(), params.purpose ?? "signup")
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
      <Stack.Screen options={{ headerShown: true, title: t("auth.verifyCode") }} />

      <Text style={{ color: colors.textMuted, marginBottom: spacing.lg }}>
        {t("auth.otpSentTo", { phone: params.phone })}
      </Text>

      <TextField
        label={t("auth.verifyCode")}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="123456"
        maxLength={6}
      />

      <PrimaryButton label={t("auth.verifyCode")} onPress={handleVerify} loading={loading} />
    </Screen>
  )
}
