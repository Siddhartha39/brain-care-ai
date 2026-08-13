from __future__ import annotations

from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Image as RLImage, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

BASE_DIR = Path(__file__).resolve().parents[1]


def resolve_local_path(image_path: str) -> Path | None:
    if not image_path:
        return None
    cleaned = image_path.lstrip("/")
    full_path = BASE_DIR / cleaned
    if full_path.exists() and full_path.is_file():
        return full_path
    path_obj = Path(image_path)
    if path_obj.exists() and path_obj.is_file():
        return path_obj
    return None


def generate_pdf_report(
    scan_id: str,
    prediction: str,
    confidence: float,
    probabilities: dict,
    image_path: str,
    gradcam_path: str,
    explanation: str,
    educational_info: str,
) -> str:
    output_dir = BASE_DIR / "results"
    output_dir.mkdir(exist_ok=True, parents=True)
    output_path = output_dir / f"{scan_id}_report.pdf"

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1e1b4b'),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b'),
    )
    heading_style = ParagraphStyle(
        'DocHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#312e81'),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
    )
    disclaimer_style = ParagraphStyle(
        'DocDisclaimer',
        parent=styles['BodyText'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#991b1b'),
    )

    story = []

    # Header
    story.append(Paragraph("BrainCare AI — Medical Analysis Report", title_style))
    story.append(Paragraph(f"Scan Reference: <b>{scan_id}</b> | Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", subtitle_style))
    story.append(Spacer(1, 14))

    # Prediction Summary Box
    conf_pct = f"{confidence * 100:.1f}%" if confidence <= 1.0 else f"{confidence:.1f}%"
    summary_text = (
        f"<b>Predicted Classification:</b> <font color='#4338ca'>{prediction.upper()}</font><br/>"
        f"<b>Model Confidence:</b> {conf_pct}<br/>"
        f"<b>Preliminary Status:</b> AI-Assisted Scan Assessment Completed"
    )
    summary_table = Table([[Paragraph(summary_text, body_style)]], colWidths=[520])
    summary_table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e0e7ff')),
            ('PADDING', (0, 0), (-1, -1), 12),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#c7d2fe')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
    )
    story.append(summary_table)
    story.append(Spacer(1, 16))

    # Visual Comparison Section (Original MRI vs Grad-CAM)
    orig_file = resolve_local_path(image_path)
    grad_file = resolve_local_path(gradcam_path)

    if orig_file or grad_file:
        story.append(Paragraph("MRI Visual Analysis & Explainable AI (Grad-CAM)", heading_style))
        img_cells = []

        if orig_file:
            img_cells.append([
                RLImage(str(orig_file), width=200, height=200),
                Paragraph("<b>Original Input MRI</b>", body_style),
            ])
        if grad_file:
            img_cells.append([
                RLImage(str(grad_file), width=200, height=200),
                Paragraph("<b>Grad-CAM Activation Heatmap</b>", body_style),
            ])

        if len(img_cells) == 2:
            visual_table = Table(
                [[img_cells[0][0], img_cells[1][0]], [img_cells[0][1], img_cells[1][1]]],
                colWidths=[250, 250],
            )
            visual_table.setStyle(
                TableStyle([
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
                ])
            )
            story.append(visual_table)
            story.append(Spacer(1, 16))

    # Probability Distribution Table
    story.append(Paragraph("Class Probability Breakdown", heading_style))
    table_data = [["Tumor / Tissue Classification", "Model Probability Score"]]
    for key, value in probabilities.items():
        prob_val = float(value)
        prob_str = f"{prob_val * 100:.2f}%" if prob_val <= 1.0 else f"{prob_val:.2f}%"
        table_data.append([key.capitalize(), prob_str])

    prob_table = Table(table_data, colWidths=[300, 220])
    prob_table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e1b4b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ])
    )
    story.append(prob_table)
    story.append(Spacer(1, 16))

    # AI Explanation & Clinical Guidance
    story.append(Paragraph("Clinical Analysis & Diagnostic Summary", heading_style))
    story.append(Paragraph(explanation, body_style))
    story.append(Spacer(1, 12))

    if educational_info and educational_info != explanation:
        story.append(Paragraph("Pathological & Spatial Indications", heading_style))
        story.append(Paragraph(educational_info, body_style))
        story.append(Spacer(1, 12))

    # Official Validation Callout Box
    story.append(Spacer(1, 10))
    disclaimer_text = (
        "<b>OFFICIAL CLINICAL VALIDATION NOTICE:</b> BrainCare AI is an Enterprise Clinical Decision Support Engine. "
        "The preliminary classification, probability breakdown, and Grad-CAM spatial activation maps contained in this report "
        "are generated for official diagnostic support and radiological verification."
    )
    disc_table = Table([[Paragraph(disclaimer_text, disclaimer_style)]], colWidths=[520])
    disc_table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
            ('PADDING', (0, 0), (-1, -1), 10),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#86efac')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
    )
    story.append(disc_table)

    doc.build(story)
    return str(output_path)


