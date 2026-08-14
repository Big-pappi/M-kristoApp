# M-Kristo App — Project Structure

This document is the single source of truth for how the M-Kristo App
repository is organized. Every new folder or major file should be added
here, and `progress.md` should be updated whenever this structure changes.

> Client: Baraka | Developer: Philip Steven Chediel (BlueGrid Technologies)
> Stack: Expo (React Native) + Django (Python) + PostgreSQL

## Monorepo Layout

```
M-kristoApp/
├── mobile/                        # Expo React Native app (the app users install)
│   ├── app.json                   # Expo config (name, icon, splash, permissions)
│   ├── app.config.ts              # Dynamic Expo config (env-based overrides)
│   ├── App.tsx                    # App entry point
│   ├── src/
│   │   ├── screens/               # One folder per screen/feature
│   │   │   ├── onboarding/
│   │   │   ├── auth/              # Login, signup, OTP verification
│   │   │   ├── home/              # Neno la Leo (verse of the day)
│   │   │   ├── bible/             # Bible reader (Swahili/English)
│   │   │   ├── prayers/           # Sala (common prayers), Novena
│   │   │   ├── hymns/             # Tenzi
│   │   │   ├── devotions/         # Tafakari, Somo
│   │   │   ├── dictionary/        # Biblical word lookup/translation
│   │   │   ├── notes/             # Personal notes + calendar (Shajara)
│   │   │   ├── favorites/
│   │   │   ├── subscription/      # Premium plans / paywall
│   │   │   └── profile/           # Settings, language, theme
│   │   ├── components/            # Shared/reusable UI components
│   │   ├── navigation/            # Stack/tab navigators (expo-router or React Navigation)
│   │   ├── i18n/                  # Translations - sw.json (default), en.json
│   │   ├── api/                   # Axios client + endpoint wrappers for Django API
│   │   ├── store/                 # Global state (Zustand/Redux) - auth, language, theme
│   │   ├── theme/                 # Colors, typography, spacing tokens
│   │   ├── constants/
│   │   ├── utils/
│   │   └── types/                 # Shared TypeScript types
│   ├── assets/                    # Fonts, images, icons, splash
│   └── package.json
│
├── backend/                        # Django backend (REST API)
│   ├── config/                     # Project settings, urls, wsgi/asgi
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── dev.py
│   │   │   └── prod.py
│   │   ├── urls.py
│   │   └── asgi.py / wsgi.py
│   ├── apps/
│   │   ├── accounts/                # Users, auth, OTP, social login
│   │   ├── bible/                   # Books, chapters, verses (sw/en)
│   │   ├── devotions/                # Neno la Leo, Tafakari, Somo (daily content)
│   │   ├── prayers/                  # Sala (common prayers), Novena
│   │   ├── hymns/                    # Tenzi (hymns)
│   │   ├── dictionary/               # Biblical term glossary + translations
│   │   ├── notes/                     # Personal notes + calendar entries (Shajara)
│   │   ├── favorites/
│   │   ├── subscriptions/             # Plans, payments, premium gating
│   │   └── notifications/             # Push notification scheduling
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── architecture/                   # System design & reference docs (this folder)
│   ├── PROJECT_STRUCTURE.md         # This file
│   ├── DATABASE_SCHEMA.md           # Human-readable schema reference
│   ├── database_schema.sql          # Runnable PostgreSQL DDL
│   └── ERD.md                       # Entity-relationship diagram (mermaid)
│
├── tracker/                        # Progress & payment tracking (Excel)
│   ├── generate_tracker.py          # Run this to (re)build the .xlsx
│   ├── tracker_data.py              # Editable source data (tasks, payments)
│   └── M-Kristo-Tracker.xlsx        # Generated output (rerun script to refresh)
│
├── docs/                           # Client-facing PDFs (proposal, SRS, SDD, deployment guide)
│
├── guide.md                        # How this project works - read this first
├── progress.md                     # Running changelog of everything built
└── README.md
```

## Conventions

- **Default language**: Swahili (`sw`) everywhere in the app UI. English (`en`)
  is an opt-in toggle stored in user settings/profile.
- **Backend**: Django REST Framework, one Django "app" per domain (bible,
  prayers, hymns, devotions, dictionary, notes, subscriptions, accounts).
- **Database**: PostgreSQL only. No SQLite, even in development.
- **Mobile**: Expo (managed workflow) + TypeScript. Navigation via
  `expo-router` (file-based, mirrors `screens/`).
- **Docs discipline**: Any schema, API, or structural change must be
  reflected in `architecture/` and logged in `progress.md` in the same
  work session.

## Where to Start

1. Read `guide.md`.
2. Review `architecture/DATABASE_SCHEMA.md` before touching the database.
3. Check `progress.md` for the latest state before starting new work.
4. Run `tracker/generate_tracker.py` after finishing a milestone to keep
   the Excel tracker in sync.
