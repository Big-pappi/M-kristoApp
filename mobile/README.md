# M-Kristo — Mobile App (Expo / React Native)

Swahili-first devotional app: daily verse, Bible, prayers (Sala), hymns
(Tenzi), Bible dictionary, and a personal journal/calendar (Shajara).
Swahili is the default language; users can switch to English at any time.

## Stack

- **Expo SDK 57** + **expo-router** (file-based navigation, typed routes)
- **TypeScript**
- **i18next / react-i18next** — `sw` (default) and `en` translations in
  `src/i18n/locales/`
- **@react-native-async-storage/async-storage** — persists the language
  choice and other local prefs
- **expo-secure-store** — stores JWT access/refresh tokens
- **@expo/vector-icons** (Ionicons) — tab bar + row icons

## Structure

```
mobile/
├── app/                     # expo-router routes (screens)
│   ├── _layout.tsx          # root stack, boots i18n
│   ├── (tabs)/               # bottom tab group
│   │   ├── _layout.tsx      # tab bar (Home, Bible, Sala, Shajara, Zaidi)
│   │   ├── index.tsx        # Home — verse of the day + quick links
│   │   ├── bible.tsx        # Bible books (Old/New Testament)
│   │   ├── prayers.tsx      # Sala — common prayers, expandable
│   │   ├── calendar.tsx     # Shajara — personal journal by date
│   │   └── more.tsx         # Settings hub — language, account, etc.
│   ├── auth/                # login / register / OTP verification
│   ├── dictionary.tsx       # Bible dictionary (Kamusi)
│   ├── hymns.tsx             # Hymns (Tenzi)
│   ├── devotion.tsx          # Neno la Leo / Tafakari / Somo
│   ├── favorites.tsx
│   ├── profile.tsx
│   └── subscription.tsx
├── src/
│   ├── api/                 # typed fetch wrappers per backend app
│   ├── components/           # Screen, Card, TextField, PrimaryButton, ...
│   ├── i18n/                 # i18next setup + sw.json / en.json
│   └── theme/                 # design tokens (colors, spacing, radius)
└── app.json
```

## Running locally

```bash
cd mobile
npm install
npm start          # then press i / a / w, or scan the QR with Expo Go
```

Set the backend API URL for your machine (the Django dev server does not
listen on `localhost` from a physical device or emulator):

```bash
# .env or app config — see src/api/client.ts API_BASE_URL
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8000
```

## Auth flow

1. `auth/register` — phone number + password → triggers an OTP SMS
   (`requestOtp`).
2. `auth/verify-otp` — enter the code → `verifyOtp` exchanges it for a
   JWT pair and logs the user in.
3. `auth/login` — existing users sign in with phone + password directly.
4. Guests can tap "Endelea Bila Kujisajili" (continue as guest) from the
   login screen to browse public content (Bible, prayers, hymns,
   dictionary) without an account. Personal notes/favorites require login.

Tokens are stored via `expo-secure-store`; `src/api/client.ts` auto-attaches
the access token and refreshes it on a 401 using the refresh token.

## i18n

- Swahili (`sw`) is the default and fallback language.
- `src/i18n/index.ts` restores a saved language preference on boot; the
  "Zaidi" (More) tab lets users switch between Kiswahili / Kiingereza.
- Add new strings to **both** `sw.json` and `en.json` with the same key.

## Notes

- This app was scaffolded and validated with `npx expo export --platform
  ios` (no simulator required) — confirms Metro bundles every screen with
  zero errors. Run it on a real device/simulator for full QA.
- See `../architecture/` for the database schema this app's API layer is
  built against, and `../guide.md` / `../progress.md` for the overall
  project plan and changelog.
