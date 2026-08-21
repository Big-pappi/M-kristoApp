import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native"
import { Link, Stack, useRouter } from "expo-router"
import { login } from "../../src/api/auth"
import { ApiError } from "../../src/api/client"
import { PrimaryButton } from "../../src/components/PrimaryButton"
import { Screen } from "../../src/components/Screen"
import { TextField } from "../../src/components/TextField"
import { useTheme } from "../../src/theme/useTheme"

export default function LoginScreen() {
  const { t } = useTranslation(); const { colors, spacing, type } = useTheme(); const router = useRouter()
  const [phone, setPhone] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false)
  async function handleLogin() { if (!phone.trim() || !password) return; setLoading(true); try { await login(phone.trim(), password); router.replace("/(tabs)") } catch (err) { Alert.alert(t("common.error"), err instanceof ApiError ? err.message : t("common.error")) } finally { setLoading(false) } }
  return <Screen><Stack.Screen options={{ headerShown: false }} /><ImageBackground source={require("../../assets/backgrounds/candlelight.png")} style={styles.hero} imageStyle={styles.heroImage}><View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} /><Text style={styles.mark}>M-KRISTO</Text><Text style={styles.heroTitle}>{t("auth.welcomeBack")}</Text></ImageBackground><Text style={[type.title, { color: colors.text, marginTop: spacing.xl }]}>{t("auth.login")}</Text><Text style={[type.body, { color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg }]}>{t("auth.loginIntro")}</Text><TextField label={t("auth.phoneNumber")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+255 7XX XXX XXX" /><TextField label={t("auth.password")} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" /><PrimaryButton label={t("auth.login")} onPress={handleLogin} loading={loading} /><View style={{ marginTop: spacing.lg, alignItems: "center", gap: spacing.md }}><Link href="/auth/register" style={{ color: colors.primary, fontWeight: "700" }}>{t("auth.noAccount")} <Text style={{ color: colors.accent }}>{t("auth.register")}</Text></Link><Link href="/(tabs)" style={{ color: colors.textMuted }}>{t("auth.continueAsGuest")}</Link></View></Screen>
}
const styles = StyleSheet.create({ hero: { minHeight: 190, justifyContent: "flex-end", padding: 22 }, heroImage: { borderRadius: 14 }, mark: { color: "#E0B767", fontSize: 11, letterSpacing: 2.5, fontWeight: "800", marginBottom: 8 }, heroTitle: { color: "#FFF", fontSize: 28, lineHeight: 34, fontWeight: "800" } })
