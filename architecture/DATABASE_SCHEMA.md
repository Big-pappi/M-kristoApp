# M-Kristo App — Database Schema (PostgreSQL)

This is the human-readable reference for the schema. The runnable DDL lives
in `architecture/database_schema.sql` — the two must always match. If you
change one, change the other and log it in `progress.md`.

Engine: **PostgreSQL** (uses `gen_random_uuid()` from the `pgcrypto`
extension). Django models in `backend/apps/*/models.py` should be generated
to match this schema exactly (see `guide.md` §3).

## Conventions

- All tables have `created_at` / `updated_at` timestamps (UTC).
- Bilingual content columns are suffixed `_sw` (Swahili, required, default
  language) and `_en` (English, optional — falls back to `_sw` in the app
  if empty).
- `is_premium` marks content that requires an active subscription.
- Primary keys are `BIGSERIAL` unless noted; `users.public_id` is a UUID
  used in API responses/URLs instead of the internal integer id.

## Table Groups

### 1. Accounts (`accounts` app)

**`users`** — app accounts.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | internal id |
| public_id | UUID | unique, exposed in API |
| phone_number | VARCHAR(20) | unique, primary login identifier |
| email | VARCHAR(255) | unique, nullable |
| password_hash | VARCHAR(255) | nullable if social-only login |
| full_name | VARCHAR(150) | |
| profile_picture_url | TEXT | nullable |
| language_preference | VARCHAR(2) | `sw` default, `en` |
| theme_preference | VARCHAR(10) | `light` default, `dark` |
| is_phone_verified | BOOLEAN | default false |
| social_provider | VARCHAR(20) | nullable: `google`, `apple` |
| social_id | VARCHAR(255) | nullable |
| is_active | BOOLEAN | default true |
| is_staff | BOOLEAN | default false (content admins) |
| last_login_at | TIMESTAMPTZ | nullable |
| created_at / updated_at | TIMESTAMPTZ | |

**`otp_verifications`** — phone OTP codes for signup/login/reset.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | FK → users, nullable | null until account exists |
| phone_number | VARCHAR(20) | |
| code | VARCHAR(10) | |
| purpose | VARCHAR(20) | `signup` / `login` / `reset_password` |
| expires_at | TIMESTAMPTZ | |
| is_used | BOOLEAN | default false |
| created_at | TIMESTAMPTZ | |

### 2. Bible (`bible` app)

**`bible_books`** — the 66 books, bilingual names.
`id, name_sw, name_en, testament (old/new), book_order, chapter_count, created_at`

**`bible_versions`** — Bible translation versions (NIV, KJV, NLT, LSB, ESV, CPDV).
`id, code (unique), name_sw, name_en, language (sw/en), is_active, created_at`

**`bible_verses`** — verse text per book/chapter/verse per version, both languages with audio.
`id, book_id FK, version_id FK, chapter, verse_number, text_sw, text_en, audio_url_sw, audio_url_en, created_at`
Unique on `(book_id, version_id, chapter, verse_number)`.

**`verse_of_the_day`** — curated short verse shown on the home screen
(Neno la Leo source content).
`id, verse_id FK → bible_verses, display_date (unique), short_text_sw, short_text_en, created_at`

### 3. Daily Devotions (`devotions` app)

**`devotions`** — Neno la Leo (long form), Tafakari, Somo.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| type | VARCHAR(20) | `neno_la_leo` / `tafakari` / `somo` |
| devotion_date | DATE | |
| title_sw / title_en | VARCHAR(255) | |
| body_sw / body_en | TEXT | |
| scripture_reference | VARCHAR(100) | nullable, e.g. "Yohana 3:16" |
| is_premium | BOOLEAN | default false |
| created_at / updated_at | TIMESTAMPTZ | |

Unique on `(type, devotion_date)`.

### 4. Prayers (`prayers` app)

**`prayer_categories`** — groups prayers (e.g. "Sala za Asubuhi", a Novena set).
`id, name_sw, name_en, kind (sala/novena), is_premium, order_index, created_at`

**`prayers`** — individual prayer texts, or one Novena day per row.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| category_id | FK → prayer_categories | |
| day_number | SMALLINT | nullable, used for Novena day ordering (1-9) |
| title_sw / title_en | VARCHAR(255) | |
| body_sw / body_en | TEXT | |
| order_index | INT | default 0 |
| created_at / updated_at | TIMESTAMPTZ | |

### 5. Hymns (`hymns` app)

**`hymns`** — Tenzi.
`id, number, title_sw, title_en, lyrics_sw, lyrics_en, is_premium, created_at, updated_at`
Unique on `number`.

### 6. Dictionary (`dictionary` app)

**`dictionary_terms`** — complex/biblical word lookup and translation.
`id, term_sw, term_en, definition_sw, definition_en, related_scripture_reference, created_at, updated_at`
Indexed on `term_sw` and `term_en` for fast lookup.

### 7. Notes & Calendar (`notes` app)

**`notes`** — personal notes tied to a calendar date (Shajara/journal).
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | FK → users | |
| note_date | DATE | the calendar day this note belongs to |
| title | VARCHAR(255) | nullable |
| body | TEXT | |
| linked_verse_id | FK → bible_verses, nullable | optional scripture link |
| created_at / updated_at | TIMESTAMPTZ | |

Index on `(user_id, note_date)`.

### 8. Favorites (`favorites` app)

**`favorites`** — polymorphic saved-items list.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | FK → users | |
| content_type | VARCHAR(20) | `verse` / `devotion` / `prayer` / `hymn` / `dictionary_term` |
| content_id | BIGINT | id in the relevant table (app-level FK, not DB-level) |
| created_at | TIMESTAMPTZ | |

Unique on `(user_id, content_type, content_id)`.

### 9. Subscriptions & Payments (`subscriptions` app)

**`subscription_plans`** — the plans offered (monthly/annual).
`id, code (monthly/annual), name_sw, name_en, price_amount, currency, duration_days, is_active, created_at`

**`subscriptions`** — a user's subscription record.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | FK → users | |
| plan_id | FK → subscription_plans | |
| status | VARCHAR(20) | `active` / `expired` / `cancelled` |
| start_date | DATE | |
| end_date | DATE | |
| auto_renew | BOOLEAN | default false |
| created_at / updated_at | TIMESTAMPTZ | |

**`payments`** — payment attempts/records for subscriptions.
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | FK → users | |
| subscription_id | FK → subscriptions, nullable | |
| amount | NUMERIC(12,2) | |
| currency | VARCHAR(3) | default `TZS` |
| provider | VARCHAR(30) | e.g. `mpesa`, `airtel_money`, `card` |
| provider_reference | VARCHAR(100) | nullable |
| status | VARCHAR(20) | `pending` / `success` / `failed` |
| paid_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | |

> Note: This `payments` table tracks **in-app subscription payments from
> end users** — it is separate from the client-project payment schedule
> (2,500,000 TZS + 1,000,000 TZS) tracked in `tracker/`.

### 10. Notifications (`notifications` app)

**`push_devices`** — registered device tokens per user.
`id, user_id FK, device_token, platform (ios/android), created_at`

**`notification_logs`** — record of sent push notifications.
`id, user_id FK nullable, title, body, notif_type, sent_at`

## Entity Relationships (summary)

- `users` 1—N `otp_verifications`, `notes`, `favorites`, `subscriptions`,
  `payments`, `push_devices`
- `bible_books` 1—N `bible_verses`
- `bible_versions` 1—N `bible_verses`
- `bible_verses` 1—1 `verse_of_the_day` (per date), 1—N `notes` (optional link)
- `prayer_categories` 1—N `prayers`
- `subscription_plans` 1—N `subscriptions` 1—N `payments`

See `architecture/ERD.md` for the diagram.
