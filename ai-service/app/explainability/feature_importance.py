"""
Feature Importance Analysis Module for Crop Intelligence Predictions
"""
from typing import Dict, Any

def get_feature_importance_scores() -> Dict[str, float]:
    return {
        "NDVI": 0.35,
        "NDWI": 0.25,
        "SAR_VV": 0.20,
        "Temperature": 0.12,
        "Rainfall": 0.08
    }
