"""
Phenological Growth Stage API Route
-----------------------------------
POST /api/v1/phenology
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.inference.predictor import run_field_prediction

router = APIRouter()

class PhenologyRequest(BaseModel):
    field_id: str = Field(default="1024", description="Field ID")
    bbox: list = Field(default=[75.5, 30.5, 76.5, 31.5], description="Bounding box")

class PhenologyResponse(BaseModel):
    field_id: str
    phenology_stage: str
    confidence: float
    recommended_action: str

@router.post("/phenology", response_model=PhenologyResponse)
def analyze_field_phenology(request: PhenologyRequest):
    pred = run_field_prediction(request.field_id, request.bbox)
    stage = pred["phenology_stage"]
    
    actions = {
        "Germination": "Ensure adequate soil moisture for seedling emergence.",
        "Vegetative": "Apply nitrogen fertilizer and monitor weed competition.",
        "Flowering": "Maintain critical irrigation; avoid moisture stress during anthesis.",
        "Maturity": "Prepare for harvest; monitor grain moisture content.",
        "Harvest": "Crop is ready for harvest."
    }
    
    return PhenologyResponse(
        field_id=request.field_id,
        phenology_stage=stage,
        confidence=pred["phenology_confidence"],
        recommended_action=actions.get(stage, "Monitor crop condition regularly.")
    )
