# M-Kristo Backend (Django + DRF + PostgreSQL)

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then fill in DATABASE_URL, SECRET_KEY
```

`DATABASE_URL` must point at a real PostgreSQL instance, e.g.:

```
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/mkristo
```

## Run migrations & start the dev server

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API is served at `http://127.0.0.1:8000/api/v1/...` and the admin at
`/admin/`.

## Project layout

```
backend/
  config/
    settings/
      base.py      # shared settings
      dev.py       # DEBUG=True, local dev
      prod.py      # DEBUG=False, ALLOWED_HOSTS from env
    urls.py         # mounts every app under /api/v1/
  apps/
    accounts/       # custom User (phone_number login), OTP, JWT auth
    bible/          # books, verses, verse-of-the-day
    devotions/      # Neno la Leo, Tafakari, Somo
    prayers/        # Sala, Novena
    hymns/          # Tenzi
    dictionary/     # hard-word lookup/translation
    notes/          # Shajara — personal calendar journal
    favorites/      # saved items across all content types
    subscriptions/  # plans, subscriptions, payments (M-Pesa etc.)
    notifications/  # push device tokens + notification inbox
```

Every model's `db_table` matches the table name in
`architecture/database_schema.sql` — that SQL file is the single source of
truth for the schema; Django migrations are generated from these models
to match it.

## Auth flow (see `apps/accounts`)

1. `POST /api/v1/auth/register/` — creates an unverified account, sends OTP.
2. `POST /api/v1/auth/otp/verify/` `{phone_number, code, purpose: "signup"}`
   — marks phone verified, returns JWT `access`/`refresh`.
3. `POST /api/v1/auth/login/` `{phone_number, password}` — standard JWT
   login (SimpleJWT `TokenObtainPairView`).
4. `POST /api/v1/auth/otp/request/` + `/otp/verify/` with
   `purpose: "reset_password"` for forgot-password flow.
5. `GET/PATCH /api/v1/auth/me/` — profile + language/theme preference.

SMS sending is stubbed (`print("[DEV OTP] ...")` in
`apps/accounts/views.py`) — wire up a real gateway (e.g. Beem Africa,
Africa's Talking) before production.

## Notes

- No ORM abstraction beyond Django's own — this project does not use
  Neon/Supabase, so there's no extra migration tool to layer on top.
- `CORS_ALLOW_ALL_ORIGINS=True` in dev only; lock this down in `prod.py`
  once the Expo app's published URL/scheme is known.
