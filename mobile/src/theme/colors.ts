export const colors = {
  light: {
    background: "#F7F3EA", backgroundAlt: "#EDE6D8", surface: "#FFFCF6", surfaceMuted: "#EEE8DC", surfaceRaised: "#FFFFFF",
    border: "#DED5C5", borderStrong: "#C8BBA5", text: "#171717", textMuted: "#6E695F", textFaint: "#989187",
    primary: "#242044", primaryMuted: "#40386B", primaryDeep: "#151329", primaryForeground: "#FFFFFF", primarySoft: "#E8E6EF",
    accent: "#D56A43", accentSoft: "#F6DED3", accentForeground: "#FFFFFF", success: "#2F6D4F", danger: "#A6382C",
    overlay: "rgba(25,19,56,0.55)", scrim: "rgba(25,19,56,0.88)", onImage: "#FFFFFF", onImageMuted: "rgba(255,255,255,0.72)",
  },
  dark: {
    background: "#121315", backgroundAlt: "#191B1D", surface: "#202326", surfaceMuted: "#2A2E31", surfaceRaised: "#282C2F",
    border: "#3B4145", borderStrong: "#535B60", text: "#F3F1EA", textMuted: "#B8BBB8", textFaint: "#858B8C",
    primary: "#D6D1C4", primaryMuted: "#B7B1A3", primaryDeep: "#0C0D0E", primaryForeground: "#151617", primarySoft: "#3A3A36",
    accent: "#E28A61", accentSoft: "#4A3029", accentForeground: "#FFFFFF", success: "#79B18D", danger: "#E27D6C",
    overlay: "rgba(8,9,10,0.68)", scrim: "rgba(8,9,10,0.9)", onImage: "#FFFFFF", onImageMuted: "rgba(255,255,255,0.72)",
  },
}
export type ThemeColors = typeof colors.light
export const gradients = { light: { hero: ["#2B2560", "#191338"] as const, gild: ["#E3BD6C", "#C99A3E"] as const, veil: ["transparent", "rgba(25,19,56,0.92)"] as const, page: ["#FBF7EF", "#F2EBDD"] as const }, dark: { hero: ["#241F52", "#0B0820"] as const, gild: ["#E0B767", "#B98F35"] as const, veil: ["transparent", "rgba(8,6,24,0.94)"] as const, page: ["#120F27", "#0F0C22"] as const } }
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 44 }
export const radius = { sm: 10, md: 16, lg: 22, xl: 28, full: 999 }
export const elevation = { none: {}, sm: { shadowColor: "#191338", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, md: { shadowColor: "#191338", shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 }, lg: { shadowColor: "#191338", shadowOpacity: 0.16, shadowRadius: 30, shadowOffset: { width: 0, height: 14 }, elevation: 12 } }
export const type = { display: { fontSize: 30, fontWeight: "800" as const, letterSpacing: -0.6 }, title: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.3 }, heading: { fontSize: 17, fontWeight: "700" as const }, body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 23 }, scripture: { fontSize: 18, fontWeight: "400" as const, lineHeight: 30 }, label: { fontSize: 13, fontWeight: "600" as const }, overline: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 1.4, textTransform: "uppercase" as const }, caption: { fontSize: 12, fontWeight: "500" as const } }
