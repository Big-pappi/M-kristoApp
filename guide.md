# M-Kristo App — Development Guide

Read this file first, every time you come back to this project. It explains
what M-Kristo is, how the repo is organized, and how to work on it
day-to-day. Keep it and `progress.md` up to date — **any structural,
schema, or scope change must be reflected here and logged in
`progress.md` in the same session.**

## 1. What is M-Kristo?

M-Kristo is a cross-platform (Android/iOS) daily-devotions mobile app for a
primarily Swahili-speaking audience, with full English support. It brings
together:

- **Bible** — free access to Scripture in Swahili and English.
- **Neno la Leo** — a short daily verse (verse of the day).
- **Sala** — common prayers.
- **Novena** — novena prayers (premium).
- **Tenzi** — hymns (free sample, full collection premium).
- **Tafakari / Somo** — daily reflections and readings.
- **Dictionary** — lookup + translation of difficult/complex biblical terms.
- **Notes & Calendar (Shajara)** — personal notes tied to a calendar, for
  personalization and journaling.
- **Favorites** — saved items across all content types.
- **Accounts** — sign up/login, social login, phone OTP verification.
- **Subscriptions** — monthly/annual plans that unlock premium content.

Default language is **Swahili**. Users can switch to **English** from
Profile → Settings.

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo (React Native), TypeScript, expo-router |
| Backend | Django + Django REST Framework (Python) |
| Database | PostgreSQL |
| Auth | Token/session auth + phone OTP + optional social login |
| Push notifications | Firebase Cloud Messaging / EAS Push |
| Docs | `architecture/`, PDFs in `docs/` (proposal, SRS, SDD, deployment) |
| Progress tracking | `tracker/generate_tracker.py` → Excel (openpyxl) |

See `architecture/PROJECT_STRUCTURE.md` for the full folder layout.

## 3. Build Order (agreed)

1. **Docs & architecture** — this guide, `progress.md`, project structure,
   Excel tracker scaffold. *(you are here)*
2. **Database design** — `architecture/DATABASE_SCHEMA.md` +
   `architecture/database_schema.sql` (PostgreSQL DDL), designed before any
   backend code is written.
3. **Django backend** — models generated from the approved schema, REST API,
   admin panel for content management.
4. **Expo app** — screens consuming the API, Swahili-first UI, i18n toggle.

Do not skip ahead: the database is the contract every layer above it
depends on. If the schema changes after the backend/app exist, update the
schema doc, the SQL file, the Django models, and log it in `progress.md`
before writing app code against it.

## 4. Local Setup

### Database (PostgreSQL)

You are bringing your own PostgreSQL instance. Create a database and user,
then apply the schema:

```bash
createdb mkristo
psql -d mkristo -f architecture/database_schema.sql
```

Set the connection string as `DATABASE_URL` in `backend/.env` (copy from
`backend/.env.example`).

### Backend (Django)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, SECRET_KEY, etc.
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Mobile app (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the Expo Go app, or run on a simulator.

### Progress/payment tracker (Excel)

```bash
cd tracker
pip install openpyxl
python generate_tracker.py
```

This (re)generates `M-Kristo-Tracker.xlsx` with a task-progress sheet and a
payment-summary sheet, based on `tracker_data.py`. Edit `tracker_data.py`
and rerun the script whenever progress or payments change — do not hand-edit
the `.xlsx` directly, since it will be overwritten on the next run.

## 5. Working Conventions

- **Swahili first**: every user-facing string ships in `sw` by default;
  `en` strings live alongside it in `mobile/src/i18n/`.
- **One Django app per domain**: `accounts`, `bible`, `devotions`,
  `prayers`, `hymns`, `dictionary`, `notes`, `favorites`, `subscriptions`,
  `notifications`. Don't dump unrelated models into one app.
- **API contracts**: REST, JSON, versioned under `/api/v1/`.
- **No SQLite**: PostgreSQL is used in every environment, including local
  dev, to avoid schema drift.
- **Payments**: figures in the tracker must match the signed proposal
  (`docs/M-Kristo-Development-Proposal.pdf`) unless the client agrees to a
  change — update both if the agreement changes.

## 6. Keeping Docs in Sync

Whenever you finish a unit of work:

1. Update `progress.md` with what changed and the date.
2. If you touched the schema, update `architecture/DATABASE_SCHEMA.md` and
   `architecture/database_schema.sql` together.
3. If you completed or started a milestone/task, update
   `tracker/tracker_data.py` and rerun `generate_tracker.py`.
4. If the folder layout changed, update
   `architecture/PROJECT_STRUCTURE.md`.
