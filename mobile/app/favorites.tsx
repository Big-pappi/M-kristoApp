import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text } from "react-native"
import { Stack } from "expo-router"

import { listFavorites, type Favorite } from "../src/api/favorites"
import { ApiError } from "../src/api/client"
import { Card } from "../src/components/Card"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

export default function FavoritesScreen() {
  const { t } = useTranslation()
  const { colors, spacing } = useTheme()

  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    listFavorites()
      .then(setFavorites)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) setNeedsAuth(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: t("bible.bookmarked") }} />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : needsAuth ? (
        <Card>
          <Text style={{ color: colors.text }}>{t("auth.login")}</Text>
        </Card>
      ) : favorites.length === 0 ? (
        <Text style={{ color: colors.textMuted, marginTop: spacing.lg, textAlign: "center" }}>
          {t("common.empty")}
        </Text>
      ) : (
        favorites.map((fav) => (
          <Card key={fav.id} style={{ marginTop: spacing.sm }}>
            <Text style={{ color: colors.text, fontWeight: "600", textTransform: "capitalize" }}>
              {fav.content_type.replace("_", " ")}
            </Text>
            <Text style={{ color: colors.textMuted, marginTop: 2 }}>{fav.content_id}</Text>
          </Card>
        ))
      )}
    </Screen>
  )
}
