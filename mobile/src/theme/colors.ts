/**
 * M-Kristo design tokens — "Sacred Midnight & Gilded".
 *
 * Palette is deliberately narrow: deep indigo (primary / faith), warm gilded
 * gold (accent, reserved for the sacred moments — verse of the day, premium,
 * favourites), plus a warm parchment neutral ramp in light mode and a deep
 * midnight ramp in dark mode. Nothing else. Gold is the one loud voice; every
 * other surface stays quiet so it keeps its weight.
 */
export const colors = {
  light: {
    background: "#FBF7EF",
    backgroundAlt: "#F5EFE2",
    surface: "#FFFFFF",
    surfaceMuted: "#F1EBDD",
    surfaceRaised: "#FFFFFF",
    border: "#E5DCC5",
    borderStrong: "#D6C9A8",
    text: "#221B10",
    textMuted: "#6B6250",
    textFaint: "#9A9078",
    primary: "#2B2560",
    primaryMuted: "#413A7E",
    primaryDeep: "#191338",
    primaryForeground: "#FFFFFF",
    primarySoft: "#E9E7F4",
    accent: "#C99A3E",
    accentSoft: "#F6EBD5",
    accentForeground: "#221B10",
    success: "#2F6D4F",
    danger: "#A6382C",
    overlay: "rgba(25, 19, 56, 0.55)",
    scrim: "rgba(25, 19, 56, 0.88)",
    onImage: "#FFFFFF",
    onImageMuted: "rgba(255, 255, 255, 0.72)",
  },
  dark: {
    background: "#0F0C22",
    backgroundAlt: "#15122A",
    surface: "#1B1738",
    surfaceMuted: "#241F49",
    surfaceRaised: "#221D44",
    border: "#332C5C",
    borderStrong: "#463D75",
    text: "#F4F0E4",
    textMuted: "#B0A8CF",
    textFaint: "#7C749D",
    primary: "#9A92E4",
    primaryMuted: "#7E76C8",
    primaryDeep: "#080618",
    primaryForeground: "#0F0C22",
    primarySoft: "#272252",
    accent: "#E0B767",
    accentSoft: "#332A1B",
    accentForeground: "#15122A",
    success: "#4E9E77",
    danger: "#D96B5C",
    overlay: "rgba(8, 6, 24, 0.62)",
    scrim: "rgba(8, 6, 24, 0.9)",
    onImage: "#FFFFFF",
    onImageMuted: "rgba(255, 255, 255, 0.72)",
  },
}

export type ThemeColors = typeof colors.light

/** Multi-stop gradients used for hero cards, headers and premium surfaces. */
export const gradients = {
  light: {
    hero: ["#2B2560", "#3B3175", "#191338"] as const,
    gild: ["#E3BD6C", "#C99A3E"] as const,
    veil: ["transparent", "rgba(25, 19, 56, 0.35)", "rgba(25, 19, 56, 0.92)"] as const,
    page: ["#FBF7EF", "#F3ECDD"] as const,
  },
  dark: {
    hero: ["#241F52", "#1B1738", "#0B0820"] as const,
    gild: ["#E0B767", "#B98F35"] as const,
    veil: ["transparent", "rgba(8, 6, 24, 0.4)", "rgba(8, 6, 24, 0.94)"] as const,
    page: ["#120F27", "#0F0C22"] as const,
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
}

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  full: 999,
}

/** Cross-platform elevation presets. */
export const elevation = {
  none: {},
  sm: {
    shadowColor: "#191338",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: "#191338",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  lg: {
    shadowColor: "#191338",
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
}

/** Type scale — one family, many weights. Serif is reserved for scripture. */
export const type = {
  display: { fontSize: 30, fontWeight: "800" as const, letterSpacing: -0.6 },
  title: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.3 },
  heading: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 23 },
  scripture: { fontSize: 18, fontWeight: "400" as const, lineHeight: 30 },
  label: { fontSize: 13, fontWeight: "600" as const },
  overline: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
  caption: { fontSize: 12, fontWeight: "500" as const },
}
