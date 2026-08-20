"""
generate_srs.py
---------------
Generates the **System Requirements Specification (SRS)** document for the
M-Kristo App as a professionally formatted PDF.

Run:
    python generate_srs.py
Output:
    M-Kristo-System-Requirements-Specification.pdf

Author : Philip Steven Chediel
Company: BlueGrid Technologies  -  www.bluegrid.co.tz  -  +255 620 636 893
"""

from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

import mkristo_doc_style as B

OUTPUT = "M-Kristo-System-Requirements-Specification.pdf"
DOC_TYPE = "System Requirements Specification"
DOC_CODE = "BGT-MKR-SRS-001"
VERSION = "1.0"


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
        styles,
        ["Field", "Detail"],
        [
            ["Project", "M-Kristo App (m-kristo.com)"],
            ["Document", "System Requirements Specification (SRS)"],
            ["Document code", DOC_CODE],
            ["Version", VERSION],
            ["Date", B.DOC_DATE],
            ["Author", B.AUTHOR],
            ["Organisation", B.COMPANY],
            ["Contact", f"{B.WEBSITE} | {B.PHONE}"],
            ["Status", "Draft for Review"],
        ],
        [4.5 * cm, 11.5 * cm],
    ))
    S.append(Spacer(1, 0.4 * cm))
    S.append(P("Revision History", "H2"))
    S.append(B.data_table(
        styles,
        ["Version", "Date", "Author", "Description"],
        [["1.0", B.DOC_DATE, B.AUTHOR, "Initial baseline of requirements."]],
        [2.2 * cm, 3.2 * cm, 4.6 * cm, 6.0 * cm],
    ))
    S.append(PageBreak())

    # ----- Table of contents -----
    S.append(P("Table of Contents", "H1"))
    S.append(B.toc_table(styles, [
        ("1.", "Introduction"),
        ("2.", "Overall Description"),
        ("3.", "Functional Requirements"),
        ("4.", "External Interface Requirements"),
        ("5.", "Non-Functional Requirements"),
        ("6.", "Subscription &amp; Monetisation Requirements"),
        ("7.", "Assumptions, Constraints &amp; Dependencies"),
        ("8.", "Acceptance Criteria"),
    ]))
    S.append(PageBreak())

    # ===== 1. Introduction =====
    S.append(P("1. Introduction", "H1"))

    S.append(P("1.1 Purpose", "H2"))
    S.append(P(
        "This System Requirements Specification (SRS) defines the functional "
        "and non-functional requirements for the <b>M-Kristo App</b>, a mobile "
        "daily-devotions platform serving Swahili and English speaking "
        "believers in East Africa and worldwide. It is the reference document "
        "for design, development, testing and acceptance of the application."))

    S.append(P("1.2 Scope", "H2"))
    S.append(P(
        "M-Kristo is a cross-platform mobile application (Android and iOS) that "
        "delivers a free Bible, daily devotions and prayers, hymns and spiritual "
        "resources, with an optional paid subscription that unlocks advanced "
        "content. The product provides account creation with phone verification, "
        "multi-provider login, personal note taking, favourites, a bilingual "
        "interface (English and Swahili), configurable settings, push "
        "notifications and native app sharing."))

    S.append(P("1.3 Definitions, Acronyms and Abbreviations", "H2"))
    S.append(B.data_table(
        styles,
        ["Term", "Meaning"],
        [
            ["Neno la Leo", "Word of the Day - the daily scripture/devotion feed."],
            ["Tafakari", "Reflection - the meditative reading tied to Neno la Leo."],
            ["Somo", "Reading / lesson - the scripture reading of the day."],
            ["Sala", "Prayer - prayer content and prayer reminders."],
            ["Novena", "A structured nine-day sequence of prayers."],
            ["Shajara", "Devotional diary / spiritual journal (premium content)."],
            ["Tenzi", "Hymns and worship songs (premium content)."],
            ["Favorites", "Items the user has saved for quick access."],
            ["OTP", "One-Time Password sent by SMS for phone verification."],
            ["SRS", "System Requirements Specification (this document)."],
            ["SDD", "System Design Document (companion document)."],
        ],
        [4.0 * cm, 12.0 * cm],
    ))

    S.append(P("1.4 Intended Audience", "H2"))
    S += B.bullets(styles, [
        "Product owner and stakeholders of M-Kristo.",
        "Development and QA engineers at BlueGrid Technologies.",
        "UI/UX designers producing the mobile interface.",
        "Project reviewers and future maintainers.",
    ])

    S.append(P("1.5 Technology Baseline", "H2"))
    S.append(P(
        "The client application is built with <b>React Native (Expo)</b> for "
        "Android and iOS. The backend is built with <b>Django</b>. Push "
        "notifications are delivered through <b>Firebase Cloud Messaging</b> or "
        "<b>Expo (EAS) Push Notifications</b> - the specific mechanism is "
        "confirmed during the design phase."))
    S.append(PageBreak())

    # ===== 2. Overall Description =====
    S.append(P("2. Overall Description", "H1"))

    S.append(P("2.1 Product Perspective", "H2"))
    S.append(P(
        "M-Kristo is a new, self-contained product. The mobile client "
        "communicates with the Django backend over secure HTTPS APIs. The "
        "backend integrates with an SMS gateway (phone verification), a payment "
        "provider (subscriptions) and a push-notification service."))

    S.append(P("2.2 Product Functions (Summary)", "H2"))
    S += B.bullets(styles, [
        "Read the Bible in English and Swahili.",
        "Access daily content: Neno la Leo, Tafakari, Somo and Sala.",
        "Set and receive prayer (Sala) reminders.",
        "Read premium content: Shajara, Tenzi and Novena.",
        "Create, edit and manage personal notes.",
        "Save and browse favourites.",
        "Sign up, verify phone number by OTP, and log in "
        "(email/password and social providers such as Google and Apple).",
        "Manage profile: personal info, profile picture, password, theme and "
        "language.",
        "Subscribe monthly or annually to unlock advanced features.",
        "Share the app to others through native Android and iOS share sheets.",
        "Receive push notifications for daily content and reminders.",
    ])

    S.append(P("2.3 User Classes and Characteristics", "H2"))
    S.append(B.data_table(
        styles,
        ["User class", "Description &amp; access"],
        [
            ["Guest", "Not signed in. May view onboarding/marketing only; "
                      "must sign up to use the app."],
            ["Free user", "Registered and verified. Access to Bible, daily "
                          "content, Sala, notes and favourites."],
            ["Subscriber", "Free features plus premium content (Shajara, "
                           "Tenzi, Novena) via monthly/annual subscription."],
            ["Administrator", "Back-office role that manages content, users "
                              "and subscriptions (web/admin, out of app scope)."],
        ],
        [3.2 * cm, 12.8 * cm],
    ))

    S.append(P("2.4 Operating Environment", "H2"))
    S += B.bullets(styles, [
        "Android 8.0+ and iOS 14+ mobile devices.",
        "Intermittent connectivity typical of East African networks; core "
        "reading should tolerate offline/low-bandwidth conditions.",
        "Backend hosted on a Linux server environment running Django.",
    ])

    S.append(P("2.5 Localization", "H2"))
    S.append(P(
        "The application is bilingual. The default and primary language is "
        "<b>Swahili</b>, with full <b>English</b> support. The user may switch "
        "language at any time from settings; the selection persists across "
        "sessions and applies to navigation, content labels and notifications."))
    S.append(PageBreak())

    # ===== 3. Functional Requirements =====
    S.append(P("3. Functional Requirements", "H1"))
    S.append(P(
        "Each requirement has a unique identifier (FR-x) and a priority: "
        "<b>M</b> = Must have, <b>S</b> = Should have, <b>C</b> = Could have.",
        "Small"))

    def fr_block(title, rows):
        S.append(P(title, "H2"))
        S.append(B.data_table(
            styles, ["ID", "Requirement", "Pri."],
            rows, [2.0 * cm, 12.4 * cm, 1.6 * cm]))

    fr_block("3.1 Authentication &amp; Account", [
        ["FR-1", "The system shall allow a first-time user to sign up with the "
                 "required profile details.", "M"],
        ["FR-2", "The system shall verify the user's phone number via an OTP "
                 "code sent by SMS before the account is activated.", "M"],
        ["FR-3", "The system shall allow the user to log in with email and "
                 "password.", "M"],
        ["FR-4", "The system shall support social login providers including "
                 "Google and Apple (and others as configured).", "S"],
        ["FR-5", "The system shall allow the user to reset a forgotten "
                 "password.", "M"],
        ["FR-6", "The system shall keep the user logged in across sessions "
                 "using secure tokens until logout.", "M"],
    ])

    fr_block("3.2 Bible &amp; Reading", [
        ["FR-7", "The system shall provide the full Bible for reading in both "
                 "English and Swahili.", "M"],
        ["FR-8", "The system shall let the user navigate by book, chapter and "
                 "verse and search the text.", "M"],
        ["FR-9", "The system shall allow the user to adjust reading font size "
                 "and theme.", "S"],
        ["FR-10", "The system shall allow core Bible reading to work offline "
                  "once content is cached.", "S"],
    ])

    fr_block("3.3 Daily Content (Neno la Leo, Tafakari, Somo, Sala)", [
        ["FR-11", "The system shall present the daily Word (Neno la Leo) with "
                  "its Reflection (Tafakari) and Reading (Somo).", "M"],
        ["FR-12", "The system shall provide daily prayers (Sala).", "M"],
        ["FR-13", "The system shall let the user set prayer/reminder times and "
                  "receive reminders as notifications.", "M"],
    ])

    fr_block("3.4 Premium Content (Shajara, Tenzi, Novena)", [
        ["FR-14", "The system shall provide Shajara (devotional diary) to "
                  "active subscribers only.", "M"],
        ["FR-15", "The system shall provide Tenzi (hymns/songs) to active "
                  "subscribers only.", "M"],
        ["FR-16", "The system shall provide Novena prayer sequences.", "M"],
        ["FR-17", "The system shall clearly indicate locked premium content "
                  "and prompt non-subscribers to subscribe.", "M"],
    ])

    fr_block("3.5 Notes &amp; Favourites", [
        ["FR-18", "The system shall allow the user to create, edit and delete "
                  "personal notes.", "M"],
        ["FR-19", "The system shall allow the user to attach a note to a "
                  "scripture or devotion.", "S"],
        ["FR-20", "The system shall allow the user to save any item to "
                  "Favourites.", "M"],
        ["FR-21", "The system shall show all saved items on the Favourites "
                  "screen and allow their removal.", "M"],
    ])

    fr_block("3.6 Profile &amp; Settings", [
        ["FR-22", "The system shall display the user's profile information.",
         "M"],
        ["FR-23", "The system shall allow the user to set/change a profile "
                  "picture and personal info.", "M"],
        ["FR-24", "The system shall allow the user to change the password.",
         "M"],
        ["FR-25", "The system shall allow the user to switch theme "
                  "(e.g. light/dark).", "S"],
        ["FR-26", "The system shall allow the user to switch language between "
                  "Swahili and English.", "M"],
    ])

    fr_block("3.7 Navigation", [
        ["FR-27", "The system shall provide a primary navigation menu with: "
                  "Bible, Novena, Tenzi, Sala, Favourites and Profile.", "M"],
    ])

    fr_block("3.8 Sharing &amp; Notifications", [
        ["FR-28", "The system shall allow the user to share the app using the "
                  "native Android/iOS share method of their choice.", "M"],
        ["FR-29", "The system shall deliver push notifications for daily "
                  "content and reminders via Firebase or Expo (EAS).", "M"],
    ])
    S.append(PageBreak())

    # ===== 4. External Interfaces =====
    S.append(P("4. External Interface Requirements", "H1"))

    S.append(P("4.1 User Interfaces", "H2"))
    S += B.bullets(styles, [
        "Modern, clean mobile layout, mobile-first and touch friendly.",
        "Bilingual labels (Swahili default, English available).",
        "Bottom navigation for Bible, Novena, Tenzi, Sala, Favourites, "
        "Profile.",
        "Accessible colour contrast and scalable text.",
    ])

    S.append(P("4.2 Software Interfaces", "H2"))
    S.append(B.data_table(
        styles,
        ["Interface", "Purpose"],
        [
            ["Django REST API", "All client-server communication over HTTPS."],
            ["SMS gateway", "Sending OTP codes for phone verification."],
            ["Social identity (Google, Apple)", "Federated sign-in."],
            ["Payment provider", "Processing monthly/annual subscriptions."],
            ["Firebase / Expo EAS", "Push notification delivery."],
        ],
        [5.5 * cm, 10.5 * cm],
    ))

    S.append(P("4.3 Communication Interfaces", "H2"))
    S += B.bullets(styles, [
        "All network traffic over HTTPS/TLS.",
        "JSON as the API payload format.",
        "Token-based authentication for API requests.",
    ])
    S.append(PageBreak())

    # ===== 5. Non-Functional =====
    S.append(P("5. Non-Functional Requirements", "H1"))
    S.append(B.data_table(
        styles,
        ["ID", "Category", "Requirement"],
        [
            ["NFR-1", "Performance", "Screens shall load within 3 seconds on a "
             "typical 3G/4G connection; cached content shall open instantly."],
            ["NFR-2", "Availability", "Backend services shall target 99.5% "
             "monthly uptime."],
            ["NFR-3", "Security", "Passwords shall be securely hashed; tokens "
             "stored in secure device storage; OTP codes expire quickly."],
            ["NFR-4", "Privacy", "Personal data handled per applicable data "
             "protection practices; users can update or delete their data."],
            ["NFR-5", "Usability", "First-time users shall complete signup and "
             "verification without external help."],
            ["NFR-6", "Compatibility", "Runs on Android 8+ and iOS 14+."],
            ["NFR-7", "Localization", "Full Swahili and English support across "
             "the UI and notifications."],
            ["NFR-8", "Scalability", "Backend shall scale to tens of thousands "
             "of concurrent users."],
            ["NFR-9", "Maintainability", "Modular codebase with documented APIs "
             "and automated builds via Expo EAS."],
            ["NFR-10", "Offline", "Core Bible reading and saved content "
             "available offline after first sync."],
        ],
        [2.0 * cm, 3.2 * cm, 10.8 * cm],
    ))
    S.append(PageBreak())

    # ===== 6. Subscription =====
    S.append(P("6. Subscription &amp; Monetisation Requirements", "H1"))
    S.append(P(
        "M-Kristo is free to download and use for core features. Advanced "
        "features are unlocked through a paid subscription. Following the "
        "product decision, subscription is the monetisation model and a "
        "separate donation flow is <b>not</b> required for this release."))
    S.append(B.data_table(
        styles,
        ["ID", "Requirement"],
        [
            ["SR-1", "The system shall offer a monthly subscription plan."],
            ["SR-2", "The system shall offer an annual subscription plan."],
            ["SR-3", "The system shall unlock premium content (Shajara, Tenzi "
                     "and other advanced features) while a subscription is "
                     "active."],
            ["SR-4", "The system shall revoke premium access when a "
                     "subscription expires or is cancelled."],
            ["SR-5", "The system shall show current plan and renewal status in "
                     "the profile."],
            ["SR-6", "The system shall process payments through a secure "
                     "third-party payment provider."],
        ],
        [2.0 * cm, 14.0 * cm],
    ))
    S.append(PageBreak())

    # ===== 7. Assumptions =====
    S.append(P("7. Assumptions, Constraints &amp; Dependencies", "H1"))
    S.append(P("7.1 Assumptions", "H2"))
    S += B.bullets(styles, [
        "Users have a mobile phone capable of receiving SMS for verification.",
        "Bible and devotional content is licensed/available in both languages.",
        "A payment provider available in Tanzania is used for subscriptions.",
    ])
    S.append(P("7.2 Constraints", "H2"))
    S += B.bullets(styles, [
        "Client implemented with React Native (Expo); backend with Django.",
        "App must be publishable to Google Play and the Apple App Store.",
        "Social login must comply with Google and Apple platform policies.",
    ])
    S.append(P("7.3 Dependencies", "H2"))
    S += B.bullets(styles, [
        "SMS gateway availability for OTP delivery.",
        "Firebase or Expo EAS for push notifications.",
        "Third-party payment provider for subscription billing.",
    ])
    S.append(PageBreak())

    # ===== 8. Acceptance =====
    S.append(P("8. Acceptance Criteria", "H1"))
    S.append(P(
        "The release is accepted when the following are demonstrably true:"))
    S += B.bullets(styles, [
        "A new user can sign up, receive an OTP, verify their phone and log in.",
        "Social login with Google and Apple works on both platforms.",
        "Bible, Neno la Leo, Tafakari, Somo and Sala are accessible in Swahili "
        "and English.",
        "Prayer reminders and daily notifications are delivered.",
        "Notes and favourites can be created, viewed and removed.",
        "Premium content is locked for free users and unlocked for active "
        "subscribers.",
        "Monthly and annual subscriptions can be purchased and correctly "
        "gate access.",
        "The app can be shared using native Android and iOS share sheets.",
        "Profile info, picture, password, theme and language can be updated.",
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
