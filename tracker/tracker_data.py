"""
tracker_data.py
----------------
Editable source data for the M-Kristo App progress & payment tracker.

Edit this file whenever a task status changes or a payment is received,
then rerun `generate_tracker.py` to refresh `M-Kristo-Tracker.xlsx`.
Do NOT hand-edit the generated .xlsx — it is overwritten on every run.

Keep this in sync with `progress.md` (what actually happened) and
`docs/M-Kristo-Development-Proposal.pdf` (the agreed budget/terms).
"""

from datetime import date

# --------------------------------------------------------------------------- #
#  Project info
# --------------------------------------------------------------------------- #
PROJECT_NAME = "M-Kristo App"
CLIENT = "Baraka"
DEVELOPER = "Philip Steven Chediel"
COMPANY = "BlueGrid Technologies"
CURRENCY = "TZS"

# --------------------------------------------------------------------------- #
#  Progress tracker
# --------------------------------------------------------------------------- #
# status: "Not Started" | "In Progress" | "Blocked" | "Done"
# percent_complete: 0-100
TASKS = [
    # --- Phase 1: Setup & Design ---
    dict(phase="1. Setup & Design", task="Project structure & repo setup",
         owner=DEVELOPER, status="Done", percent_complete=100,
         start_date=date(2026, 8, 14), due_date=date(2026, 8, 14),
         notes="architecture/, guide.md, progress.md created."),
    dict(phase="1. Setup & Design", task="PostgreSQL database schema design",
         owner=DEVELOPER, status="Done", percent_complete=100,
         start_date=date(2026, 8, 14), due_date=date(2026, 8, 16),
         notes="architecture/database_schema.sql + DATABASE_SCHEMA.md."),
    dict(phase="1. Setup & Design", task="UI/UX design (screens & flows)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),

    # --- Phase 2: Core Build ---
    dict(phase="2. Core Build", task="Django project & app scaffolding",
         owner=DEVELOPER, status="In Progress", percent_complete=10,
         start_date=date(2026, 8, 14), due_date=None, notes=""),
    dict(phase="2. Core Build", task="Auth: signup/login + phone OTP",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Social login (Google/Apple)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Bible module (Swahili + English)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Daily content: Neno la Leo, Tafakari, Somo",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Sala (common prayers)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Dictionary (biblical term lookup/translation)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Notes & calendar (Shajara)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="2. Core Build", task="Favorites",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),

    # --- Phase 3: Premium & Subscriptions ---
    dict(phase="3. Premium & Subscriptions", task="Novena (premium)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="3. Premium & Subscriptions", task="Tenzi / hymns (premium)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="3. Premium & Subscriptions", task="Subscription plans & premium gating",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),

    # --- Phase 4: Notifications & Sharing ---
    dict(phase="4. Notifications & Sharing", task="Push notifications (FCM/EAS)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="4. Notifications & Sharing", task="Native sharing (Android/iOS)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),

    # --- Phase 5: Testing & Hosting ---
    dict(phase="5. Testing & Hosting", task="QA / testing pass",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="5. Testing & Hosting", task="Backend hosting & deployment",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="5. Testing & Hosting", task="App store preparation (Android/iOS)",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
    dict(phase="5. Testing & Hosting", task="Source code & documentation handover",
         owner=DEVELOPER, status="Not Started", percent_complete=0,
         start_date=None, due_date=None, notes=""),
]

# --------------------------------------------------------------------------- #
#  Payment summary (client project cost — from the signed proposal)
# --------------------------------------------------------------------------- #
# status: "Pending" | "Paid"
PAYMENTS = [
    dict(milestone="1. Commencement",
         description="Payment to commence development, through to hosting.",
         amount=2_500_000, currency=CURRENCY,
         status="Pending", due_date=None, paid_date=None),
    dict(milestone="2. Completion",
         description="Final payment on completion and handover.",
         amount=1_000_000, currency=CURRENCY,
         status="Pending", due_date=None, paid_date=None),
]

TOTAL_PROJECT_COST = sum(p["amount"] for p in PAYMENTS)  # 3,500,000 TZS
