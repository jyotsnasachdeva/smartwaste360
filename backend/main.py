from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, init_db
from mock_data import seed_database
from routers import bins, blockchain, chatbot, classify, complaints, detect, leaderboard, predict, routes

app = FastAPI(title="SmartWaste360 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
