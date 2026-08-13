from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, status

from services.firebase_service import get_user_scan, get_user_scans, verify_firebase_token

router = APIRouter()


@router.get("/scans")
async def list_scans(authorization: str | None = Header(default=None, alias="Authorization")):
    try:
        uid = verify_firebase_token(authorization, optional=True)
    except HTTPException:
        raise

    return {"success": True, "scans": get_user_scans(uid)}


@router.get("/scans/{scan_id}")
async def get_scan(scan_id: str, authorization: str | None = Header(default=None, alias="Authorization")):
    uid = verify_firebase_token(authorization, optional=True)

    record = get_user_scan(uid, scan_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found.")
    return {"success": True, "scan": record}
