from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import User, get_db

router = APIRouter(prefix="/api", tags=["leaderboard"])


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.green_points.desc()).limit(20).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "green_points": user.green_points,
            "items_classified": user.items_classified,
            "items_recycled": user.items_recycled,
            "co2_saved": round(user.items_recycled * 0.5, 1),
        }
        for user in users
    ]
