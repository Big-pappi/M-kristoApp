import { useCallback, useEffect, useState } from "react"

import { getMe, type AuthUser } from "../api/auth"
import { ApiError } from "../api/client"

/**
 * Shared, lightly-cached current-user state. The header avatar/name, the
 * profile screen and anything else that needs "who am I" all read from here,
 * so the app only hits /auth/me once per session instead of per screen.
 *
 * A module-level cache keeps the value warm across mounts; `refresh()` lets
 * callers (e.g. after editing the profile) invalidate it.
 */
let cachedUser: AuthUser | null = null
let cachedError = false
let inflight: Promise<AuthUser | null> | null = null

const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach((fn) => fn())
}

async function load(force = false): Promise<AuthUser | null> {
  if (cachedUser && !force) return cachedUser
  if (inflight && !force) return inflight

  inflight = getMe()
    .then((user) => {
      cachedUser = user
      cachedError = false
      return user
    })
    .catch((err) => {
      // 401 simply means "guest" — not an error worth surfacing.
      if (!(err instanceof ApiError && err.status === 401)) cachedError = true
      cachedUser = null
      return null
    })
    .finally(() => {
      inflight = null
      notify()
    })

  return inflight
}

export function useProfile() {
  const [user, setUser] = useState<AuthUser | null>(cachedUser)
  const [loading, setLoading] = useState(!cachedUser)

  useEffect(() => {
    let mounted = true
    const sync = () => {
      if (!mounted) return
      setUser(cachedUser)
      setLoading(false)
    }
    subscribers.add(sync)

    if (cachedUser) {
      setUser(cachedUser)
      setLoading(false)
    } else {
      setLoading(true)
      load().finally(sync)
    }

    return () => {
      mounted = false
      subscribers.delete(sync)
    }
  }, [])

  const refresh = useCallback(() => load(true), [])

  /** First name only — used in the header greeting. */
  const firstName = user?.full_name?.trim().split(/\s+/)[0] ?? null

  return { user, firstName, loading, error: cachedError, refresh }
}
