from __future__ import annotations

from pathlib import Path
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import FileResponse

from services.firebase_service import get_user_scan, verify_firebase_token
from services.report import generate_pdf_report

router = APIRouter()


@router.get("/documentation/pdf")
async def download_documentation_pdf():
    doc_path = Path(__file__).resolve().parents[1] / "results" / "BrainCare_AI_Full_Documentation.pdf"
    if not doc_path.exists():
        from generate_documentation_pdf import create_braincare_documentation_pdf
        doc_path.parent.mkdir(exist_ok=True, parents=True)
        create_braincare_documentation_pdf(str(doc_path))
    return FileResponse(str(doc_path), media_type="application/pdf", filename="BrainCare_AI_Full_Documentation.pdf")


@router.get("/reports/{scan_id}/pdf")
async def generate_report_pdf(scan_id: str, authorization: str | None = Header(default=None, alias="Authorization")):

    try:
        uid = verify_firebase_token(authorization, optional=True)
        scan = get_user_scan(uid, scan_id)
        if scan is None:
            raise HTTPException(status_code=404, detail="Scan not found.")

        output_path = generate_pdf_report(
            scan_id=scan_id,
            prediction=scan.get("prediction", "unknown"),
            confidence=float(scan.get("confidence", 0.0)),
            probabilities=scan.get("probabilities", {}),
            image_path=scan.get("original_image", ""),
            gradcam_path=scan.get("gradcam_image", ""),
            explanation=scan.get("explanation", "AI-assisted explanation"),
            educational_info=scan.get("educational_info", "Educational information"),
        )
        return FileResponse(output_path, media_type="application/pdf", filename=f"{scan_id}_report.pdf")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to generate PDF report.") from exc


@router.get("/docs/download/pdf")
async def download_documentation_pdf():
    doc_path = Path(__file__).resolve().parents[1] / "results" / "BrainCare_AI_Full_Documentation.pdf"
    if not doc_path.exists():
        from generate_documentation_pdf import create_braincare_documentation_pdf
        doc_path.parent.mkdir(exist_ok=True, parents=True)
        create_braincare_documentation_pdf(str(doc_path))
    return FileResponse(str(doc_path), media_type="application/pdf", filename="BrainCare_AI_Full_Documentation.pdf")

