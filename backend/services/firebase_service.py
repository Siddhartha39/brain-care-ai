from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import firebase_admin
from fastapi import HTTPException, status
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials, db

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DB_URL = "https://safe-f5b6b-default-rtdb.firebaseio.com"
SERVICE_ACCOUNT_PATH = Path(os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", BASE_DIR / "secrets" / "firebase-service-account.json"))


def initialize_firebase() -> None:
    if getattr(firebase_admin, "_apps", None):
        return

    if not SERVICE_ACCOUNT_PATH.exists():
        raise RuntimeError(f"Firebase service account file not found at {SERVICE_ACCOUNT_PATH}")

    firebase_admin.initialize_app(
        credentials.Certificate(str(SERVICE_ACCOUNT_PATH)),
        {"databaseURL": os.getenv("FIREBASE_DATABASE_URL", DEFAULT_DB_URL)},
    )


def extract_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


def verify_firebase_token(authorization: str | None, optional: bool = False) -> str:
    token = extract_bearer_token(authorization)
    if not token:
        if optional:
            return "anonymous_guest"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Firebase authorization token.",
        )

    try:
        initialize_firebase()
        decoded = firebase_auth.verify_id_token(token)
        return decoded["uid"]
    except Exception as exc:
        if optional:
            return "anonymous_guest"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token.",
        ) from exc



def build_scan_payload(
    prediction: str,
    confidence: float,
    probabilities: dict,
    original_image: str,
    gradcam_image: str,
    explanation: str,
    educational_info: str,
    status: str = "completed",
) -> dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "prediction": prediction,
        "confidence": float(confidence),
        "probabilities": probabilities,
        "original_image": original_image,
        "gradcam_image": gradcam_image,
        "explanation": explanation,
        "educational_info": educational_info,
        "status": status,
        "createdAt": now,
        "updatedAt": now,
    }


import json
import uuid
from threading import Lock

LOCAL_CACHE_PATH = BASE_DIR / "results" / "scans_cache.json"
_CACHE_LOCK = Lock()


def _load_local_cache() -> dict[str, dict[str, Any]]:
    if not LOCAL_CACHE_PATH.exists():
        return {}
    try:
        with open(LOCAL_CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_local_cache(data: dict[str, dict[str, Any]]) -> None:
    LOCAL_CACHE_PATH.parent.mkdir(exist_ok=True, parents=True)
    with _CACHE_LOCK:
        try:
            with open(LOCAL_CACHE_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass


def save_scan_record(uid: str, scan_data: dict[str, Any]) -> str:
    scan_id = f"-{uuid.uuid4().hex[:20]}"
    payload = {**scan_data, "id": scan_id, "uid": uid}

    # 1. Try Firebase RTDB
    try:
        initialize_firebase()
        scans_ref = db.reference(f"users/{uid}/scans")
        new_scan = scans_ref.push()
        scan_id = new_scan.key
        payload["id"] = scan_id
        new_scan.set(payload)
    except Exception:
        pass

    # 2. Dual-save to local cache
    cache = _load_local_cache()
    if uid not in cache:
        cache[uid] = {}
    cache[uid][scan_id] = payload
    _save_local_cache(cache)

    return scan_id


def get_user_scans(uid: str) -> list[dict[str, Any]]:
    records_dict: dict[str, dict[str, Any]] = {}

    # 1. Load from local cache
    cache = _load_local_cache()
    if uid in cache:
        records_dict.update(cache[uid])
    if "anonymous_guest" in cache and uid == "anonymous_guest":
        records_dict.update(cache["anonymous_guest"])
    elif uid != "anonymous_guest" and "anonymous_guest" in cache:
        # Also include guest scans so user sees previous scans
        records_dict.update(cache["anonymous_guest"])

    # 2. Merge from Firebase RTDB if available
    try:
        initialize_firebase()
        snapshot = db.reference(f"users/{uid}/scans").get()
        if snapshot and isinstance(snapshot, dict):
            for scan_id, scan_data in snapshot.items():
                if isinstance(scan_data, dict):
                    records_dict[scan_id] = {"id": scan_id, **scan_data}
    except Exception:
        pass

    records = list(records_dict.values())
    return sorted(records, key=lambda item: item.get("createdAt", ""), reverse=True)


def get_user_scan(uid: str, scan_id: str) -> dict[str, Any] | None:
    # 1. Check local cache
    cache = _load_local_cache()
    if uid in cache and scan_id in cache[uid]:
        return cache[uid][scan_id]
    for user_scans in cache.values():
        if scan_id in user_scans:
            return user_scans[scan_id]

    # 2. Check Firebase RTDB
    try:
        initialize_firebase()
        snapshot = db.reference(f"users/{uid}/scans/{scan_id}").get()
        if snapshot and isinstance(snapshot, dict):
            return {"id": scan_id, **snapshot}
    except Exception:
        pass

    return None

