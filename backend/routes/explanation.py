from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.gemini_service import generate_explanation

router = APIRouter()


class ExplanationRequest(BaseModel):
    prediction: str
    confidence: float
    probabilities: dict


@router.post("/explain")
async def explain(request: ExplanationRequest):
    try:
        explanation = generate_explanation(request.prediction, request.confidence, request.probabilities)
        return {"success": True, "explanation": explanation}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to generate explanation.") from exc
