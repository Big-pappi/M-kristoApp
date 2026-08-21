import AsyncStorage from "@react-native-async-storage/async-storage"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { Screen } from "../src/components/Screen"
import { useTheme } from "../src/theme/useTheme"

const KEY = "@mkristo/reading-notes"
export default function NotesScreen() {
  const { t } = useTranslation(); const { colors, spacing, radius, type } = useTheme(); const [note, setNote] = useState(""); const [saving, setSaving] = useState(false)
  useEffect(() => { AsyncStorage.getItem(KEY).then((value) => value && setNote(value)) }, [])
  async function save() { setSaving(true); await AsyncStorage.setItem(KEY, note); setSaving(false); Alert.alert(t("common.success"), "Umehifadhi kumbukumbu yako.") }
  return <Screen scroll header={<><Stack.Screen options={{ headerShown: false }} /><Text style={[type.title, { color: colors.text }]}>Notes</Text></>}><Text style={[type.body, { color: colors.textMuted, marginTop: spacing.sm }]}>Andika unachojifunza katika usomaji wako wa leo.</Text><TextInput multiline value={note} onChangeText={setNote} placeholder="Andika hapa..." placeholderTextColor={colors.textFaint} textAlignVertical="top" style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.lg }]} /><Pressable onPress={save} disabled={saving} style={[styles.button, { backgroundColor: colors.accent, borderRadius: radius.md, marginTop: spacing.md }]}><Text style={{ color: colors.accentForeground, fontWeight: "800" }}>{saving ? "..." : "Hifadhi kumbukumbu"}</Text></Pressable></Screen>
}
const styles = StyleSheet.create({ input: { minHeight: 280, borderWidth: 1, padding: 16, fontSize: 16, lineHeight: 24 }, button: { paddingVertical: 15, alignItems: "center" } })
