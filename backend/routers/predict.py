from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import Bin, get_db
from inference.predictor import predict_fill_time

router = APIRouter(prefix="/api", tags=["predict"])


@router.get("/predict/all")
def predict_all(db: Session = Depends(get_db)):
    bins = db.query(Bin).order_by(Bin.fill_level.desc()).all()
    return [
        {
            "bin_id": waste_bin.id,
            "name": waste_bin.name,
            "bin_type": waste_bin.bin_type,
            "fill_level": waste_bin.fill_level,
            **predict_fill_time(waste_bin.id, waste_bin.fill_level),
        }
        for waste_bin in bins
    ]
