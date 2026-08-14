"""
generate_proposal.py
--------------------
Generates the M-Kristo App Software Development Proposal PDF for the client.

Shares branding and layout with the other M-Kristo documents through
`mkristo_doc_style.py` so all deliverables look consistent.

Client : Baraka
Author : Philip Steven Chediel
Company: BlueGrid Technologies  -  www.bluegrid.co.tz  -  +255 620 636 893

Run:
    python generate_proposal.py
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

OUTPUT = "M-Kristo-Development-Proposal.pdf"
DOC_TYPE = "Software Development Proposal"
DOC_CODE = "BGT-MKR-PROP-001"
VERSION = "1.0"

CLIENT = "Baraka"

# --------------------------------------------------------------------------- #
#  Budget figures (Tanzanian Shilling)
# --------------------------------------------------------------------------- #
TOTAL = "3,500,000 TZS"
MILESTONE_1 = "2,500,000 TZS"
MILESTONE_2 = "1,000,000 TZS"


def signature_block(styles):
    """Two side-by-side signature panels for client and developer."""
    def panel(role, name, org):
        rows = [
            [Paragraph(role, styles["TableCellBold"])],
            [Spacer(1, 1.1 * cm)],
            [Paragraph("Signature: ______________________________",
                       styles["TableCell"])],
            [Spacer(1, 0.35 * cm)],
            [Paragraph(f"Name: {name}", styles["TableCell"])],
            [Spacer(1, 0.2 * cm)],
            [Paragraph(org, styles["TableCell"])],
            [Spacer(1, 0.2 * cm)],
            [Paragraph("Date: _______________________", styles["TableCell"])],
        ]
        inner = Table(rows, colWidths=[7.4 * cm])
        inner.setStyle(TableStyle([
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("BACKGROUND", (0, 0), (-1, 0), B.LIGHT),
        ]))
        return inner

    client_panel = panel("FOR THE CLIENT", CLIENT, "Client / Project Owner")
    dev_panel = panel("FOR THE DEVELOPER", B.AUTHOR, B.COMPANY)

    outer = Table([[client_panel, dev_panel]],
                  colWidths=[8.0 * cm, 8.0 * cm])
    outer.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOX", (0, 0), (0, 0), 0.8, B.LINE),
        ("BOX", (1, 0), (1, 0), 0.8, B.LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    return outer


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
            ["Document", "Software Development Proposal"],
            ["Document code", DOC_CODE],
            ["Version", VERSION],
            ["Date", B.DOC_DATE],
            ["Prepared for", f"{CLIENT} (Client)"],
            ["Prepared by", B.AUTHOR],
            ["Organisation", B.COMPANY],
            ["Contact", f"{B.WEBSITE} | {B.PHONE}"],
            ["Validity", "This proposal is valid for 30 days from the date above."],
        ],
        [4.5 * cm, 11.5 * cm]))
    S.append(PageBreak())

    # ----- TOC -----
    S.append(P("Table of Contents", "H1"))
    S.append(B.toc_table(styles, [
        ("1.", "Cover Letter"),
        ("2.", "About BlueGrid Technologies"),
        ("3.", "Project Understanding & Objectives"),
        ("4.", "Scope of Work (Development)"),
        ("5.", "Deliverables"),
        ("6.", "Technology Approach"),
        ("7.", "Development Phases"),
        ("8.", "Budget & Payment Schedule"),
        ("9.", "What the Price Includes & Excludes"),
        ("10.", "Assumptions"),
        ("11.", "Terms & Conditions"),
        ("12.", "Acceptance & Signatures"),
    ]))
    S.append(PageBreak())

    # ----- 1. Cover Letter -----
    S.append(P("1. Cover Letter", "H1"))
    S.append(P(f"Dear {CLIENT},"))
    S.append(P(
        "Thank you for the opportunity to partner with you on the development "
        "of the <b>M-Kristo App</b> &mdash; a mobile daily-devotions platform "
        "designed to bring the Bible, prayers (Sala and Novena), hymns (Tenzi), "
        "daily devotions (Neno la Leo, Tafakari and Somo) and personal notes to "
        "believers across Tanzania and East Africa, in both Swahili and English."))
    S.append(P(
        "This proposal sets out our understanding of the project, the scope of "
        "the development work, the deliverables, and the agreed budget and "
        "payment schedule. The pricing in this document covers <b>software "
        "development only</b>, as discussed."))
    S.append(P(
        f"We are confident that {B.COMPANY} can deliver a modern, reliable and "
        "scalable product that meets your goals. We look forward to your "
        "acceptance and to beginning work."))
    S.append(Spacer(1, 0.3 * cm))
    S.append(P(f"Warm regards,<br/><b>{B.AUTHOR}</b><br/>{B.COMPANY}<br/>"
               f"{B.WEBSITE} &mdash; {B.PHONE}"))
    S.append(PageBreak())

    # ----- 2. About -----
    S.append(P("2. About BlueGrid Technologies", "H1"))
    S.append(P(
        f"{B.COMPANY} is a Tanzania-based software company that designs and "
        "builds modern mobile and web applications. We focus on clean design, "
        "reliable engineering and solutions tailored to the East African "
        "market. Our work spans mobile app development, backend systems, "
        "cloud hosting and ongoing technical support."))
    S.append(B.data_table(
        styles, ["Detail", "Information"],
        [
            ["Company", B.COMPANY],
            ["Lead developer", B.AUTHOR],
            ["Website", B.WEBSITE],
            ["Phone", B.PHONE],
            ["Focus", "Mobile apps, backend systems, cloud deployment"],
        ],
        [4.5 * cm, 11.5 * cm]))
    S.append(PageBreak())

    # ----- 3. Understanding & Objectives -----
    S.append(P("3. Project Understanding & Objectives", "H1"))
    S.append(P(
        "M-Kristo is a cross-platform mobile application (Android and iOS) that "
        "delivers spiritual content and community features to a primarily "
        "Swahili-speaking audience, with full English support. The key "
        "objectives of the project are:"))
    for b in B.bullets(styles, [
        "Provide a free, accessible Bible and daily devotional content.",
        "Offer prayers (Sala, Novena), hymns (Tenzi) and reflections "
        "(Neno la Leo, Tafakari, Somo) in Swahili and English.",
        "Let users take and save personal notes and mark favourites.",
        "Provide secure sign-up and login, including social login and phone "
        "number verification via a one-time code (OTP).",
        "Unlock advanced content (e.g. Shajara, full Tenzi and other premium "
        "resources) through monthly and annual subscriptions.",
        "Allow users to share the app on both Android and iOS.",
        "Deliver push notifications for daily content and reminders.",
    ]):
        S.append(b)
    S.append(PageBreak())

    # ----- 4. Scope of Work -----
    S.append(P("4. Scope of Work (Development)", "H1"))
    S.append(P(
        "The following development work is included in this proposal. Features "
        "are grouped by area for clarity."))

    S.append(P("4.1 Mobile Application", "H2"))
    for b in B.bullets(styles, [
        "Onboarding, sign-up and login screens.",
        "Social login (e.g. Google, Apple) and phone-number OTP verification.",
        "Main navigation: Bible, Novena, Tenzi, Sala, Favourites and Profile.",
        "Bible reader with Swahili and English versions.",
        "Daily content modules: Neno la Leo, Tafakari and Somo.",
        "Notes: create, edit, save and manage personal notes.",
        "Favourites: view all saved items in one place.",
        "Profile & settings: personal info, profile picture, password change, "
        "theme (light/dark) and language (Swahili/English).",
        "Premium content gating for subscribers (Shajara, full Tenzi, etc.).",
        "In-app sharing using native Android and iOS share options.",
        "Push notifications (Firebase Cloud Messaging or EAS).",
    ]):
        S.append(b)

    S.append(P("4.2 Backend & Administration", "H2"))
    for b in B.bullets(styles, [
        "Django backend with a REST API serving all app features.",
        "User accounts, authentication and session/token management.",
        "Content management for devotions, prayers, hymns and the Bible.",
        "Subscription logic for monthly and annual plans.",
        "Secure data storage and API integration with the mobile app.",
    ]):
        S.append(b)
    S.append(PageBreak())

    # ----- 5. Deliverables -----
    S.append(P("5. Deliverables", "H1"))
    S.append(B.data_table(
        styles, ["#", "Deliverable", "Description"],
        [
            ["1", "Mobile app (Android & iOS)",
             "Built with React Native and Expo, ready for the app stores."],
            ["2", "Django backend & REST API",
             "Server application powering all app features."],
            ["3", "Admin/content management",
             "Ability to manage devotions, prayers, hymns and users."],
            ["4", "Deployment & hosting setup",
             "Backend hosted and app builds prepared for publishing."],
            ["5", "Source code handover",
             "Full source code delivered to the client on final payment."],
            ["6", "Project documentation",
             "Requirements, design and deployment documents."],
        ],
        [1.2 * cm, 5.0 * cm, 9.8 * cm]))
    S.append(PageBreak())

    # ----- 6. Technology Approach -----
    S.append(P("6. Technology Approach", "H1"))
    S.append(B.data_table(
        styles, ["Layer", "Technology"],
        [
            ["Mobile app", "React Native (Expo)"],
            ["Backend", "Django (Python)"],
            ["Database", "PostgreSQL"],
            ["Push notifications", "Firebase Cloud Messaging / EAS Push"],
            ["Hosting", "Cloud hosting for the backend API"],
        ],
        [5.0 * cm, 11.0 * cm]))
    S.append(PageBreak())

    # ----- 7. Development Phases -----
    S.append(P("7. Development Phases", "H1"))
    S.append(P(
        "Development will progress through the following phases. The full "
        "delivery runs from commencement through to hosting and publishing."))
    S.append(B.data_table(
        styles, ["Phase", "Activities"],
        [
            ["1. Setup & design",
             "Project setup, UI/UX design and technical preparation."],
            ["2. Core build",
             "Authentication, Bible, daily content, notes and navigation."],
            ["3. Premium & subscriptions",
             "Subscription plans and premium content (Shajara, Tenzi, etc.)."],
            ["4. Notifications & sharing",
             "Push notifications and native sharing on Android and iOS."],
            ["5. Testing & hosting",
             "Quality assurance, backend hosting and app-store preparation."],
        ],
        [4.8 * cm, 11.2 * cm]))
    S.append(PageBreak())

    # ----- 8. Budget & Payment Schedule -----
    S.append(P("8. Budget & Payment Schedule", "H1"))
    S.append(P(
        f"The total agreed cost for the development of the M-Kristo App is "
        f"<b>{TOTAL}</b>. This amount is payable in two milestones, as agreed:"))
    S.append(B.data_table(
        styles, ["Milestone", "When", "Amount"],
        [
            ["1. Commencement",
             "On acceptance of this proposal, to commence development "
             "through to hosting.",
             MILESTONE_1],
            ["2. Completion",
             "On completion of development and final handover.",
             MILESTONE_2],
            ["Total", "", TOTAL],
        ],
        [4.0 * cm, 8.5 * cm, 3.5 * cm]))
    S.append(Spacer(1, 0.3 * cm))
    S.append(P(
        f"<b>Summary:</b> An initial payment of <b>{MILESTONE_1}</b> is made to "
        f"commence development (covering the work up to hosting), and the "
        f"remaining <b>{MILESTONE_2}</b> is paid on completion, bringing the "
        f"total development cost to <b>{TOTAL}</b>."))
    S.append(P(
        "<b>Note:</b> This price covers <b>software development only</b>. "
        "Recurring third-party costs are billed separately (see Section 9)."))
    S.append(PageBreak())

    # ----- 9. Includes / Excludes -----
    S.append(P("9. What the Price Includes & Excludes", "H1"))
    S.append(P("9.1 Included", "H2"))
    for b in B.bullets(styles, [
        "Design and development of the mobile app and backend as scoped.",
        "Initial deployment of the backend and preparation of app builds.",
        "Source code and project documentation handover.",
    ]):
        S.append(b)
    S.append(P("9.2 Not Included (billed separately or by the client)", "H2"))
    for b in B.bullets(styles, [
        "Recurring hosting, server and database subscription fees.",
        "Domain registration and annual renewal (e.g. m-kristo.com).",
        "Google Play and Apple Developer account fees.",
        "Third-party service fees (SMS/OTP gateway, payment gateway, "
        "Firebase paid tiers).",
        "New features or changes beyond the scope in Section 4.",
        "Ongoing maintenance and support after handover (available under a "
        "separate agreement).",
    ]):
        S.append(b)
    S.append(PageBreak())

    # ----- 10. Assumptions -----
    S.append(P("10. Assumptions", "H1"))
    for b in B.bullets(styles, [
        "The client provides content (Bible text, prayers, hymns, devotions) "
        "or approves sources to be used.",
        "The client provides timely feedback and approvals at each phase.",
        "The client owns or provides the required accounts (app stores, "
        "domain, payment and SMS gateways) or authorises their setup.",
        "The scope in Section 4 is the agreed basis for this price; additional "
        "work will be quoted separately.",
    ]):
        S.append(b)
    S.append(PageBreak())

    # ----- 11. Terms & Conditions -----
    S.append(P("11. Terms & Conditions", "H1"))
    for b in B.bullets(styles, [
        f"The total development fee is {TOTAL}, payable per the schedule in "
        "Section 8.",
        f"An initial payment of {MILESTONE_1} is required to commence work.",
        f"The final payment of {MILESTONE_2} is due on completion, before "
        "final source-code handover.",
        "This price covers development only; recurring and third-party costs "
        "are excluded (Section 9).",
        "Any work outside the agreed scope will be quoted and agreed in "
        "writing before it begins.",
        "Ownership of the delivered source code transfers to the client upon "
        "full and final payment.",
        "This proposal is valid for 30 days from the date shown on the cover.",
    ]):
        S.append(b)
    S.append(PageBreak())

    # ----- 12. Acceptance & Signatures -----
    S.append(P("12. Acceptance & Signatures", "H1"))
    S.append(P(
        "By signing below, both parties agree to the scope, deliverables, "
        "budget and terms set out in this proposal for the development of the "
        "M-Kristo App."))
    S.append(Spacer(1, 0.5 * cm))
    S.append(signature_block(styles))
    S.append(Spacer(1, 0.6 * cm))
    S.append(P(
        f"Prepared by {B.AUTHOR}, {B.COMPANY} &mdash; {B.WEBSITE} &mdash; "
        f"{B.PHONE}. Dated {B.DOC_DATE}.", "Small"))
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
