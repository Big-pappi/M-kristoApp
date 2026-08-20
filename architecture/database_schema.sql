-- ============================================================================
-- M-Kristo App — PostgreSQL Schema
-- ----------------------------------------------------------------------------
-- Matches architecture/DATABASE_SCHEMA.md. Update both files together and
-- log the change in progress.md.
--
-- Apply with:
--   createdb mkristo
--   psql -d mkristo -f architecture/database_schema.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. ACCOUNTS
-- ----------------------------------------------------------------------------

CREATE TABLE users (
    id                    BIGSERIAL PRIMARY KEY,
    public_id             UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    phone_number          VARCHAR(20) NOT NULL UNIQUE,
    email                 VARCHAR(255) UNIQUE,
    password_hash         VARCHAR(255),
    full_name             VARCHAR(150) NOT NULL,
    profile_picture_url   TEXT,
    language_preference   VARCHAR(2) NOT NULL DEFAULT 'sw'
                              CHECK (language_preference IN ('sw', 'en')),
    theme_preference      VARCHAR(10) NOT NULL DEFAULT 'light'
                              CHECK (theme_preference IN ('light', 'dark')),
    is_phone_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    social_provider       VARCHAR(20) CHECK (social_provider IN ('google', 'apple')),
    social_id             VARCHAR(255),
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff              BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at         TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE otp_verifications (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT REFERENCES users(id) ON DELETE CASCADE,
    phone_number   VARCHAR(20) NOT NULL,
    code           VARCHAR(10) NOT NULL,
    purpose        VARCHAR(20) NOT NULL
                       CHECK (purpose IN ('signup', 'login', 'reset_password')),
    expires_at     TIMESTAMPTZ NOT NULL,
    is_used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_otp_phone ON otp_verifications(phone_number);

-- ----------------------------------------------------------------------------
-- 2. BIBLE
-- ----------------------------------------------------------------------------

CREATE TABLE bible_books (
    id             BIGSERIAL PRIMARY KEY,
    name_sw        VARCHAR(100) NOT NULL,
    name_en        VARCHAR(100) NOT NULL,
    testament      VARCHAR(3) NOT NULL CHECK (testament IN ('old', 'new')),
    book_order     SMALLINT NOT NULL UNIQUE,
    chapter_count  SMALLINT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bible_versions (
    id             BIGSERIAL PRIMARY KEY,
    code           VARCHAR(10) NOT NULL UNIQUE,
    name_sw        VARCHAR(100) NOT NULL,
    name_en        VARCHAR(100) NOT NULL,
    language       VARCHAR(2) NOT NULL CHECK (language IN ('sw', 'en')),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bible_verses (
    id            BIGSERIAL PRIMARY KEY,
    book_id       BIGINT NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    version_id    BIGINT NOT NULL REFERENCES bible_versions(id) ON DELETE CASCADE,
    chapter       SMALLINT NOT NULL,
    verse_number  SMALLINT NOT NULL,
    text_sw       TEXT,
    text_en       TEXT,
    audio_url_sw  TEXT,
    audio_url_en  TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (book_id, version_id, chapter, verse_number)
);

CREATE INDEX idx_verses_book_chapter ON bible_verses(book_id, chapter);
CREATE INDEX idx_verses_version ON bible_verses(version_id);

CREATE TABLE verse_of_the_day (
    id              BIGSERIAL PRIMARY KEY,
    verse_id        BIGINT NOT NULL REFERENCES bible_verses(id) ON DELETE RESTRICT,
    display_date    DATE NOT NULL UNIQUE,
    short_text_sw   TEXT NOT NULL,
    short_text_en   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. DAILY DEVOTIONS
-- ----------------------------------------------------------------------------

CREATE TABLE devotions (
    id                    BIGSERIAL PRIMARY KEY,
    type                  VARCHAR(20) NOT NULL
                              CHECK (type IN ('neno_la_leo', 'tafakari', 'somo')),
    devotion_date         DATE NOT NULL,
    title_sw              VARCHAR(255) NOT NULL,
    title_en              VARCHAR(255),
    body_sw               TEXT NOT NULL,
    body_en               TEXT,
    scripture_reference   VARCHAR(100),
    is_premium            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (type, devotion_date)
);

CREATE INDEX idx_devotions_date ON devotions(devotion_date);

-- ----------------------------------------------------------------------------
-- 4. PRAYERS (Sala, Novena)
-- ----------------------------------------------------------------------------

CREATE TABLE prayer_categories (
    id            BIGSERIAL PRIMARY KEY,
    name_sw       VARCHAR(150) NOT NULL,
    name_en       VARCHAR(150),
    kind          VARCHAR(10) NOT NULL CHECK (kind IN ('sala', 'novena')),
    is_premium    BOOLEAN NOT NULL DEFAULT FALSE,
    order_index   INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE prayers (
    id            BIGSERIAL PRIMARY KEY,
    category_id   BIGINT NOT NULL REFERENCES prayer_categories(id) ON DELETE CASCADE,
    day_number    SMALLINT,
    title_sw      VARCHAR(255) NOT NULL,
    title_en      VARCHAR(255),
    body_sw       TEXT NOT NULL,
    body_en       TEXT,
    order_index   INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prayers_category ON prayers(category_id);

-- ----------------------------------------------------------------------------
-- 5. HYMNS (Tenzi)
-- ----------------------------------------------------------------------------

CREATE TABLE hymns (
    id            BIGSERIAL PRIMARY KEY,
    number        INT NOT NULL UNIQUE,
    title_sw      VARCHAR(255) NOT NULL,
    title_en      VARCHAR(255),
    lyrics_sw     TEXT NOT NULL,
    lyrics_en     TEXT,
    is_premium    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. DICTIONARY
-- ----------------------------------------------------------------------------

CREATE TABLE dictionary_terms (
    id                        BIGSERIAL PRIMARY KEY,
    term_sw                   VARCHAR(150) NOT NULL,
    term_en                   VARCHAR(150),
    definition_sw             TEXT NOT NULL,
    definition_en             TEXT,
    related_scripture_reference VARCHAR(100),
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dictionary_term_sw ON dictionary_terms(term_sw);
CREATE INDEX idx_dictionary_term_en ON dictionary_terms(term_en);

-- ----------------------------------------------------------------------------
-- 7. NOTES & CALENDAR (Shajara)
-- ----------------------------------------------------------------------------

CREATE TABLE notes (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_date         DATE NOT NULL,
    title             VARCHAR(255),
    body              TEXT NOT NULL,
    linked_verse_id   BIGINT REFERENCES bible_verses(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notes_user_date ON notes(user_id, note_date);

-- ----------------------------------------------------------------------------
-- 8. FAVORITES
-- ----------------------------------------------------------------------------

CREATE TABLE favorites (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type  VARCHAR(20) NOT NULL
                      CHECK (content_type IN ('verse', 'devotion', 'prayer', 'hymn', 'dictionary_term')),
    content_id    BIGINT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, content_type, content_id)
);

-- ----------------------------------------------------------------------------
-- 9. SUBSCRIPTIONS & PAYMENTS (in-app, end-user)
-- ----------------------------------------------------------------------------

CREATE TABLE subscription_plans (
    id             BIGSERIAL PRIMARY KEY,
    code           VARCHAR(20) NOT NULL UNIQUE CHECK (code IN ('monthly', 'annual')),
    name_sw        VARCHAR(100) NOT NULL,
    name_en        VARCHAR(100),
    price_amount   NUMERIC(12,2) NOT NULL,
    currency       VARCHAR(3) NOT NULL DEFAULT 'TZS',
    duration_days  INT NOT NULL,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id       BIGINT NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status        VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'expired', 'cancelled')),
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    auto_renew    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

CREATE TABLE payments (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id      BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount               NUMERIC(12,2) NOT NULL,
    currency             VARCHAR(3) NOT NULL DEFAULT 'TZS',
    provider             VARCHAR(30) NOT NULL,
    provider_reference   VARCHAR(100),
    status               VARCHAR(20) NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'success', 'failed')),
    paid_at              TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_user ON payments(user_id);

-- ----------------------------------------------------------------------------
-- 10. NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE push_devices (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token   VARCHAR(255) NOT NULL UNIQUE,
    platform       VARCHAR(10) NOT NULL CHECK (platform IN ('ios', 'android')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_logs (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title        VARCHAR(255) NOT NULL,
    body         TEXT NOT NULL,
    notif_type   VARCHAR(30),
    sent_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- SAMPLE DATA FOR BIBLE VERSIONS
-- ============================================================================

-- Insert the requested Bible versions (NIV, KJV, NLT, LSB, ESV, CPDV)
-- in both English and Swahili where available
INSERT INTO bible_versions (code, name_sw, name_en, language, is_active) VALUES
('NIV', 'NIV - New International Version', 'NIV - New International Version', 'en', TRUE),
('KJV', 'KJV - King James Version', 'KJV - King James Version', 'en', TRUE),
('NLT', 'NLT - New Living Translation', 'NLT - New Living Translation', 'en', TRUE),
('LSB', 'LSB - Legacy Standard Bible', 'LSB - Legacy Standard Bible', 'en', TRUE),
('ESV', 'ESV - English Standard Version', 'ESV - English Standard Version', 'en', TRUE),
('CPDV', 'CPDV - Catholic Public Domain Version', 'CPDV - Catholic Public Domain Version', 'en', TRUE),
('SW_NIV', 'Tafsiri ya Kimataifa Mpya (NIV)', 'New International Version (Swahili)', 'sw', TRUE),
('SW_KJV', 'Tafsiri ya Kifaransa ya Kale (KJV)', 'King James Version (Swahili)', 'sw', TRUE),
('SW_NLT', 'Tafsiri ya Mpya ya Kimaisha (NLT)', 'New Living Translation (Swahili)', 'sw', TRUE),
('SW_LSB', 'Tafsiri ya Kisasa ya Legasi (LSB)', 'Legacy Standard Bible (Swahili)', 'sw', TRUE),
('SW_ESV', 'Tafsiri ya Kiingereza ya Kisasa (ESV)', 'English Standard Version (Swahili)', 'sw', TRUE),
('SW_CPDV', 'Tafsiri ya Kikatoliki ya Umma (CPDV)', 'Catholic Public Domain Version (Swahili)', 'sw', TRUE);

-- ============================================================================
-- End of schema
-- ============================================================================
