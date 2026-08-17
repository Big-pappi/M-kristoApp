import AsyncStorage from "@react-native-async-storage/async-storage"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import sw from "./locales/sw.json"

// Swahili is the default and fallback language for the whole app.
export const DEFAULT_LANGUAGE = "sw"
export const LANGUAGE_STORAGE_KEY = "@mkristo/language"

export const resources = {
  sw: { translation: sw },
  en: { translation: en },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
})

/**
 * Restores the user's saved language preference (if any) and applies it.
 * Called once on app boot. Falls back to Swahili when nothing is stored.
 */
export async function restoreLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved === "en" || saved === "sw") {
      await i18n.changeLanguage(saved)
    }
  } catch {
    // Ignore storage errors — default Swahili stays active.
  }
}

/**
 * Switches the active language and persists the choice.
 */
export async function setLanguage(lang: "sw" | "en") {
  await i18n.changeLanguage(lang)
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
}

export default i18n
