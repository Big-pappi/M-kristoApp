"""
generate_sdd.py
---------------
Generates the **System Design Document (SDD)** for the M-Kristo App as a
professionally formatted PDF.

Run:
    python generate_sdd.py
Output:
    M-Kristo-System-Design-Document.pdf

Author : Philip Steven Chediel
Company: BlueGrid Technologies  -  www.bluegrid.co.tz  -  +255 620 636 893
"""

from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

import mkristo_doc_style as B

OUTPUT = "M-Kristo-System-Design-Document.pdf"
DOC_TYPE = "System Design Document"
DOC_CODE = "BGT-MKR-SDD-001"
VERSION = "1.0"


# --------------------------------------------------------------------------- #
#  Lightweight diagram helpers (drawn with tables, no external assets)
# --------------------------------------------------------------------------- #
def _box(text, bg, fg=colors.white, width=5.0 * cm, height=1.2 * cm,
         font_size=9):
    t = Table([[Paragraph(
        f"<para align='center'><b>{text}</b></para>",
        B.ParagraphStyle("bx", fontName="Helvetica-Bold",
                         fontSize=font_size, leading=font_size + 2,
                         textColor=fg))]],
        colWidths=[width], rowHeights=[height])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.white),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    return t


def architecture_diagram():
    """A simple layered architecture diagram built from nested tables."""
    def layer(title, boxes, bg):
        inner = Table([boxes], colWidths=[5.1 * cm] * len(boxes))
        inner.setStyle(TableStyle([
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        header = Paragraph(
            f"<para align='center'><b>{title}</b></para>",
            B.ParagraphStyle("lh", fontName="Helvetica-Bold", fontSize=9,
                             textColor=B.TEAL_DARK))
        wrap = Table([[header], [inner]], colWidths=[16.0 * cm])
        wrap.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg),
            ("BOX", (0, 0), (-1, -1), 0.6, B.LINE),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        return wrap

    arrow = Paragraph(
        "<para align='center'>&#9660;&nbsp;&nbsp;HTTPS / REST (JSON)"
        "&nbsp;&nbsp;&#9660;</para>",
        B.ParagraphStyle("ar", fontName="Helvetica", fontSize=8,
                         textColor=B.MUTED))

    presentation = layer(
        "Presentation Layer - React Native (Expo)",
        [_box("Bible / Novena", B.PURPLE),
         _box("Tenzi / Sala", B.PURPLE),
         _box("Favourites / Profile", B.PURPLE)],
        B.LIGHT)
    backend = layer(
        "Application Layer - Django REST API",
        [_box("Auth &amp; OTP", B.TEAL),
         _box("Content &amp; Notes", B.TEAL),
         _box("Subscriptions", B.TEAL)],
        B.LIGHT)
    data = layer(
        "Data &amp; Services",
        [_box("PostgreSQL", B.TEAL_DARK),
         _box("SMS / Payment", B.TEAL_DARK),
         _box("Firebase / EAS", B.TEAL_DARK)],
        B.LIGHT)

    stack = Table([[presentation], [arrow], [backend], [arrow], [data]],
                  colWidths=[16.0 * cm])
    stack.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return stack


def build_story(styles):
    S = []
    P = lambda t, s="Body": Paragraph(t, styles[s])  # noqa: E731

    # ----- Cover -----
    S += B.cover_story(styles, DOC_TYPE, DOC_CODE, VERSION)
    S.append(NextPageTemplate("main"))
    S.append(PageBreak())

    # ----- Document control -----
    S.append(P("Document Control", "H1"))
    S.append(B.data_table(
        styles, ["Field", "Detail"],
        [
            ["Project", "M-Kristo App (m-kristo.com)"],
            ["Document", "System Design Document (SDD)"],
            ["Document code", DOC_CODE],
            ["Version", VERSION],
            ["Date", B.DOC_DATE],
            ["Author", B.AUTHOR],
            ["Organisation", B.COMPANY],
            ["Contact", f"{B.WEBSITE} | {B.PHONE}"],
            ["Related", "BGT-MKR-SRS-001 (System Requirements Specification)"],
        ],
        [4.5 * cm, 11.5 * cm]))
    S.append(Spacer(1, 0.4 * cm))
    S.append(P("Revision History", "H2"))
    S.append(B.data_table(
        styles, ["Version", "Date", "Author", "Description"],
        [["1.0", B.DOC_DATE, B.AUTHOR, "Initial system design baseline."]],
        [2.2 * cm, 3.2 * cm, 4.6 * cm, 6.0 * cm]))
    S.append(PageBreak())

    # ----- TOC -----
    S.append(P("Table of Contents", "H1"))
    S.append(B.toc_table(styles, [
        ("1.", "Introduction"),
        ("2.", "System Architecture"),
        ("3.", "Technology Stack"),
        ("4.", "Module Design"),
        ("5.", "Data Design"),
        ("6.", "API Design"),
        ("7.", "Authentication &amp; Security Design"),
        ("8.", "Notifications, Subscriptions &amp; Sharing"),
        ("9.", "Deployment &amp; Environments"),
        ("10.", "Non-Functional Design Considerations"),
    ]))
    S.append(PageBreak())

    # ===== 1. Introduction =====
    S.append(P("1. Introduction", "H1"))
    S.append(P("1.1 Purpose", "H2"))
    S.append(P(
        "This System Design Document (SDD) describes the software architecture "
        "and detailed design of the <b>M-Kristo App</b>. It translates the "
        "requirements in the SRS (BGT-MKR-SRS-001) into a technical blueprint "
        "for implementation."))
    S.append(P("1.2 Scope", "H2"))
    S.append(P(
        "The design covers the React Native (Expo) mobile client, the Django "
        "backend, the data model, API contracts, security, notifications, "
        "subscription gating, sharing and deployment."))
    S.append(P("1.3 Design Goals", "H2"))
    S += B.bullets(styles, [
        "Modern, responsive, bilingual (Swahili/English) mobile experience.",
        "Clear separation between presentation, application and data layers.",
        "Secure authentication with phone (OTP) verification and social login.",
        "Reliable offline reading and fast content delivery.",
        "Clean subscription gating for premium content.",
        "Maintainable, testable, and CI/CD-friendly codebase.",
    ])
    S.append(PageBreak())

    # ===== 2. Architecture =====
    S.append(P("2. System Architecture", "H1"))
    S.append(P("2.1 Architectural Overview", "H2"))
    S.append(P(
        "M-Kristo follows a classic three-tier client-server architecture. "
        "The mobile client renders the UI and caches content for offline use; "
        "the Django backend exposes REST APIs and enforces business rules; a "
        "data and services tier holds persistent data and integrates external "
        "providers (SMS, payments, push)."))
    S.append(Spacer(1, 0.3 * cm))
    S.append(architecture_diagram())
    S.append(Spacer(1, 0.4 * cm))
    S.append(P("2.2 Architectural Style", "H2"))
    S += B.bullets(styles, [
        "Client: component-based React Native with feature modules and a "
        "shared design system.",
        "Backend: Django with a REST API layer, service classes and an "
        "authentication/subscription middleware.",
        "Stateless API using token-based authentication so the backend can "
        "scale horizontally.",
    ])
    S.append(PageBreak())

    # ===== 3. Technology Stack =====
    S.append(P("3. Technology Stack", "H1"))
    S.append(B.data_table(
        styles, ["Layer", "Technology", "Notes"],
        [
            ["Mobile client", "React Native (Expo)",
             "Single codebase for Android and iOS; EAS build pipeline."],
            ["Backend", "Django (Python)",
             "REST API, business logic, admin back-office."],
            ["Database", "PostgreSQL",
             "Relational store for users, content, notes and subscriptions."],
            ["Auth", "Token / social providers",
             "Email+password, Google, Apple; SMS OTP for phone verification."],
            ["Push", "Firebase Cloud Messaging or Expo (EAS) Push",
             "Final choice confirmed in design; both supported patterns."],
            ["Payments", "Third-party payment provider",
             "Monthly and annual subscription billing."],
            ["Localization", "i18n (Swahili default, English)",
             "Runtime language switch, persisted per user."],
        ],
        [3.2 * cm, 5.2 * cm, 7.6 * cm]))
    S.append(PageBreak())

    # ===== 4. Module Design =====
    S.append(P("4. Module Design", "H1"))
    S.append(P(
        "The client is organised into feature modules matching the navigation: "
        "Bible, Novena, Tenzi, Sala, Favourites and Profile, plus supporting "
        "modules for Auth, Notes, Daily Content and Subscription."))
    S.append(B.data_table(
        styles, ["Module", "Responsibility", "Key requirements"],
        [
            ["Auth", "Signup, OTP verification, login, social login, logout, "
                     "token handling.", "FR-1..FR-6"],
            ["Bible", "Book/chapter/verse navigation, search, offline cache, "
                      "reading settings.", "FR-7..FR-10"],
            ["Daily Content", "Neno la Leo, Tafakari, Somo, Sala and reminders.",
             "FR-11..FR-13"],
            ["Premium", "Shajara, Tenzi, Novena with subscription gating.",
             "FR-14..FR-17"],
            ["Notes", "Create/edit/delete notes; link to scripture.",
             "FR-18..FR-19"],
            ["Favourites", "Save, list and remove favourite items.",
             "FR-20..FR-21"],
            ["Profile", "View/edit info, picture, password, theme, language.",
             "FR-22..FR-26"],
            ["Sharing", "Native Android/iOS share sheet.", "FR-28"],
            ["Notifications", "Register device, deliver daily/reminder pushes.",
             "FR-29"],
            ["Subscription", "Plan selection, purchase, status, gating.",
             "SR-1..SR-6"],
        ],
        [3.0 * cm, 9.4 * cm, 3.6 * cm]))
    S.append(PageBreak())

    # ===== 5. Data Design =====
    S.append(P("5. Data Design", "H1"))
    S.append(P("5.1 Core Entities", "H2"))
    S.append(B.data_table(
        styles, ["Entity", "Key fields", "Description"],
        [
            ["User", "id, name, email, phone, phone_verified, "
                     "profile_picture, language, theme, password_hash",
             "Registered application user."],
            ["Subscription", "id, user_id, plan (monthly/annual), status, "
                             "start_date, end_date",
             "A user's subscription record."],
            ["Content", "id, type (bible/neno/tafakari/somo/sala/"
                        "shajara/tenzi/novena), language, title, body, "
                        "publish_date, is_premium",
             "All readable content items."],
            ["Note", "id, user_id, content_ref, text, created_at, updated_at",
             "A user's personal note."],
            ["Favourite", "id, user_id, content_ref, created_at",
             "A saved item for a user."],
            ["Reminder", "id, user_id, time, type, enabled",
             "Prayer/daily reminder configuration."],
            ["Device", "id, user_id, push_token, platform",
             "Registered device for push notifications."],
        ],
        [2.6 * cm, 7.6 * cm, 5.8 * cm]))
    S.append(Spacer(1, 0.3 * cm))
    S.append(P("5.2 Relationships", "H2"))
    S += B.bullets(styles, [
        "A User has one active Subscription (0..1) and a history of many.",
        "A User has many Notes, Favourites, Reminders and Devices.",
        "A Favourite and a Note reference a Content item.",
        "Content flagged <i>is_premium</i> is served only to active "
        "subscribers.",
    ])
    S.append(PageBreak())

    # ===== 6. API Design =====
    S.append(P("6. API Design", "H1"))
    S.append(P(
        "The backend exposes versioned REST endpoints under <b>/api/v1/</b>. "
        "All responses are JSON and protected endpoints require a bearer "
        "token.", "Body"))
    S.append(B.data_table(
        styles, ["Method &amp; path", "Purpose", "Auth"],
        [
            ["POST /auth/signup", "Create account.", "No"],
            ["POST /auth/verify-otp", "Verify phone with OTP code.", "No"],
            ["POST /auth/login", "Email/password login.", "No"],
            ["POST /auth/social", "Google/Apple login.", "No"],
            ["POST /auth/password-reset", "Request/confirm reset.", "No"],
            ["GET /bible", "List books/chapters; read verses.", "Yes"],
            ["GET /daily", "Neno la Leo, Tafakari, Somo, Sala.", "Yes"],
            ["GET /premium/{type}", "Shajara, Tenzi, Novena.", "Yes*"],
            ["GET/POST /notes", "List/create notes.", "Yes"],
            ["PUT/DELETE /notes/{id}", "Edit/delete a note.", "Yes"],
            ["GET/POST /favourites", "List/add favourites.", "Yes"],
            ["DELETE /favourites/{id}", "Remove a favourite.", "Yes"],
            ["GET/PUT /profile", "View/update profile &amp; settings.", "Yes"],
            ["GET/POST /subscription", "View/purchase a plan.", "Yes"],
            ["POST /devices", "Register push token.", "Yes"],
        ],
        [5.4 * cm, 8.4 * cm, 2.2 * cm]))
    S.append(P("* Premium endpoints additionally require an active "
               "subscription.", "Small"))
    S.append(PageBreak())

    # ===== 7. Security =====
    S.append(P("7. Authentication &amp; Security Design", "H1"))
    S.append(P("7.1 Signup &amp; Phone Verification Flow", "H2"))
    S += B.bullets(styles, [
        "User submits signup details to <b>/auth/signup</b>.",
        "Backend creates a pending account and sends an OTP via the SMS "
        "gateway.",
        "User submits the code to <b>/auth/verify-otp</b>; on success the "
        "account is activated and tokens are issued.",
        "OTP codes are short-lived, single-use and rate-limited.",
    ])
    S.append(P("7.2 Login &amp; Sessions", "H2"))
    S += B.bullets(styles, [
        "Email/password and social (Google, Apple) login issue access and "
        "refresh tokens.",
        "Tokens are stored in secure device storage (Keychain/Keystore).",
        "Refresh tokens rotate; access tokens are short-lived.",
    ])
    S.append(P("7.3 Security Controls", "H2"))
    S += B.bullets(styles, [
        "All traffic over HTTPS/TLS.",
        "Passwords hashed with a strong algorithm (Django default).",
        "Server-side validation of subscription status before serving "
        "premium content.",
        "Input validation and rate limiting on authentication endpoints.",
    ])
    S.append(PageBreak())

    # ===== 8. Notifications / Subscriptions / Sharing =====
    S.append(P("8. Notifications, Subscriptions &amp; Sharing", "H1"))
    S.append(P("8.1 Push Notifications", "H2"))
    S.append(P(
        "Devices register a push token on login. The backend schedules daily "
        "content and reminder notifications and dispatches them through "
        "<b>Firebase Cloud Messaging</b> or <b>Expo (EAS) Push</b>. Reminder "
        "times set by the user drive per-user scheduling."))
    S.append(P("8.2 Subscription Gating", "H2"))
    S.append(P(
        "When a user opens premium content the client checks cached "
        "subscription status and the backend re-validates on the protected "
        "endpoint. Non-subscribers see a locked state and a subscribe prompt "
        "offering the monthly or annual plan. Access is revoked automatically "
        "when a subscription lapses."))
    S.append(P("8.3 App Sharing", "H2"))
    S.append(P(
        "Sharing uses the native share module so the user can pick any target "
        "app (WhatsApp, SMS, email, etc.) through the standard Android and iOS "
        "share sheets, sharing an install link to the app."))
    S.append(PageBreak())

    # ===== 9. Deployment =====
    S.append(P("9. Deployment &amp; Environments", "H1"))
    S.append(B.data_table(
        styles, ["Concern", "Approach"],
        [
            ["Mobile builds", "Expo EAS build and submit pipelines for Google "
                              "Play and the Apple App Store."],
            ["Backend hosting", "Django served behind HTTPS on a Linux "
                                "environment with a managed PostgreSQL "
                                "database."],
            ["Environments", "Development, staging and production with "
                            "separate configuration and secrets."],
            ["CI/CD", "Automated builds and tests; over-the-air updates for "
                     "the client where applicable."],
            ["Monitoring", "Application logging, crash reporting and uptime "
                          "monitoring."],
        ],
        [4.0 * cm, 12.0 * cm]))
    S.append(PageBreak())

    # ===== 10. NFR design =====
    S.append(P("10. Non-Functional Design Considerations", "H1"))
    S += B.bullets(styles, [
        "<b>Performance:</b> content caching and pagination keep screens fast "
        "on low-bandwidth networks.",
        "<b>Offline:</b> Bible and saved content sync locally for offline "
        "reading.",
        "<b>Scalability:</b> stateless APIs and connection pooling support "
        "horizontal scaling.",
        "<b>Localization:</b> centralised i18n resources with Swahili default "
        "and English support.",
        "<b>Accessibility:</b> scalable text, sufficient contrast and clear "
        "navigation.",
        "<b>Maintainability:</b> modular features, documented APIs and "
        "automated pipelines.",
    ])
    S.append(Spacer(1, 0.6 * cm))
    S += B.hr()
    S.append(P(
        f"Prepared by {B.AUTHOR}, {B.COMPANY} &mdash; {B.WEBSITE} &mdash; "
        f"{B.PHONE}.", "Small"))
    return S


def main():
    doc = BaseDocTemplate(
        OUTPUT, pagesize=B.PAGE_SIZE,
        leftMargin=B.MARGIN, rightMargin=B.MARGIN,
        topMargin=B.MARGIN, bottomMargin=B.MARGIN,
        title=f"{B.APP_NAME} - {DOC_TYPE}", author=B.AUTHOR)

    frame = Frame(B.MARGIN, B.MARGIN,
                  B.PAGE_SIZE[0] - 2 * B.MARGIN,
                  B.PAGE_SIZE[1] - 2 * B.MARGIN - 0.6 * cm,
                  id="body")
    cover_frame = Frame(0, 0, B.PAGE_SIZE[0], B.PAGE_SIZE[1],
                        leftPadding=B.MARGIN, rightPadding=B.MARGIN,
                        topPadding=B.MARGIN, bottomPadding=B.MARGIN,
                        id="cover")

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame],
                     onPage=B.make_cover_decorator()),
        PageTemplate(id="main", frames=[frame],
                     onPage=B.make_page_decorator(DOC_TYPE)),
    ])

    styles = B.build_styles()
    doc.build(build_story(styles))
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    main()
