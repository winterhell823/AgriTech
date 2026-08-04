"""
Explainability REST API Route
-----------------------------
POST /api/v1/explain
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.explainability.shap_explainer import calculate_stress_feature_importance

router = APIRouter()

class ExplainRequest(BaseModel):
    field_id: str = "1024"
    moisture_stress: str = "Moderate"

class FeatureAttribution(BaseModel):
    feature: str
    percentage: float
    trend: str

class ExplainResponse(BaseModel):
    field_id: str
    moisture_stress: str
    rationale: str
    feature_attributions: List[FeatureAttribution]

@router.post("/explain", response_model=ExplainResponse)
def explain_field_stress(request: ExplainRequest):
    result = calculate_stress_feature_importance()
    return ExplainResponse(
        field_id=request.field_id,
        moisture_stress=request.moisture_stress,
        rationale=result["rationale"],
        feature_attributions=result["feature_attributions"]
    )