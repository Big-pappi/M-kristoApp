import AsyncStorage from "@react-native-async-storage/async-storage"
import { useColorScheme, Appearance } from "react-native"
import { colors, elevation, gradients, radius, spacing, type } from "./colors"

export const THEME_STORAGE_KEY = "@mkristo/theme"
export type ThemeMode = "light" | "dark"

export async function restoreTheme() {
  const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY)
  const mode: ThemeMode = saved === "dark" ? "dark" : "light"
  Appearance.setColorScheme(mode)
}

export async function setThemeMode(mode: ThemeMode) {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
  Appearance.setColorScheme(mode)
}

export function useTheme() {
  const scheme = useColorScheme()
  const mode: ThemeMode = scheme === "dark" ? "dark" : "light"
  return { mode, isDark: mode === "dark", colors: colors[mode], gradients: gradients[mode], spacing, radius, elevation, type }
}
