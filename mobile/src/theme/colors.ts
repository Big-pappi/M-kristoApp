/**
 * M-Kristo design tokens.
 *
 * Palette: deep indigo (primary, trust/faith), warm gold (accent, for
 * verse-of-the-day / highlights), and a soft parchment neutral background
 * that reads as calm and "devotional" rather than a generic app.
 */
export const colors = {
  light: {
    background: "#FBF7EF",
    surface: "#FFFFFF",
    surfaceMuted: "#F1EBDD",
    border: "#E5DCC5",
    text: "#221B10",
    textMuted: "#6B6250",
    primary: "#2B2560",
    primaryForeground: "#FFFFFF",
    accent: "#C99A3E",
    accentForeground: "#221B10",
    success: "#2F6D4F",
    danger: "#A6382C",
  },
  dark: {
    background: "#15122A",
    surface: "#1E1A3A",
    surfaceMuted: "#26224A",
    border: "#332C5C",
    text: "#F4F0E4",
    textMuted: "#B8B0D8",
    primary: "#8A82D6",
    primaryForeground: "#15122A",
    accent: "#D9AE5C",
    accentForeground: "#15122A",
    success: "#4E9E77",
    danger: "#D96B5C",
  },
}

export type ThemeColors = typeof colors.light

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
}
