from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from database import User, get_db
from inference.classifier import classify_waste
from inference.detector import detect_waste
from routers.utils import log_blockchain_event

router = APIRouter(prefix="/api", tags=["classify"])


@router.post("/classify")
async def classify_image(image: UploadFile = File(...), db: Session = Depends(get_db)):
    classification = classify_waste(image)
    detection = detect_waste(image)

    user = db.query(User).filter(User.id == 1).first()
    if user:
        user.items_classified += 1
        if classification["is_recyclable"]:
            user.items_recycled += 1

    ledger = log_blockchain_event(
        db,
        "DISPOSAL_LOGGED",
        {
            "user_id": 1,
            "filename": image.filename,
            "classification": classification["class"],
            "confidence": classification["confidence"],
        },
    )
    return {
        "classification": classification,
        "detection": detection,
        "blockchain": {"tx_hash": ledger.tx_hash, "verified": ledger.verified},
    }
