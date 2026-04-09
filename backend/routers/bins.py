from __future__ import annotations

import random

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import Bin, get_db
from inference.predictor import predict_fill_time

router = APIRouter(prefix="/api", tags=["bins"])


@router.get("/bins/status")
def get_bin_status(db: Session = Depends(get_db)):
    bins = db.query(Bin).all()
    response = []
    for waste_bin in bins:
        waste_bin.fill_level = round(min(98, waste_bin.fill_level + random.uniform(0.5, 2.5)), 1)
        prediction = predict_fill_time(waste_bin.id, waste_bin.fill_level)
        response.append(
            {
                "id": waste_bin.id,
                "name": waste_bin.name,
                "lat": waste_bin.lat,
                "lng": waste_bin.lng,
                "fill_level": waste_bin.fill_level,
                "bin_type": waste_bin.bin_type,
                "last_collected": waste_bin.last_collected.isoformat(),
                "prediction": prediction,
                "temperature_c": random.randint(24, 36),
            }
        )
    return response
