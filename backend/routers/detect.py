from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from database import Alert, get_db
from inference.detector import detect_waste
from routers.utils import log_blockchain_event

router = APIRouter(prefix="/api", tags=["detect"])


@router.post("/detect/camera")
async def detect_camera_image(
    image: UploadFile = File(...),
    camera_id: str = Form("CAM-01"),
    location: str = Form("Mall Road Bin"),
    db: Session = Depends(get_db),
):
    result = detect_waste(image)
    tx_hash = None

    if result["is_illegal_dumping"]:
        lead = result["detections"][0]
        ledger = log_blockchain_event(
            db,
            "ALERT_RAISED",
            {
                "camera_id": camera_id,
                "location": location,
                "detected_class": lead["class_name"],
                "confidence": lead["confidence"],
            },
        )
        tx_hash = ledger.tx_hash
        db.add(
            Alert(
                camera_id=camera_id,
                location=location,
                detected_class=lead["class_name"],
                confidence=lead["confidence"],
                is_illegal=True,
                status="Open",
                tx_hash=ledger.tx_hash,
            )
        )

    return {**result, "tx_hash": tx_hash}
