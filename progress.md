# M-Kristo App — Progress Log

Running changelog of everything built on this project. Newest entries at
the top. Every session that changes code, schema, or scope should add an
entry here.

---

## 2026-08-14 — Expo mobile app: full screen set + auth flow

**Status:** Mobile app (Step 4 of 4) — core screens complete and verified.

**Done:**
- Built out every remaining screen on top of the earlier tab scaffold
  (Home, Bible, Sala, Shajara, tab layout):
  - `app/(tabs)/more.tsx` — "Zaidi" settings hub: quick links (dictionary,
    hymns, favorites), language switch (sw/en), notifications toggle,
    account/subscription/logout.
  - `app/dictionary.tsx` — Kamusi ya Biblia, debounced search.
  - `app/hymns.tsx` — Tenzi, searchable + expandable lyrics.
  - `app/devotion.tsx` — Neno la Leo / Tafakari / Somo tabs.
  - `app/favorites.tsx`, `app/profile.tsx`, `app/subscription.tsx`.
  - `app/auth/login.tsx`, `app/auth/register.tsx`,
    `app/auth/verify-otp.tsx` — phone + password login, OTP-based signup,
    guest-browsing escape hatch.
- Added supporting API modules: `src/api/hymns.ts`, `src/api/favorites.ts`,
  `src/api/subscriptions.ts` (typed fetch wrappers matching the Django
  serializers).
- Added shared UI: `src/components/TextField.tsx`,
  `src/components/PrimaryButton.tsx`.
- Fixed a couple of wiring bugs from the initial scaffold (wrong
  `changeLanguage` import name, a non-existent `colors.primarySoft`
  token, quick-link routes pointing at a nonexistent `/more/*` path).
- Installed the missing `expo-font` peer dep for `@expo/vector-icons`;
  `npx expo-doctor` now reports 21/21 checks passing.
- Added `app/bible/[bookId].tsx` — chapter picker + verse list reader,
  with per-verse favoriting (star icon, guest-safe no-op on 401). Wired
  the book cards on the Bible tab to navigate here.
- Verified the whole app compiles and bundles: `tsc --noEmit` is clean
  across `mobile/`, and `npx expo export --platform ios` bundles every
  screen/i18n/icon with zero errors.

**Next up:**
- Wire real push notifications (schema already supports it).
- Manual QA on a device/simulator (this sandbox has no mobile simulator).

**Notes:**
- Swahili stays the default/fallback language everywhere; every new
  string was added to both `sw.json` and `en.json`.
- Guests can browse Bible/prayers/hymns/dictionary without an account;
  notes (Shajara) and favorites require login and redirect to
  `auth/login` on a 401.

---

## 2026-08-14 — Excel progress & payment tracker

**Status:** Step 3 of 4 (Tracker) complete.

**Done:**
- Wrote `tracker/tracker_data.py` — editable task list (grouped by the 5
  proposal phases) and payment schedule (2,500,000 TZS + 1,000,000 TZS =
  3,500,000 TZS total, matching the signed proposal).
- Wrote `tracker/generate_tracker.py` — openpyxl script that builds
  `M-Kristo-Tracker.xlsx` with 3 sheets: Overview (totals + status pie
  chart), Progress Tracker (color-coded status, % complete, filters), and
  Payment Summary (milestones, totals, paid/remaining).
- Verified it runs end-to-end (`tracker/.venv` + `pip install openpyxl`)
  and generates the workbook correctly.
- Added root `.gitignore` (node_modules, .venv, __pycache__, .env files,
  Expo/Django build artifacts).

**Next up:**
- Scaffold the Django backend apps/models from the approved schema.
- Scaffold the Expo app structure.

**Notes:**
- Rerun `python generate_tracker.py` (from `tracker/`, with the venv
  activated) any time a task status or payment changes — never hand-edit
  the `.xlsx`.

---

## 2026-08-14 — PostgreSQL schema designed

**Status:** Step 2 of 4 (Database design) complete.

**Done:**
- Wrote `architecture/DATABASE_SCHEMA.md` — full human-readable schema
  covering accounts/OTP, Bible (books/verses/verse-of-the-day), devotions
  (Neno la Leo, Tafakari, Somo), prayers (Sala, Novena), hymns (Tenzi),
  dictionary, notes/calendar (Shajara), favorites, subscriptions &
  in-app payments, and push notifications.
- Wrote `architecture/database_schema.sql` — runnable PostgreSQL DDL
  matching the doc, using `pgcrypto` for UUIDs, `CHECK` constraints for
  enums, and indexes on the main lookup paths.
- Wrote `architecture/ERD.md` — Mermaid entity-relationship diagram.

**Next up:**
- Build the Python Excel tracker generator (`tracker/`).
- Scaffold the Django backend apps/models from this schema.
- Scaffold the Expo app structure.

**Notes:**
- Schema is bilingual by design (`_sw` required, `_en` optional) rather
  than a separate translations table, to keep queries simple for a
  two-language app.
- `favorites` uses an app-level polymorphic `content_type` + `content_id`
  pair (no DB-level FK) since it points at five different tables.

---

## 2026-08-14 — Project foundation & docs

**Status:** Foundation phase started (Step 1 of 4: Docs & architecture).

**Done:**
- Created `guide.md` — master development guide (stack, build order, local
  setup, working conventions).
- Created `progress.md` (this file).
- Created `architecture/PROJECT_STRUCTURE.md` — full monorepo layout for
  `mobile/` (Expo), `backend/` (Django), `architecture/`, `tracker/`.
- Reviewed existing `docs/` (client proposal, SRS, SDD, deployment guide
  PDFs) to align architecture and budget figures with what was already
  agreed with the client (Baraka).

**Next up:**
- Design PostgreSQL schema (`architecture/DATABASE_SCHEMA.md` +
  `architecture/database_schema.sql`).
- Build the Python Excel tracker generator (`tracker/`).
- Scaffold the Django backend apps from the approved schema.
- Scaffold the Expo app structure with Swahili-first i18n.

**Notes:**
- Confirmed with client materials: total dev cost 3,500,000 TZS, in two
  milestones — 2,500,000 TZS on commencement, 1,000,000 TZS on completion.
  These figures are the baseline for the payment tracker.
- Confirmed build order: **database design → backend → mobile app**,
  with docs updated continuously.
- PostgreSQL will be self-hosted/managed by the client's own instance (not
  provisioned through this tool).

---

<!-- Add new entries above this line, newest first. -->
