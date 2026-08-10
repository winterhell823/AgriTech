"""
Moisture Stress Analysis API Route
----------------------------------
POST /api/v1/stress
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.inference.predictor import run_field_prediction

router = APIRouter()

class StressRequest(BaseModel):
    field_id: str = Field(default="1024", description="Field ID")
    bbox: list = Field(default=[75.5, 30.5, 76.5, 31.5], description="Bounding box")

class StressResponse(BaseModel):
    field_id: str
    moisture_stress: str
    confidence: float
    irrigation_priority: str

@router.post("/stress", response_model=StressResponse)
def analyze_field_stress(request: StressRequest):
    pred = run_field_prediction(request.field_id, request.bbox)
    stress = pred["moisture_stress"]
    
    priorities = {
        "Healthy": "Low",
        "Mild": "Medium",
        "Moderate": "High",
        "Severe": "Critical"
    }
    
    return StressResponse(
        field_id=request.field_id,
        moisture_stress=stress,
        confidence=pred["stress_confidence"],
        irrigation_priority=priorities.get(stress, "Medium")
    )
