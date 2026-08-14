# M-Kristo App — Progress Log

Running changelog of everything built on this project. Newest entries at
the top. Every session that changes code, schema, or scope should add an
entry here.

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
