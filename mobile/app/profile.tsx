import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text } from "react-native"
import { Stack, useRouter } from "expo-router"

import { getMe, type AuthUser } from "../src/api/auth"
import { ApiError } from "../src/api/client"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const router = useRouter()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace("/auth/login")
      })
      .finally(() => setLoading(false))
  }, [router])

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("settings.account") }} />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : user ? (
        <Card>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>
            {user.full_name}
          </Text>
          <Text style={{ color: colors.textMuted, marginTop: 4 }}>{user.phone_number}</Text>
          {user.email ? (
            <Text style={{ color: colors.textMuted, marginTop: 2 }}>{user.email}</Text>
          ) : null}
        </Card>
      ) : null}
    </Screen>
  )
}
