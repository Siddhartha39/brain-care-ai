from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Header, HTTPException, UploadFile, status

from services.firebase_service import build_scan_payload, save_scan_record, verify_firebase_token
from services.gemini_service import build_fallback_explanation
from services.gradcam import generate_gradcam_image
from services.image_utils import validate_mri_image
from services.prediction import predict_image

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("/analyze")
async def analyze_mri(
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):
    uid = verify_firebase_token(authorization, optional=True)

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image file type. Please upload a JPG, JPEG, or PNG brain MRI image.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image is too large. Please upload a smaller file.")

    extension = ".png" if file.content_type == "image/png" else ".jpg"
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename
    file_path.write_bytes(file_bytes)

    # Validate image to reject non-MRI screenshots, text tables, documents, or photos
    is_valid, validation_msg = validate_mri_image(file_path)
    if not is_valid:
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=validation_msg)

    try:
        prediction_result = predict_image(file_path)

        gradcam_path = generate_gradcam_image(file_path, prediction_result["prediction_index"])
        explanation = build_fallback_explanation(
            prediction_result["prediction"],
            prediction_result["confidence"],
            prediction_result["probabilities"],
        )

        original_image_path = f"/uploads/{filename}"
        gradcam_image_path = f"/results/{file_path.stem}_gradcam.jpg"

        payload = build_scan_payload(
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            probabilities=prediction_result["probabilities"],
            original_image=original_image_path,
            gradcam_image=gradcam_image_path,
            explanation=explanation,
            educational_info=explanation,
        )
        scan_id = save_scan_record(uid, payload)

        return {
            "success": True,
            "scan_id": scan_id,
            "prediction": prediction_result["prediction"],
            "confidence": round(float(prediction_result["confidence"]), 4),
            "probabilities": {key: round(float(value), 4) for key, value in prediction_result["probabilities"].items()},
            "original_image": original_image_path,
            "gradcam_image": gradcam_image_path,
            "explanation": explanation,
            "educational_info": explanation,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to analyze the image. Please try again.")
