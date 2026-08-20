"""
generate_deployment.py
----------------------
Generates the **Deployment & Hosting Environment Guide** for the M-Kristo
App as a professionally formatted PDF. It documents every step from local
development through to publishing the mobile apps on the Google Play Store
and Apple App Store, and hosting the Django backend in production.

Run:
    python generate_deployment.py
Output:
    M-Kristo-Deployment-and-Hosting-Guide.pdf

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

OUTPUT = "M-Kristo-Deployment-and-Hosting-Guide.pdf"
DOC_TYPE = "Deployment & Hosting Guide"
DOC_CODE = "BGT-MKR-DEP-001"
VERSION = "1.0"


def build_story(styles):
    S = []
    P = lambda t, s="Body": Paragraph(t, styles[s])  # noqa: E731

    def step(title):
        """A step heading rendered as an H3 sub-item under a phase."""
        return P(title, "H3")

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
            ["Document", "Deployment & Hosting Environment Guide"],
            ["Document code", DOC_CODE],
            ["Version", VERSION],
            ["Date", B.DOC_DATE],
            ["Author", B.AUTHOR],
            ["Organisation", B.COMPANY],
            ["Contact", f"{B.WEBSITE} | {B.PHONE}"],
            ["Related", "BGT-MKR-SRS-001 (SRS), BGT-MKR-SDD-001 (SDD)"],
        ],
        [4.5 * cm, 11.5 * cm]))
    S.append(Spacer(1, 0.4 * cm))
    S.append(P("Revision History", "H2"))
    S.append(B.data_table(
        styles, ["Version", "Date", "Author", "Description"],
        [["1.0", B.DOC_DATE, B.AUTHOR,
          "Initial deployment & hosting baseline."]],
        [2.2 * cm, 3.2 * cm, 4.6 * cm, 6.0 * cm]))
    S.append(PageBreak())

    # ----- TOC -----
    S.append(P("Table of Contents", "H1"))
    S.append(B.toc_table(styles, [
        ("1.", "Introduction &amp; Overview"),
        ("2.", "Environment Strategy (Dev, Staging, Production)"),
        ("3.", "Phase 1 &mdash; Local Development Setup"),
        ("4.", "Phase 2 &mdash; Backend Hosting (Django + PostgreSQL)"),
        ("5.", "Phase 3 &mdash; Third-Party Services Configuration"),
        ("6.", "Phase 4 &mdash; Mobile Build with Expo EAS"),
        ("7.", "Phase 5 &mdash; Publishing to Google Play"),
        ("8.", "Phase 6 &mdash; Publishing to the Apple App Store"),
        ("9.", "Phase 7 &mdash; CI/CD &amp; Over-the-Air Updates"),
        ("10.", "Phase 8 &mdash; Monitoring, Backups &amp; Maintenance"),
        ("11.", "Deployment Checklist"),
    ]))
    S.append(PageBreak())

    # ===== 1. Introduction =====
    S.append(P("1. Introduction &amp; Overview", "H1"))
    S.append(P("1.1 Purpose", "H2"))
    S.append(P(
        "This guide describes, step by step, how the <b>M-Kristo App</b> moves "
        "from a developer workstation to live production. It covers the "
        "React Native (Expo) mobile client, the Django backend, the "
        "PostgreSQL database, supporting third-party services, and publishing "
        "to both the Google Play Store and the Apple App Store."))
    S.append(P("1.2 High-Level Flow", "H2"))
    S += B.bullets(styles, [
        "<b>Develop</b> locally &rarr; run the Django API and the Expo client "
        "on a device/emulator.",
        "<b>Host the backend</b> &rarr; deploy Django + PostgreSQL to a "
        "production server over HTTPS.",
        "<b>Configure services</b> &rarr; SMS OTP, push, payments and storage.",
        "<b>Build the apps</b> &rarr; produce signed Android and iOS binaries "
        "with Expo EAS.",
        "<b>Publish</b> &rarr; submit to Google Play and the Apple App Store.",
        "<b>Operate</b> &rarr; CI/CD, OTA updates, monitoring and backups.",
    ])
    S.append(P("1.3 Accounts You Will Need", "H2"))
    S.append(B.data_table(
        styles, ["Account", "Used for"],
        [
            ["Expo (EAS)", "Building and submitting mobile binaries."],
            ["Google Play Console", "Publishing the Android app (one-time "
                                    "USD 25 fee)."],
            ["Apple Developer Program", "Publishing the iOS app (annual "
                                        "USD 99 fee)."],
            ["Cloud/VPS host", "Hosting the Django backend and PostgreSQL."],
            ["Domain / DNS (m-kristo.com)", "API subdomain and TLS "
                                            "certificate."],
            ["Firebase", "Push notifications (FCM) and optional analytics."],
            ["SMS gateway", "Sending OTP verification codes."],
            ["Payment provider", "Subscription billing."],
        ],
        [5.0 * cm, 11.0 * cm]))
    S.append(PageBreak())

    # ===== 2. Environment strategy =====
    S.append(P("2. Environment Strategy", "H1"))
    S.append(P(
        "Three isolated environments are used so that changes are validated "
        "before reaching real users. Each has its own database, secrets and "
        "configuration."))
    S.append(B.data_table(
        styles, ["Environment", "Purpose", "Backend URL (example)"],
        [
            ["Development", "Local coding and debugging on the developer "
                            "machine.", "http://localhost:8000"],
            ["Staging", "Pre-release testing on real devices with production-"
                        "like data.", "https://staging-api.m-kristo.com"],
            ["Production", "Live environment used by end users.",
             "https://api.m-kristo.com"],
        ],
        [3.2 * cm, 7.8 * cm, 5.0 * cm]))
    S.append(Spacer(1, 0.3 * cm))
    S.append(P(
        "The mobile client selects the correct API base URL per build profile "
        "(development / preview / production) so the same codebase targets any "
        "environment.", "Body"))
    S.append(PageBreak())

    # ===== 3. Phase 1: Local development =====
    S.append(P("3. Phase 1 &mdash; Local Development Setup", "H1"))
    S.append(step("Step 1.1 &mdash; Install prerequisites"))
    S += B.bullets(styles, [
        "Install <b>Node.js (LTS)</b>, <b>Git</b>, and a package manager "
        "(npm or yarn).",
        "Install <b>Python 3.11+</b> and <b>pip</b> for the Django backend.",
        "Install <b>PostgreSQL</b> locally (or run it via Docker).",
        "Install the <b>Expo CLI</b> and the <b>Expo Go</b> app on a test "
        "phone, plus Android Studio / Xcode for emulators.",
    ])
    S.append(step("Step 1.2 &mdash; Set up the Django backend"))
    S += B.bullets(styles, [
        "Clone the repository and create a virtual environment "
        "(<i>python -m venv .venv</i>).",
        "Install dependencies (<i>pip install -r requirements.txt</i>).",
        "Create a <b>.env</b> file with database credentials and secret keys.",
        "Run migrations (<i>python manage.py migrate</i>) and create an admin "
        "user (<i>createsuperuser</i>).",
        "Start the API (<i>python manage.py runserver</i>).",
    ])
    S.append(step("Step 1.3 &mdash; Set up the Expo client"))
    S += B.bullets(styles, [
        "Install packages (<i>npm install</i>) in the mobile project.",
        "Point the development API base URL at your machine's LAN IP so a "
        "physical phone can reach it.",
        "Start the bundler (<i>npx expo start</i>) and open the app in Expo "
        "Go or an emulator.",
        "Verify signup, OTP, login, Bible reading and daily content against "
        "the local API.",
    ])
    S.append(PageBreak())

    # ===== 4. Phase 2: Backend hosting =====
    S.append(P("4. Phase 2 &mdash; Backend Hosting (Django + PostgreSQL)",
               "H1"))
    S.append(P(
        "The backend is hosted on a Linux server (managed platform or VPS) "
        "behind HTTPS, with a managed PostgreSQL database."))
    S.append(step("Step 2.1 &mdash; Provision the server & database"))
    S += B.bullets(styles, [
        "Create a Linux server (or a managed app platform) for the Django "
        "app.",
        "Provision a <b>managed PostgreSQL</b> instance and record its "
        "connection string.",
        "Create a DNS <b>A/CNAME</b> record for <b>api.m-kristo.com</b> "
        "pointing to the server.",
    ])
    S.append(step("Step 2.2 &mdash; Configure the production app"))
    S += B.bullets(styles, [
        "Set environment variables: <i>SECRET_KEY</i>, <i>DEBUG=False</i>, "
        "<i>ALLOWED_HOSTS</i>, <i>DATABASE_URL</i> and service keys.",
        "Collect static files (<i>python manage.py collectstatic</i>).",
        "Run migrations against the production database.",
        "Serve the app with <b>Gunicorn/Uvicorn</b> behind <b>Nginx</b> as a "
        "reverse proxy (or use the platform's runtime).",
    ])
    S.append(step("Step 2.3 &mdash; Enable HTTPS"))
    S += B.bullets(styles, [
        "Obtain a TLS certificate (e.g. Let's Encrypt) for "
        "<b>api.m-kristo.com</b>.",
        "Force HTTPS and enable HSTS; the mobile app must only talk to the "
        "app over TLS.",
    ])
    S.append(step("Step 2.4 &mdash; Verify the deployment"))
    S += B.bullets(styles, [
        "Hit a health-check endpoint and confirm a JSON response over HTTPS.",
        "Confirm the Django admin loads and the database is reachable.",
    ])
    S.append(PageBreak())

    # ===== 5. Phase 3: Third-party services =====
    S.append(P("5. Phase 3 &mdash; Third-Party Services Configuration", "H1"))
    S.append(B.data_table(
        styles, ["Service", "Setup steps"],
        [
            ["SMS OTP gateway",
             "Create an account, obtain API credentials, set the sender ID, "
             "and store keys as backend env vars for phone verification."],
            ["Firebase (FCM)",
             "Create a Firebase project; add Android and iOS apps; download "
             "google-services.json and GoogleService-Info.plist; add the "
             "server key to the backend."],
            ["Push (Expo/EAS option)",
             "Alternatively use Expo push tokens; store tokens per device and "
             "send via the Expo push service."],
            ["Payment provider",
             "Create products for the monthly and annual plans; configure "
             "webhooks to the backend to activate subscriptions."],
            ["Media/storage",
             "Configure object storage or media hosting for profile pictures "
             "and content assets."],
        ],
        [4.2 * cm, 11.8 * cm]))
    S.append(Spacer(1, 0.3 * cm))
    S.append(P(
        "Keep separate credentials for staging and production, and never "
        "commit secrets to source control.", "Small"))
    S.append(PageBreak())

    # ===== 6. Phase 4: EAS build =====
    S.append(P("6. Phase 4 &mdash; Mobile Build with Expo EAS", "H1"))
    S.append(step("Step 4.1 &mdash; Prepare the project"))
    S += B.bullets(styles, [
        "Install the EAS CLI (<i>npm install -g eas-cli</i>) and log in "
        "(<i>eas login</i>).",
        "Set app identity in <b>app.json/app.config</b>: name, slug, version, "
        "Android <i>package</i> and iOS <i>bundleIdentifier</i>, icons and "
        "splash screen.",
        "Add the app icon and branding assets that match the M-Kristo look.",
    ])
    S.append(step("Step 4.2 &mdash; Configure build profiles"))
    S += B.bullets(styles, [
        "Run <i>eas build:configure</i> to create <b>eas.json</b>.",
        "Define <b>development</b>, <b>preview</b> and <b>production</b> "
        "profiles, each pointing to the correct API URL.",
    ])
    S.append(step("Step 4.3 &mdash; Manage signing credentials"))
    S += B.bullets(styles, [
        "Let EAS generate and store the Android <b>keystore</b> "
        "(or upload your own).",
        "For iOS, sign in with your Apple Developer account so EAS can manage "
        "the distribution certificate and provisioning profile.",
    ])
    S.append(step("Step 4.4 &mdash; Build the binaries"))
    S += B.bullets(styles, [
        "Android: <i>eas build --platform android --profile production</i> "
        "(produces an <b>.aab</b>).",
        "iOS: <i>eas build --platform ios --profile production</i> "
        "(produces an <b>.ipa</b>).",
        "Download or let EAS store the artifacts for submission.",
    ])
    S.append(PageBreak())

    # ===== 7. Phase 5: Google Play =====
    S.append(P("7. Phase 5 &mdash; Publishing to Google Play", "H1"))
    S.append(step("Step 5.1 &mdash; Prepare the listing"))
    S += B.bullets(styles, [
        "Create the app in the <b>Google Play Console</b> and pay the one-time "
        "registration fee.",
        "Complete the store listing: title, short/full description (Swahili "
        "and English), screenshots, feature graphic and app icon.",
        "Fill the content rating, data-safety, privacy policy and target "
        "audience forms.",
    ])
    S.append(step("Step 5.2 &mdash; Upload and test"))
    S += B.bullets(styles, [
        "Upload the <b>.aab</b> (manually or via "
        "<i>eas submit --platform android</i>).",
        "Release first to an <b>internal testing</b> track and verify on real "
        "devices.",
        "Promote to <b>closed/open testing</b> as needed.",
    ])
    S.append(step("Step 5.3 &mdash; Production release"))
    S += B.bullets(styles, [
        "Promote the tested build to <b>Production</b>.",
        "Submit for Google review; once approved the app goes live on the "
        "Play Store.",
        "Use <b>staged rollout</b> to release to a percentage of users first.",
    ])
    S.append(PageBreak())

    # ===== 8. Phase 6: App Store =====
    S.append(P("8. Phase 6 &mdash; Publishing to the Apple App Store", "H1"))
    S.append(step("Step 6.1 &mdash; Prepare in App Store Connect"))
    S += B.bullets(styles, [
        "Enrol in the <b>Apple Developer Program</b> (annual fee).",
        "Create the app record in <b>App Store Connect</b> with the matching "
        "<i>bundleIdentifier</i>.",
        "Complete the listing: name, subtitle, description (Swahili and "
        "English), keywords, screenshots and privacy details.",
    ])
    S.append(step("Step 6.2 &mdash; Upload and TestFlight"))
    S += B.bullets(styles, [
        "Submit the <b>.ipa</b> with <i>eas submit --platform ios</i> "
        "(uploads to App Store Connect).",
        "Distribute the build via <b>TestFlight</b> to internal/external "
        "testers and validate.",
    ])
    S.append(step("Step 6.3 &mdash; Review and release"))
    S += B.bullets(styles, [
        "Attach the build to a version and submit for <b>App Review</b>.",
        "Provide a demo account (with a verified phone/OTP path) and clear "
        "notes for reviewers.",
        "On approval, release manually or automatically to the App Store.",
    ])
    S.append(PageBreak())

    # ===== 9. Phase 7: CI/CD & OTA =====
    S.append(P("9. Phase 7 &mdash; CI/CD &amp; Over-the-Air Updates", "H1"))
    S.append(P("9.1 Continuous Integration / Delivery", "H2"))
    S += B.bullets(styles, [
        "On each push, run automated tests and linting for both backend and "
        "client.",
        "Auto-deploy the backend to <b>staging</b> on merge; deploy to "
        "<b>production</b> on tagged releases.",
        "Trigger EAS builds automatically for release branches.",
    ])
    S.append(P("9.2 Over-the-Air (OTA) Updates", "H2"))
    S += B.bullets(styles, [
        "Use <b>EAS Update</b> to push JavaScript/asset fixes without a full "
        "store submission.",
        "Reserve store submissions for native changes (new permissions, SDK "
        "upgrades, icons).",
        "Map update channels to build profiles (preview vs production).",
    ])
    S.append(PageBreak())

    # ===== 10. Phase 8: Monitoring =====
    S.append(P("10. Phase 8 &mdash; Monitoring, Backups &amp; Maintenance",
               "H1"))
    S.append(B.data_table(
        styles, ["Area", "Practice"],
        [
            ["Logging", "Centralised backend logs with error levels and "
                        "request tracing."],
            ["Crash reporting", "Capture client crashes and ANRs (e.g. "
                                "Sentry/Crashlytics)."],
            ["Uptime", "Health-check monitoring and alerting for the API "
                       "domain."],
            ["Backups", "Automated daily PostgreSQL backups with periodic "
                        "restore tests."],
            ["Security updates", "Regular dependency and OS patching; rotate "
                                 "secrets periodically."],
            ["Performance", "Monitor API latency and database queries; scale "
                            "instances as usage grows."],
        ],
        [3.6 * cm, 12.4 * cm]))
    S.append(PageBreak())

    # ===== 11. Checklist =====
    S.append(P("11. Deployment Checklist", "H1"))
    S.append(P("Pre-Launch", "H2"))
    S += B.bullets(styles, [
        "Production backend live on HTTPS at <b>api.m-kristo.com</b>.",
        "Database migrated and backed up; admin access confirmed.",
        "SMS OTP, push, and payment services configured with production "
        "keys.",
        "Store listings complete in Swahili and English with screenshots.",
        "Privacy policy and data-safety declarations published.",
        "Demo/test account prepared for store reviewers.",
    ])
    S.append(P("Launch", "H2"))
    S += B.bullets(styles, [
        "Android production build approved and rolled out on Google Play.",
        "iOS build approved and released on the App Store.",
        "Push notifications and subscription purchase verified end-to-end in "
        "production.",
    ])
    S.append(P("Post-Launch", "H2"))
    S += B.bullets(styles, [
        "Monitoring and crash reporting confirmed to be receiving data.",
        "OTA update channel tested with a minor fix.",
        "Backup restore verified.",
    ])
    S.append(Spacer(1, 0.5 * cm))
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
