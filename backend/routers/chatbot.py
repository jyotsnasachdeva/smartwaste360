from __future__ import annotations

import os

import google.generativeai as genai
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["chatbot"])

SYSTEM_PROMPT = (
    "You are WasteBot, a friendly waste management expert for SmartWaste360, "
    "a smart city waste system in India. Help citizens with: what bin to use "
    "(Blue=Recyclable, Green=Organic, Red=Hazardous, Black=General), recycling "
    "rules, sustainability tips, and waste reduction. Keep responses under 120 words. "
    "Be warm and practical. End each response with one green tip prefixed with 🌱. "
    "If asked about pizza box: explain clean parts are recyclable, greasy parts go to general/organic waste."
)


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


@router.post("/chatbot")
def chatbot(payload: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY", "")
    fallback = (
        "Clean dry recyclables belong in the Blue bin, food scraps go to Green, and batteries or chemicals "
        "should go to Red hazardous collection. If you’re unsure, keep mixed or dirty items out of recycling. "
        "🌱 Quick tip: Rinsing containers improves recycling quality."
    )

    if not api_key or api_key == "your_key_here":
        return {"response": fallback}

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
        history_text = "\n".join(f"{item.get('role', 'user')}: {item.get('content', '')}" for item in payload.history[-6:])
        prompt = f"{history_text}\nuser: {payload.message}" if history_text else payload.message
        result = model.generate_content(prompt)
        text = (result.text or fallback).strip()
        return {"response": text}
    except Exception:
        return {"response": fallback}
