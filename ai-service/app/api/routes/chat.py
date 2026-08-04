"""
RAG AI Assistant REST API Route
-------------------------------
POST /api/v1/chat
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.chatbot import generate_ai_assistant_response

router = APIRouter()

class ChatRequest(BaseModel):
    field_id: str = "1024"
    crop_type: str = "Wheat"
    phenology_stage: str = "Flowering"
    moisture_stress: str = "Moderate"
    user_question: str = "Why is this field under moderate moisture stress?"

class ChatResponse(BaseModel):
    answer: str

@router.post("/chat", response_model=ChatResponse)
def chat_ai_assistant(request: ChatRequest):
    answer = generate_ai_assistant_response(
        field_id=request.field_id,
        crop=request.crop_type,
        stage=request.phenology_stage,
        stress=request.moisture_stress,
        user_question=request.user_question
    )
    return ChatResponse(answer=answer)