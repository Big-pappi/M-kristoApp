import { useColorScheme } from "react-native"

import { colors, radius, spacing } from "./colors"

/**
 * Resolves the active color scheme (light/dark) into design tokens.
 * Later this can be swapped to read a persisted user preference
 * (see accounts.theme_preference in the backend schema) instead of the
 * OS setting.
 */
export function useTheme() {
  const scheme = useColorScheme()
  const mode = scheme === "dark" ? "dark" : "light"
  return {
    mode,
    colors: colors[mode],
    spacing,
    radius,
  }
}
