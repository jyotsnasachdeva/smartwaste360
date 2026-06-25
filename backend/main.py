from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, init_db
from mock_data import seed_database
from routers import bins, blockchain, chatbot, classify, complaints, detect, leaderboard, predict, routes

app = FastAPI(title="SmartWaste360 API", version="1.0.0")

def parse_origins(value: str) -> list[str]:
    return [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://jyotsna-smartwaste360.vercel.app",
    "https://smartwaste360.vercel.app",
    *parse_origins(os.getenv("FRONTEND_URL", "")),
    *parse_origins(os.getenv("FRONTEND_URLS", "")),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(allowed_origins)),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
        db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "SmartWaste360 backend online", "status": "ok"}


app.include_router(classify.router)
app.include_router(detect.router)
app.include_router(predict.router)
app.include_router(bins.router)
app.include_router(routes.router)
app.include_router(chatbot.router)
app.include_router(blockchain.router)
app.include_router(complaints.router)
app.include_router(leaderboard.router)
