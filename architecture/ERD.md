# M-Kristo App — Entity Relationship Diagram

Rendered from `architecture/database_schema.sql`. Paste into any Mermaid
viewer (GitHub renders this automatically) to visualize.

```mermaid
erDiagram
    USERS ||--o{ OTP_VERIFICATIONS : "verifies"
    USERS ||--o{ NOTES : "writes"
    USERS ||--o{ FAVORITES : "saves"
    USERS ||--o{ SUBSCRIPTIONS : "holds"
    USERS ||--o{ PAYMENTS : "makes"
    USERS ||--o{ PUSH_DEVICES : "registers"
    USERS ||--o{ NOTIFICATION_LOGS : "receives"

    BIBLE_BOOKS ||--o{ BIBLE_VERSES : "contains"
    BIBLE_VERSES ||--o| VERSE_OF_THE_DAY : "featured as"
    BIBLE_VERSES ||--o{ NOTES : "linked from"

    PRAYER_CATEGORIES ||--o{ PRAYERS : "groups"

    SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : "defines"
    SUBSCRIPTIONS ||--o{ PAYMENTS : "paid via"

    USERS {
        bigint id PK
        uuid public_id
        varchar phone_number
        varchar email
        varchar language_preference
        varchar theme_preference
    }
    BIBLE_BOOKS {
        bigint id PK
        varchar name_sw
        varchar name_en
        varchar testament
    }
    BIBLE_VERSES {
        bigint id PK
        bigint book_id FK
        smallint chapter
        smallint verse_number
        text text_sw
        text text_en
    }
    DEVOTIONS {
        bigint id PK
        varchar type
        date devotion_date
        boolean is_premium
    }
    PRAYER_CATEGORIES {
        bigint id PK
        varchar kind
    }
    PRAYERS {
        bigint id PK
        bigint category_id FK
        smallint day_number
    }
    HYMNS {
        bigint id PK
        int number
        boolean is_premium
    }
    DICTIONARY_TERMS {
        bigint id PK
        varchar term_sw
        varchar term_en
    }
    NOTES {
        bigint id PK
        bigint user_id FK
        date note_date
        bigint linked_verse_id FK
    }
    FAVORITES {
        bigint id PK
        bigint user_id FK
        varchar content_type
        bigint content_id
    }
    SUBSCRIPTION_PLANS {
        bigint id PK
        varchar code
        numeric price_amount
    }
    SUBSCRIPTIONS {
        bigint id PK
        bigint user_id FK
        bigint plan_id FK
        varchar status
    }
    PAYMENTS {
        bigint id PK
        bigint user_id FK
        bigint subscription_id FK
        varchar status
    }
```

`devotions`, `hymns`, and `dictionary_terms` have no FK relationships to
other content tables (they are looked up standalone, and referenced only
loosely by `favorites.content_id`), so they are omitted from the
relationship arrows above but included with their key columns for
completeness.
