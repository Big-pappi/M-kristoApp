import { useColorScheme } from "react-native"

import { colors, elevation, gradients, radius, spacing, type } from "./colors"

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
    isDark: mode === "dark",
    colors: colors[mode],
    gradients: gradients[mode],
    spacing,
    radius,
    elevation,
    type,
  }
}
