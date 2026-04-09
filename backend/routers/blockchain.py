from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import BlockchainLedger, User, get_db
from routers.utils import log_blockchain_event

router = APIRouter(prefix="/api/blockchain", tags=["blockchain"])


class DisposalPayload(BaseModel):
    user_id: int = 1
    waste_type: str = "plastic_bottle"
    is_recyclable: bool = True


@router.post("/log-disposal")
def log_disposal(payload: DisposalPayload, db: Session = Depends(get_db)):
    points = 10 if payload.is_recyclable else 5
    user = db.query(User).filter(User.id == payload.user_id).first()
    if user:
        user.green_points += points
        if payload.is_recyclable:
            user.items_recycled += 1

    record = log_blockchain_event(
        db,
        "POINTS_AWARDED",
        {
            "user_id": payload.user_id,
            "waste_type": payload.waste_type,
            "is_recyclable": payload.is_recyclable,
            "points": points,
        },
    )
    return {"tx_hash": record.tx_hash, "points_awarded": points, "verified": True}


@router.get("/user-records/{user_id}")
def user_records(user_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(BlockchainLedger)
        .order_by(BlockchainLedger.timestamp.desc())
        .limit(30)
        .all()
    )
    return [
        {
            "tx_hash": item.tx_hash,
            "event_type": item.event_type,
            "payload_json": item.payload_json,
            "timestamp": item.timestamp.isoformat(),
            "verified": item.verified,
        }
        for item in records
    ]


@router.get("/all-records")
def all_records(db: Session = Depends(get_db)):
    records = db.query(BlockchainLedger).order_by(BlockchainLedger.timestamp.desc()).limit(100).all()
    return [
        {
            "tx_hash": item.tx_hash,
            "event_type": item.event_type,
            "payload_json": item.payload_json,
            "timestamp": item.timestamp.isoformat(),
            "verified": item.verified,
        }
        for item in records
    ]
