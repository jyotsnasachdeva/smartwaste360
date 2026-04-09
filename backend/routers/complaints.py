from __future__ import annotations

import hashlib
import json
from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Complaint, get_db
from routers.utils import log_blockchain_event

router = APIRouter(prefix="/api", tags=["complaints"])


class ComplaintCreate(BaseModel):
    user_id: int = 1
    title: str
    type: str
    description: str
    location: str


@router.post("/complaints", status_code=201)
def create_complaint(payload: ComplaintCreate, db: Session = Depends(get_db)):
    raw = json.dumps(payload.dict(), sort_keys=True) + datetime.utcnow().isoformat()
    tx_hash = "0x" + hashlib.sha256(raw.encode()).hexdigest()
    complaint = Complaint(
        user_id=payload.user_id,
        title=payload.title,
        type=payload.type,
        description=payload.description,
        location=payload.location,
        status="Pending",
        tx_hash=tx_hash,
    )
    db.add(complaint)
    log_blockchain_event(db, "COMPLAINT_LOGGED", {**payload.dict(), "tx_hash": tx_hash})
    db.flush()
    return {
        "id": complaint.id,
        "title": complaint.title,
        "type": complaint.type,
        "description": complaint.description,
        "location": complaint.location,
        "status": complaint.status,
        "tx_hash": complaint.tx_hash,
        "created_at": complaint.created_at.isoformat(),
    }


@router.get("/complaints/{user_id}")
def get_user_complaints(user_id: int, db: Session = Depends(get_db)):
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).order_by(Complaint.created_at.desc()).all()
    return [
        {
            "id": item.id,
            "title": item.title,
            "type": item.type,
            "description": item.description,
            "location": item.location,
            "status": item.status,
            "tx_hash": item.tx_hash,
            "created_at": item.created_at.isoformat(),
        }
        for item in complaints
    ]
