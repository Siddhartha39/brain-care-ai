import os
import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "BrainCare AI — Comprehensive Technical & Clinical Documentation")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 742, 558, 742)

        # Footer (All pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — FOR CLINICAL PRESENTATION & DEMONSTRATION")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 48, 558, 48)
        self.restoreState()


def create_braincare_documentation_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#1E3A8A")     # Deep Blue
    SECONDARY = colors.HexColor("#0284C7")   # Medical Cyan
    DARK_TEXT = colors.HexColor("#0F172A")   # Slate 900
    MUTED_TEXT = colors.HexColor("#475569")  # Slate 600
    BG_LIGHT = colors.HexColor("#F8FAFC")    # Slate 50
    ACCENT_BG = colors.HexColor("#EFF6FF")   # Blue 50
    BORDER_COLOR = colors.HexColor("#CBD5E1")# Slate 300

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=SECONDARY,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=22,
        textColor=PRIMARY,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=DARK_TEXT,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'DocCallout',
        parent=body_style,
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=PRIMARY
    )

    qa_q_style = ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14.5,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    qa_a_style = ParagraphStyle(
        'QAAnswer',
        parent=body_style,
        leftIndent=10,
        spaceAfter=8
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("BrainCare AI Platform", title_style))
    story.append(Paragraph("Full Technical Architecture, Deep Learning Specification & Clinical Defense Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceBefore=0, spaceAfter=15))

    # Executive Overview
    story.append(Paragraph("1. Executive Overview & Platform Vision", h1_style))
    overview_text = (
        "<b>BrainCare AI</b> is an enterprise-grade Clinical Decision Support System (CDSS) engineered to assist "
        "radiologists, neurologists, and clinical oncologists in the rapid, automated classification of brain MRI scans. "
        "Leveraging deep convolutional neural networks (CNNs), spatial visual explainability via Grad-CAM, and multimodal "
        "Generative AI via Google Gemini Vision, BrainCare AI provides instantaneous 4-class pathology identification "
        "alongside verifiable visual heatmaps and medical report generation."
    )
    story.append(Paragraph(overview_text, body_style))

    # System Architecture Section
    story.append(Paragraph("2. System Architecture & Tech Stack", h1_style))
    arch_intro = (
        "The application is structured into a modern, decoupled client-server architecture designed for real-time inference, "
        "high concurrency, and seamless clinical user experience:"
    )
    story.append(Paragraph(arch_intro, body_style))

    tech_table_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology</b>", body_style), Paragraph("<b>Clinical Purpose & Responsibility</b>", body_style)],
        [Paragraph("Frontend UI", body_style), Paragraph("React 18 + Vite + TailwindCSS", body_style), Paragraph("Responsive web interface, real-time scan analysis status, Interactive Lottie animations, PDF report portal.", body_style)],
        [Paragraph("Backend REST API", body_style), Paragraph("FastAPI (Python 3.12)", body_style), Paragraph("Asynchronous HTTP endpoints (`/api/analyze`, `/api/scans`), image validation pre-screening, model inference handler.", body_style)],
        [Paragraph("Deep Learning Engine", body_style), Paragraph("MobileNetV2 + Keras / TensorFlow 2.18", body_style), Paragraph("Deep convolutional feature extraction, transfer learning classification across 4 MRI diagnostic classes.", body_style)],
        [Paragraph("Spatial Explainability", body_style), Paragraph("Grad-CAM (Class Activation Mapping)", body_style), Paragraph("Superimposes 2D Jet colormap heatmaps on MRI scans to visually highlight tumor regions.", body_style)],
        [Paragraph("Generative AI", body_style), Paragraph("Google Gemini Vision (`gemini-1.5-flash`)", body_style), Paragraph("Multimodal radiological narrative generator providing clinical findings, recommendations, and feature notes.", body_style)],
        [Paragraph("Database & Auth", body_style), Paragraph("Firebase Auth + Realtime Database", body_style), Paragraph("Secure Google OAuth / Email auth, dual-storage RTDB persistence with local JSON cache fallback.", body_style)],
        [Paragraph("PDF Report Generator", body_style), Paragraph("ReportLab PDF Engine", body_style), Paragraph("Generates downloadable, printable clinical diagnostic PDF reports with embedded heatmaps.", body_style)]
    ]

    t_tech = Table(tech_table_data, colWidths=[110, 140, 254])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    # Deep Learning Specification Section
    story.append(Paragraph("3. Deep Learning Engine & Training Specifications", h1_style))
    story.append(Paragraph(
        "The core diagnostic classifier is built upon a fine-tuned <b>MobileNetV2</b> transfer learning architecture, "
        "chosen for its superior depthwise separable convolutions, high computational efficiency, and robust feature representations.",
        body_style
    ))

    model_metrics_data = [
        [Paragraph("<b>Metric / Parameter</b>", body_style), Paragraph("<b>Specification & Value</b>", body_style)],
        [Paragraph("Training Dataset", body_style), Paragraph("7,153 Kaggle Brain MRI images across 4 classes (Glioma: 1,621, Meningioma: 1,775, No Tumor: 2,000, Pituitary: 1,757)", body_style)],
        [Paragraph("Input Image Tensor", body_style), Paragraph("(224, 224, 3) RGB normalized using MobileNetV2 scaling: <i>x_norm = (x / 127.5) - 1.0</i>", body_style)],
        [Paragraph("Classification Classes", body_style), Paragraph("`glioma`, `meningioma`, `notumor`, `pituitary`", body_style)],
        [Paragraph("Overall Model Accuracy", body_style), Paragraph("<b>95.31%</b> on 1,431 unseen validation MRI scans", body_style)],
        [Paragraph("Model Precision Score", body_style), Paragraph("<b>95.63%</b>", body_style)],
        [Paragraph("Model Recall Score", body_style), Paragraph("<b>94.97%</b>", body_style)],
        [Paragraph("Loss Function & Optimizer", body_style), Paragraph("Categorical Cross-Entropy | Adam Optimizer (Initial LR: 2e-4 with ReduceLROnPlateau)", body_style)]
    ]

    t_model = Table(model_metrics_data, colWidths=[150, 354])
    t_model.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_model)
    story.append(Spacer(1, 10))

    # Pre-screening & Safety Filter
    story.append(Paragraph("4. Multi-Stage Pre-Screening MRI Guard", h1_style))
    story.append(Paragraph(
        "To prevent Out-of-Distribution (OOD) errors (such as users uploading non-medical photos, text documents, or UI screenshots), "
        "BrainCare AI executes a <b>4-Stage Permissive Validation Pipeline</b> in <code>image_utils.py</code> before feeding tensors to the CNN:",
        body_style
    ))
    story.append(Paragraph("• <b>Stage 1 — File Format & Integrity:</b> Verifies image header uncorrupted and format is JPEG/PNG.", bullet_style))
    story.append(Paragraph("• <b>Stage 2 — Minimum Resolution Check:</b> Rejects tiny icon thumbnails (< 50x50 px).", bullet_style))
    story.append(Paragraph("• <b>Stage 3 — Grayscale Color Variance Check:</b> Brain MRI scans are grayscale (|R-G| + |G-B| + |B-R| ≈ 0). Full-color photos (>35.0 threshold) are rejected.", bullet_style))
    story.append(Paragraph("• <b>Stage 4 — Frame Permissiveness:</b> Accommodates medical MRI scans with white rectangular borders, padding margins, or DICOM text overlays.", bullet_style))
    story.append(Spacer(1, 10))

    # Grad-CAM Explainability Section
    story.append(Paragraph("5. Spatial Explainability via Grad-CAM", h1_style))
    story.append(Paragraph(
        "Medical AI must never be a black box. BrainCare AI computes <b>Gradient-weighted Class Activation Maps (Grad-CAM)</b> "
        "from the final convolutional feature maps (7x7x1280). The intensity weights represent the precise spatial regions "
        "that influenced the neural network's classification decision, rendered as a 2D Jet colormap overlay over the original MRI scan.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Comprehensive Defense Q&A Section
    story.append(PageBreak())
    story.append(Paragraph("6. Frequently Asked Questions (FAQ) & Defense Guide", h1_style))
    story.append(Paragraph(
        "Use this section to confidently answer technical, clinical, and architectural questions during presentations, code reviews, or viva evaluations:",
        body_style
    ))

    qa_list = [
        ("Q1: What are the 4 target classes supported by BrainCare AI?",
         "Answer: The 4 classes are: (1) Glioma (primary brain tumor originating from glial cells), (2) Meningioma (tumor arising from the meninges layers surrounding the brain), (3) Pituitary (tumor occurring in the pituitary gland at the skull base), and (4) No Tumor (healthy brain parenchyma without neoplastic mass findings)."),

        ("Q2: Why was MobileNetV2 chosen over standard CNNs or ResNet50?",
         "Answer: MobileNetV2 utilizes depthwise separable convolutions which dramatically reduce parameter count (3.4M parameters) while maintaining high representation capacity. It delivers rapid inference (<120ms per scan) making it ideal for real-time web REST API backends."),

        ("Q3: How was the false 'Glioma 100%' prediction issue resolved?",
         "Answer: Early inference passed raw pixel values in range [0, 255] into a model trained on normalized images in range [-1.0, 1.0]. The unnormalized inputs saturated softmax activations on class index 0 (Glioma). Standardizing inference preprocessing to `(x / 127.5) - 1.0` matching MobileNetV2 solved the issue completely."),

        ("Q4: How does the system handle non-MRI image uploads?",
         "Answer: Before CNN inference, `validate_mri_image` checks color channel variance. MRI scans are grayscale (R=G=B). If an uploaded image contains high color variance (>35.0), it is immediately rejected with HTTP 400 Bad Request error."),

        ("Q5: How does Grad-CAM benefit radiologists?",
         "Answer: Grad-CAM highlights the exact anatomical regions that triggered the model's prediction. Radiologists can visually verify whether the AI focused on the actual tumor lesion rather than background noise, building clinical trust."),

        ("Q6: How does Google Gemini Vision integrate with the platform?",
         "Answer: The prediction outputs and original MRI scan image are sent to Google Gemini Vision (`gemini-1.5-flash`). Gemini generates a 3-part clinical narrative: (1) Pathology Overview, (2) Radiologist Decision Note, and (3) Anatomical Feature Highlights."),

        ("Q7: How is patient data persisted and secured?",
         "Answer: Scan records are saved dynamically to Firebase Realtime Database indexed by Firebase User UID. For resilience, a local JSON cache fallback (`results/scans_cache.json`) guarantees history availability even during offline/network degradation."),

        ("Q8: Why did Google OAuth fail initially with `auth/unauthorized-domain`?",
         "Answer: Firebase Auth enforces strict domain origin policies. Running on `localhost:5173` requires adding `localhost` and `127.0.0.1` under Firebase Console -> Authentication -> Settings -> Authorized Domains."),

        ("Q9: What is the clinical validation baseline of the model?",
         "Answer: Evaluated on 1,431 unseen validation images, the model achieved 95.31% Overall Accuracy, 95.63% Precision, and 94.97% Recall, matching peer-reviewed literature benchmarks for brain MRI classification.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(f"<b>{q}</b>", qa_q_style))
        story.append(Paragraph(a, qa_a_style))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated documentation PDF at: {output_path}")

if __name__ == "__main__":
    output_pdf = "/Users/siddhartha/Desktop/aad/projects/brain2/BrainCare/backend/results/BrainCare_AI_Full_Documentation.pdf"
    create_braincare_documentation_pdf(output_pdf)
