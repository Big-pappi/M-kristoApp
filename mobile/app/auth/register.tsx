import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native"
import { Link, Stack, useRouter } from "expo-router"
import { register, requestOtp } from "../../src/api/auth"
import { ApiError } from "../../src/api/client"
import { PrimaryButton } from "../../src/components/PrimaryButton"
import { Screen } from "../../src/components/Screen"
import { TextField } from "../../src/components/TextField"
import { useTheme } from "../../src/theme/useTheme"

export default function RegisterScreen() {
  const { t, i18n } = useTranslation(); const { colors, spacing, type } = useTheme(); const router = useRouter()
  const [fullName, setFullName] = useState(""); const [phone, setPhone] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false)
  const canSubmit = fullName.trim().length > 1 && phone.trim().length > 0 && password.length >= 6
  async function handleRegister() { if (!canSubmit) return; setLoading(true); try { await register({ full_name: fullName.trim(), phone_number: phone.trim(), password, language_preference: i18n.language === "en" ? "en" : "sw" }); await requestOtp(phone.trim(), "signup"); router.push({ pathname: "/auth/verify-otp", params: { phone: phone.trim(), purpose: "signup" } }) } catch (err) { Alert.alert(t("common.error"), err instanceof ApiError ? err.message : t("common.error")) } finally { setLoading(false) } }
  return <Screen><Stack.Screen options={{ headerShown: false }} /><ImageBackground source={require("../../assets/backgrounds/hilltop-cross.png")} style={styles.hero} imageStyle={styles.heroImage}><View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} /><Text style={styles.heroTitle}>{t("auth.beginJourney")}</Text></ImageBackground><View style={{ gap: spacing.sm, marginTop: spacing.xl }}><Text style={[type.title, { color: colors.text }]}>{t("auth.register")}</Text><Text style={[type.body, { color: colors.textMuted }]}>{t("auth.registerIntro")}</Text></View><View style={{ gap: spacing.md, marginTop: spacing.lg }}><TextField label={t("auth.fullName")} value={fullName} onChangeText={setFullName} /><TextField label={t("auth.phoneNumber")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+255 7XX XXX XXX" /><TextField label={t("auth.password")} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" /></View><Text style={[type.caption, { color: colors.textFaint, marginTop: spacing.sm }]}>{t("auth.passwordHint")}</Text><View style={{ marginTop: spacing.lg }}><PrimaryButton label={t("auth.sendCode")} onPress={handleRegister} loading={loading} disabled={!canSubmit} /></View><View style={{ marginTop: spacing.lg, alignItems: "center" }}><Link href="/auth/login" style={{ color: colors.primary, fontWeight: "700" }}>{t("auth.haveAccount")} <Text style={{ color: colors.accent }}>{t("auth.login")}</Text></Link></View></Screen>
}
const styles = StyleSheet.create({ hero: { minHeight: 190, justifyContent: "flex-end", padding: 22, overflow: "hidden" }, heroImage: { borderRadius: 14 }, heroTitle: { color: "#FFF", fontSize: 28, lineHeight: 34, fontWeight: "800" } })
