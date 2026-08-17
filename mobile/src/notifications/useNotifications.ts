import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useEffect, useState } from "react"

import type { Ionicons } from "@expo/vector-icons"

export type AppNotification = {
  id: string
  /** Drives the icon + accent treatment in the list. */
  kind: "verse" | "devotion" | "prayer" | "premium" | "system"
  title_sw: string
  title_en: string
  body_sw: string
  body_en: string
  /** ISO timestamp. */
  createdAt: string
  href?: string
  read: boolean
}

export const NOTIFICATION_ICONS: Record<AppNotification["kind"], keyof typeof Ionicons.glyphMap> = {
  verse: "book",
  devotion: "sunny",
  prayer: "hand-left",
  premium: "sparkles",
  system: "information-circle",
}

const STORAGE_KEY = "mkristo.notifications.readIds"

/**
 * Seed feed. These stand in for server-pushed notifications; when the backend
 * exposes /api/v1/notifications/ this list is the only thing that changes —
 * the bell, badge and screen all read from this hook.
 */
const SEED: Omit<AppNotification, "read">[] = [
  {
    id: "n1",
    kind: "verse",
    title_sw: "Neno la Leo limewasili",
    title_en: "Today's verse is ready",
    body_sw: "Yakobo 1:5 — Mungu huwapa wote kwa ukarimu.",
    body_en: "James 1:5 — God gives generously to all.",
    createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    href: "/verse-studio",
  },
  {
    id: "n2",
    kind: "devotion",
    title_sw: "Tafakari ya asubuhi",
    title_en: "Morning devotion",
    body_sw: "Somo la leo linahusu neema na uvumilivu.",
    body_en: "Today's reading is about grace and patience.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    href: "/devotion",
  },
  {
    id: "n3",
    kind: "premium",
    title_sw: "Tenzi zote zimefunguliwa kwa wanachama",
    title_en: "All hymns unlocked for members",
    body_sw: "Pata tenzi 300+ na novena kamili.",
    body_en: "Get 300+ hymns and the full novena set.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    href: "/subscription",
  },
  {
    id: "n4",
    kind: "prayer",
    title_sw: "Kumbusho la sala ya jioni",
    title_en: "Evening prayer reminder",
    body_sw: "Chukua dakika tano kwa Rozari.",
    body_en: "Take five minutes for the Rosary.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    href: "/prayers",
  },
]

/**
 * Notification state shared by the header bell and the notifications screen.
 * Read state is persisted locally so the badge survives app restarts.
 */
export function useNotifications() {
  const [readIds, setReadIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let mounted = true
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return
        if (raw) setReadIds(JSON.parse(raw) as string[])
      })
      .catch(() => {
        // Storage unavailable — fall back to everything unread.
      })
      .finally(() => mounted && setHydrated(true))
    return () => {
      mounted = false
    }
  }, [])

  const persist = useCallback((ids: string[]) => {
    setReadIds(ids)
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids)).catch(() => {})
  }, [])

  const notifications: AppNotification[] = SEED.map((n) => ({
    ...n,
    read: readIds.includes(n.id),
  }))

  const markRead = useCallback(
    (id: string) => {
      if (readIds.includes(id)) return
      persist([...readIds, id])
    },
    [readIds, persist],
  )

  const markAllRead = useCallback(() => {
    persist(SEED.map((n) => n.id))
  }, [persist])

  return {
    notifications,
    unreadCount: hydrated ? notifications.filter((n) => !n.read).length : 0,
    markRead,
    markAllRead,
    hydrated,
  }
}

/** Human-friendly relative time, localised for the two supported languages. */
export function formatRelative(iso: string, isEnglish: boolean) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 60) {
    const value = Math.max(1, minutes)
    return isEnglish ? `${value}m ago` : `dakika ${value}`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) return isEnglish ? `${hours}h ago` : `saa ${hours}`
  const days = Math.round(hours / 24)
  return isEnglish ? `${days}d ago` : `siku ${days}`
}
