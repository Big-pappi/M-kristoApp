"""
mkristo_doc_style.py
--------------------
Shared branding, colours, styles and reusable flowables for the
M-Kristo App documentation PDFs.

Both `generate_srs.py` (System Requirements Specification) and
`generate_sdd.py` (System Design Document) import from this module so the
two documents share a consistent, professional look.

Author : Philip Steven Chediel
Company: BlueGrid Technologies  -  www.bluegrid.co.tz  -  +255 620 636 893
"""

from datetime import date

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

# --------------------------------------------------------------------------- #
#  Brand identity
# --------------------------------------------------------------------------- #
APP_NAME = "M-Kristo App"
DOMAIN = "m-kristo.com"

AUTHOR = "Philip Steven Chediel"
COMPANY = "BlueGrid Technologies"
WEBSITE = "www.bluegrid.co.tz"
PHONE = "+255 620 636 893"

# Pinned to the agreed project date so every generated document is consistent.
# Change this single value to re-date all documents at once.
DOC_DATE = date(2026, 8, 12).strftime("%d %B %Y")  # 12 August 2026

# Palette derived from the M-Kristo brand screenshots (teal + purple)
TEAL = colors.HexColor("#0E7C8B")          # primary brand teal
TEAL_DARK = colors.HexColor("#0A5C68")
PURPLE = colors.HexColor("#4A2E6B")        # accent purple
PURPLE_LIGHT = colors.HexColor("#6E4E96")
INK = colors.HexColor("#1F2933")           # body text
MUTED = colors.HexColor("#5B6B78")         # secondary text
LIGHT = colors.HexColor("#EEF4F5")         # light fill
LINE = colors.HexColor("#CBD6D9")          # rules / borders
WHITE = colors.white

# Page geometry
PAGE_SIZE = A4
MARGIN = 2.0 * cm


# --------------------------------------------------------------------------- #
#  Paragraph styles
# --------------------------------------------------------------------------- #
def build_styles():
    """Return a stylesheet with all custom styles registered."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="CoverTitle", fontName="Helvetica-Bold", fontSize=34,
        leading=40, textColor=WHITE, alignment=TA_LEFT, spaceAfter=6))
    styles.add(ParagraphStyle(
        name="CoverSub", fontName="Helvetica", fontSize=15,
        leading=20, textColor=WHITE, alignment=TA_LEFT))
    styles.add(ParagraphStyle(
        name="CoverDocType", fontName="Helvetica-Bold", fontSize=18,
        leading=22, textColor=colors.HexColor("#D7E9EC"), alignment=TA_LEFT))

    styles.add(ParagraphStyle(
        name="H1", fontName="Helvetica-Bold", fontSize=17, leading=22,
        textColor=TEAL_DARK, spaceBefore=16, spaceAfter=8))
    styles.add(ParagraphStyle(
        name="H2", fontName="Helvetica-Bold", fontSize=13, leading=17,
        textColor=PURPLE, spaceBefore=12, spaceAfter=5))
    styles.add(ParagraphStyle(
        name="H3", fontName="Helvetica-Bold", fontSize=11, leading=15,
        textColor=INK, spaceBefore=8, spaceAfter=3))

    styles.add(ParagraphStyle(
        name="Body", fontName="Helvetica", fontSize=10, leading=15,
        textColor=INK, alignment=TA_JUSTIFY, spaceAfter=6))
    styles.add(ParagraphStyle(
        name="MkBullet", fontName="Helvetica", fontSize=10, leading=15,
        textColor=INK, leftIndent=14, bulletIndent=4, spaceAfter=3))
    styles.add(ParagraphStyle(
        name="Small", fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=MUTED))
    styles.add(ParagraphStyle(
        name="TableHead", fontName="Helvetica-Bold", fontSize=9.5,
        leading=12, textColor=WHITE))
    styles.add(ParagraphStyle(
        name="TableCell", fontName="Helvetica", fontSize=9, leading=12,
        textColor=INK))
    styles.add(ParagraphStyle(
        name="TableCellBold", fontName="Helvetica-Bold", fontSize=9,
        leading=12, textColor=INK))
    styles.add(ParagraphStyle(
        name="TOCEntry", fontName="Helvetica", fontSize=10.5, leading=20,
        textColor=INK))
    return styles


# --------------------------------------------------------------------------- #
#  Header / footer drawn on every page (except the cover)
# --------------------------------------------------------------------------- #
def make_page_decorator(doc_type):
    """Return an onLaterPages callback that stamps header + footer."""

    def decorate(canvas, doc):
        canvas.saveState()
        width, height = PAGE_SIZE

        # Header
        canvas.setFillColor(TEAL)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(MARGIN, height - 1.3 * cm, APP_NAME)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(width - MARGIN, height - 1.3 * cm, doc_type)
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.6)
        canvas.line(MARGIN, height - 1.5 * cm, width - MARGIN, height - 1.5 * cm)

        # Footer
        canvas.setStrokeColor(LINE)
        canvas.line(MARGIN, 1.4 * cm, width - MARGIN, 1.4 * cm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(MARGIN, 1.0 * cm,
                          f"{COMPANY}  |  {WEBSITE}")
        canvas.drawCentredString(width / 2.0, 1.0 * cm,
                                 f"Confidential - {APP_NAME}")
        canvas.drawRightString(width - MARGIN, 1.0 * cm,
                               f"Page {doc.page}")
        canvas.restoreState()

    return decorate


def make_cover_decorator():
    """Return an onFirstPage callback that paints the cover background."""

    def decorate(canvas, doc):
        canvas.saveState()
        width, height = PAGE_SIZE

        # Full teal background
        canvas.setFillColor(TEAL)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)

        # Purple diagonal band accent
        canvas.setFillColor(PURPLE)
        p = canvas.beginPath()
        p.moveTo(0, height)
        p.lineTo(width * 0.55, height)
        p.lineTo(width * 0.30, height * 0.70)
        p.lineTo(0, height * 0.82)
        p.close()
        canvas.drawPath(p, fill=1, stroke=0)

        # Bottom contact bar
        canvas.setFillColor(TEAL_DARK)
        canvas.rect(0, 0, width, 2.6 * cm, fill=1, stroke=0)
        canvas.setFillColor(WHITE)
        canvas.setFont("Helvetica-Bold", 10)
        canvas.drawString(MARGIN, 1.7 * cm, f"Prepared by {AUTHOR}")
        canvas.setFont("Helvetica", 9)
        canvas.drawString(MARGIN, 1.15 * cm,
                          f"{COMPANY}   |   {WEBSITE}   |   {PHONE}")
        canvas.restoreState()

    return decorate


# --------------------------------------------------------------------------- #
#  Reusable flowable builders
# --------------------------------------------------------------------------- #
def cover_story(styles, doc_type, doc_code, version):
    """Flowables that sit on top of the painted cover background."""
    story = []
    story.append(Spacer(1, 5.5 * cm))
    story.append(Paragraph(APP_NAME, styles["CoverTitle"]))
    story.append(Paragraph(f"Daily Devotions Platform &mdash; {DOMAIN}",
                           styles["CoverSub"]))
    story.append(Spacer(1, 3.0 * cm))
    story.append(Paragraph(doc_type, styles["CoverDocType"]))
    story.append(Spacer(1, 0.6 * cm))

    meta = [
        ["Document code", doc_code],
        ["Version", version],
        ["Date", DOC_DATE],
        ["Status", "Draft for Review"],
        ["Classification", "Confidential"],
    ]
    t = Table(meta, colWidths=[4.2 * cm, 8.0 * cm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (-1, -1), WHITE),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, colors.HexColor("#3E9AA8")),
    ]))
    story.append(t)
    return story


def toc_table(styles, entries):
    """Build a simple two-column table of contents."""
    data = [[Paragraph(f"<b>{num}</b>&nbsp;&nbsp;{title}", styles["TOCEntry"])]
            for num, title in entries]
    t = Table(data, colWidths=[16.0 * cm])
    t.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def data_table(styles, header, rows, col_widths):
    """Build a branded table with a coloured header row."""
    head = [Paragraph(h, styles["TableHead"]) for h in header]
    body = []
    for row in rows:
        cells = []
        for i, cell in enumerate(row):
            style = styles["TableCellBold"] if i == 0 else styles["TableCell"]
            cells.append(Paragraph(str(cell), style))
        body.append(cells)

    t = Table([head] + body, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
    ]))
    return t


def bullets(styles, items):
    """Return a list of bulleted Paragraph flowables."""
    return [Paragraph(item, styles["MkBullet"], bulletText="\u2022")
            for item in items]


def hr(width=None, color=LINE, thickness=0.8, space_before=4, space_after=8):
    """A horizontal rule implemented as a thin table."""
    w = width or (PAGE_SIZE[0] - 2 * MARGIN)
    t = Table([[""]], colWidths=[w], rowHeights=[thickness])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), thickness, color),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return [Spacer(1, space_before), t, Spacer(1, space_after)]
