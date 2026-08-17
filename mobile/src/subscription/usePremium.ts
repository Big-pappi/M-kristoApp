import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useEffect, useState } from "react"

/**
 * Lightweight membership state. Today it is persisted locally so premium gates
 * and the subscription screen stay in sync across the app; when the backend
 * exposes /api/v1/subscriptions/mine/ this hook is the only thing that changes
 * — every gate reads `isPremium` from here.
 */
const STORAGE_KEY = "mkristo.premium.active"

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let mounted = true
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (mounted && raw === "1") setIsPremium(true)
      })
      .catch(() => {})
      .finally(() => mounted && setHydrated(true))
    return () => {
      mounted = false
    }
  }, [])

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value)
    AsyncStorage.setItem(STORAGE_KEY, value ? "1" : "0").catch(() => {})
  }, [])

  return { isPremium, setPremium, hydrated }
}
