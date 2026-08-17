import { Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

import { createNote, getNotesForDate, type Note } from "../../src/api/notes"
import { ApiError } from "../../src/api/client"
import { Card } from "../../src/components/Card"
import { Screen } from "../../src/components/Screen"
import { SectionHeader } from "../../src/components/SectionHeader"
import { useTheme } from "../../src/theme/useTheme"

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function CalendarScreen() {
  const { t } = useTranslation()
  const { colors, spacing, radius } = useTheme()

  const [date] = useState(todayIso())
  const [notes, setNotes] = useState<Note[]>([])
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [needsAuth, setNeedsAuth] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getNotesForDate(date)
      .then((data) => {
        setNotes(data)
        setNeedsAuth(false)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) setNeedsAuth(true)
      })
      .finally(() => setLoading(false))
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave() {
    if (!draft.trim()) return
    setSaving(true)
    try {
      const note = await createNote({ note_date: date, body: draft.trim() })
      setNotes((prev) => [note, ...prev])
      setDraft("")
    } catch {
      // Swallow for now — a toast/snackbar can surface this later.
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>{t("calendar.title")}</Text>
      <Text style={{ color: colors.textMuted, marginTop: 2 }}>{t("common.today")}: {date}</Text>

      {needsAuth ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={{ color: colors.text }}>{t("auth.login")}</Text>
        </Card>
      ) : (
        <>
          <Card style={{ marginTop: spacing.lg }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t("calendar.notePlaceholder")}
              placeholderTextColor={colors.textMuted}
              multiline
              style={{ color: colors.text, minHeight: 80, textAlignVertical: "top" }}
            />
            <Pressable
              onPress={handleSave}
              disabled={saving || !draft.trim()}
              style={[
                styles.saveButton,
                { backgroundColor: colors.primary, borderRadius: radius.sm, opacity: saving ? 0.6 : 1 },
              ]}
            >
              <Ionicons name="add" size={16} color={colors.primaryForeground} />
              <Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>
                {t("calendar.addNote")}
              </Text>
            </Pressable>
          </Card>

          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title={t("calendar.myNotes")} />
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : notes.length === 0 ? (
              <Text style={{ color: colors.textMuted }}>{t("calendar.noNotesToday")}</Text>
            ) : (
              notes.map((note) => (
                <Card key={note.id} style={{ marginBottom: spacing.sm }}>
                  <Text style={{ color: colors.text }}>{note.body}</Text>
                </Card>
              ))
            )}
          </View>
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800" },
  saveButton: {
    marginTop: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
})
