"""Build the system PDFs from the markdown in system/docs and system/prompts.

    python3 system/build_pdfs.py        (run from the repo root; needs reportlab + pillow)

Markdown subset: # / ## / ### headings, paragraphs, - and 1. lists, | tables |,
> callouts, ``` code blocks, ![caption](path) images (consecutive images are laid
out side by side), **bold**, *italic*, `code`.
"""
import glob
import os
import re

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "system", "pdf")

INK = colors.HexColor("#141414")
MUTED = colors.HexColor("#8B8883")
ACCENT = colors.HexColor("#3A7BFF")
PAPER = colors.HexColor("#F4F2EE")
LINE = colors.HexColor("#E2DED8")
CODE_BG = colors.HexColor("#F1EFEA")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

S = {
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=22, leading=27, textColor=INK, spaceBefore=4, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=15, leading=19, textColor=INK, spaceBefore=16, spaceAfter=6),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=ACCENT, spaceBefore=10, spaceAfter=4),
    "p": ParagraphStyle("p", fontName="Helvetica", fontSize=9.6, leading=13.6, textColor=INK, spaceAfter=5, alignment=TA_LEFT),
    "li": ParagraphStyle("li", fontName="Helvetica", fontSize=9.6, leading=13.4, textColor=INK, leftIndent=12, bulletIndent=2, spaceAfter=2.5),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=8.4, leading=11, textColor=INK),
    "cellh": ParagraphStyle("cellh", fontName="Helvetica-Bold", fontSize=8.4, leading=11, textColor=INK),
    "callout": ParagraphStyle("callout", fontName="Helvetica", fontSize=9.4, leading=13.2, textColor=INK),
    "code": ParagraphStyle("code", fontName="Courier", fontSize=8.2, leading=11, textColor=INK),
    "cap": ParagraphStyle("cap", fontName="Helvetica", fontSize=7.6, leading=9.5, textColor=MUTED, spaceBefore=2),
    "cover_kicker": ParagraphStyle("ck", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=MUTED),
    "cover_title": ParagraphStyle("ct", fontName="Helvetica-Bold", fontSize=34, leading=38, textColor=INK),
    "cover_script": ParagraphStyle("cs", fontName="Times-BoldItalic", fontSize=30, leading=34, textColor=ACCENT),
    "cover_sub": ParagraphStyle("csub", fontName="Helvetica", fontSize=11, leading=16, textColor=INK),
}


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(t):
    t = esc(t)
    t = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r'<font face="Times-BoldItalic" color="#3A7BFF">\1</font>', t)
    return t


def is_phone(path):
    im = PILImage.open(path)
    return im.height / im.width > 1.4


def image_row(imgs):
    """Lay out images: phone-shaped frames 4 per row, everything else full width.
    Runs of different shapes are laid out separately."""
    runs = []
    for item in imgs:
        kind = is_phone(item[1])
        if runs and runs[-1][0] == kind:
            runs[-1][1].append(item)
        else:
            runs.append((kind, [item]))
    if len(runs) > 1:
        return [f for kind, run in runs for f in image_row(run)]
    portrait = runs[0][0]
    per_row = 4 if portrait else 1
    flow = []
    for i in range(0, len(imgs), per_row):
        chunk = imgs[i : i + per_row]
        gap = 4 * mm
        w = (CONTENT_W - gap * (per_row - 1)) / per_row
        cells = []
        for cap, path in chunk:
            im = PILImage.open(path)
            h = w * im.height / im.width
            max_h = 120 * mm if portrait else 150 * mm
            ww = w if h <= max_h else w * max_h / h
            hh = min(h, max_h)
            cells.append([Image(path, width=ww, height=hh), Paragraph(esc(cap), S["cap"])])
        while len(cells) < per_row:
            cells.append("")
        t = Table([[c for c in cells]], colWidths=[w] * per_row, hAlign="LEFT")
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), gap)]))
        flow += [t, Spacer(1, 4 * mm)]
    return flow


def table(rows):
    header, body = rows[0], rows[2:] if len(rows) > 1 and set(rows[1][0]) <= set("-: ") else rows[1:]
    n = len(header)
    data = [[Paragraph(inline(c), S["cellh"]) for c in header]] + [
        [Paragraph(inline(c), S["cell"]) for c in (r + [""] * n)[:n]] for r in body
    ]
    # Width: give short-label first columns less room.
    lens = [max(len(r[i]) if i < len(r) else 0 for r in [header] + body) for i in range(n)]
    lens = [max(16, min(l, 80)) for l in lens]
    widths = [CONTENT_W * l / sum(lens) for l in lens]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PAPER),
                ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return [t, Spacer(1, 4 * mm)]


def boxed(par, bg, bar=None):
    t = Table([[par]], colWidths=[CONTENT_W], hAlign="LEFT")
    st = [("BACKGROUND", (0, 0), (-1, -1), bg), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]
    if bar:
        st.append(("LINEBEFORE", (0, 0), (0, -1), 3, bar))
    t.setStyle(TableStyle(st))
    return [t, Spacer(1, 4 * mm)]


def md_to_flow(md):
    flow, lines, i = [], md.splitlines(), 0
    title = None
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("```"):
            j = i + 1
            code = []
            while j < len(lines) and not lines[j].startswith("```"):
                code.append(lines[j])
                j += 1
            par = Paragraph("<br/>".join(esc(c) if c else "&nbsp;" for c in code), S["code"])
            flow += boxed(par, CODE_BG)
            i = j + 1
            continue
        if ln.startswith("!["):
            imgs = []
            while i < len(lines) and lines[i].startswith("!["):
                m = re.match(r"!\[(.*?)\]\((.*?)\)", lines[i])
                path = os.path.join(ROOT, m.group(2))
                if os.path.exists(path):
                    imgs.append((m.group(1), path))
                i += 1
            if imgs:
                flow += image_row(imgs)
            continue
        if ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            flow += table(rows)
            continue
        if ln.startswith("# "):
            title = ln[2:].strip()
            i += 1
            continue
        if ln.startswith("## "):
            flow.append(Paragraph(inline(ln[3:]), S["h2"]))
        elif ln.startswith("### "):
            flow.append(Paragraph(inline(ln[4:]), S["h3"]))
        elif ln.startswith("> "):
            flow += boxed(Paragraph(inline(ln[2:]), S["callout"]), colors.HexColor("#EAF1FF"), ACCENT)
        elif re.match(r"^\s*- ", ln):
            flow.append(Paragraph(inline(re.sub(r"^\s*- ", "", ln)), S["li"], bulletText="•"))
        elif re.match(r"^\s*\d+\. ", ln):
            n = re.match(r"^\s*(\d+)\. ", ln).group(1)
            flow.append(Paragraph(inline(re.sub(r"^\s*\d+\. ", "", ln)), S["li"], bulletText=f"{n}."))
        elif ln.strip():
            flow.append(Paragraph(inline(ln), S["p"]))
        i += 1
    return title, flow


def cover(number, title, subtitle, kicker="MOTION GRAPHICS SYSTEM"):
    words = title.split(" ")
    head, last = " ".join(words[:-1]), words[-1]
    return [
        Spacer(1, 55 * mm),
        Paragraph(f"{kicker} · {number:02d}", S["cover_kicker"]),
        Spacer(1, 6 * mm),
        Paragraph(esc(head), S["cover_title"]),
        Paragraph(esc(last), S["cover_script"]),
        Spacer(1, 8 * mm),
        Paragraph(inline(subtitle), S["cover_sub"]),
        PageBreak(),
    ]


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setStrokeColor(colors.HexColor("#E8E5E0"))
    canvas.setLineWidth(0.3)
    step = 9 * mm
    x = 0
    while x < PAGE_W:
        canvas.line(x, 0, x, PAGE_H)
        x += step
    y = 0
    while y < PAGE_H:
        canvas.line(0, y, PAGE_W, y)
        y += step
    if doc.page > 1:
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN, 10 * mm, doc.title)
        canvas.drawRightString(PAGE_W - MARGIN, 10 * mm, str(doc.page))
    canvas.restoreState()


def build(number, filename, md_text, subtitle):
    title, flow = md_to_flow(md_text)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, filename)
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=18 * mm, title=title, author="Motion Graphics System")
    doc.build(cover(number, title, subtitle) + flow, onFirstPage=on_page, onLaterPages=on_page)
    print("wrote", os.path.relpath(path, ROOT))


def first_paragraph(md):
    for ln in md.splitlines()[1:]:
        if ln.strip() and not ln.startswith(("#", ">", "|", "!", "-")):
            return ln.strip()
    return ""


def main():
    docs = [
        (1, "01-Style-Guide.pdf", "01-style-guide.md"),
        (2, "02-Workflow-Playbook.pdf", "02-workflow-playbook.md"),
        (3, "03-Client-Style-Brief.pdf", "03-client-style-brief.md"),
    ]
    for n, out, src in docs:
        md = open(os.path.join(ROOT, "system", "docs", src)).read()
        build(n, out, md, first_paragraph(md))

    # 04: prompt library, assembled from system/prompts
    parts = ["# Prompt Library", "", "Copy-paste prompts for every step. Replace everything in [BRACKETS].", ""]
    readme = open(os.path.join(ROOT, "system", "prompts", "README.md")).read().splitlines()[1:]
    parts += readme + [""]
    for f in sorted(glob.glob(os.path.join(ROOT, "system", "prompts", "0*.md"))):
        body = open(f).read().splitlines()
        parts.append("## " + body[0].lstrip("# ").strip())
        parts += body[1:] + [""]
    md = "\n".join(parts)
    build(4, "04-Prompt-Library.pdf", md, first_paragraph(md))


if __name__ == "__main__":
    main()
