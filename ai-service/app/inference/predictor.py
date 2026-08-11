"""
High-Level Production Predictor Engine
--------------------------------------
Wraps model evaluation, preprocessing, live weather fetching,
and post-processing for a single field prediction request.
"""

import torch
import numpy as np
from app.inference.model_loader import get_loaded_model
from app.inference.postprocessing import postprocess_predictions
from app.preprocessing.optical_preprocessing import normalize_6band_tensor
from app.preprocessing.weather_preprocessing import fetch_grid_weather

def run_field_prediction(field_id: str, bbox: list, optical_np: np.ndarray = None, sar_np: np.ndarray = None) -> dict:
    """
    Executes multimodal multi-task inference pipeline for field.
    """
    model = get_loaded_model()
    device = next(model.parameters()).device

    if optical_np is None or optical_np.shape != (6, 512, 512):
        optical_np = np.zeros((6, 512, 512), dtype=np.float32)
    optical_np = normalize_6band_tensor(optical_np)

    if sar_np is None or sar_np.shape != (3, 512, 512):
        sar_np = np.zeros((3, 512, 512), dtype=np.float32)

    weather_vec = fetch_grid_weather(bbox)

    opt_tensor = torch.tensor(optical_np, dtype=torch.float32).unsqueeze(0).to(device)
    sar_tensor = torch.tensor(sar_np, dtype=torch.float32).unsqueeze(0).to(device)
    weather_tensor = torch.tensor(weather_vec, dtype=torch.float32).unsqueeze(0).to(device)

    model.eval()
    with torch.no_grad():
        outputs = model(opt_tensor, sar_tensor, weather_tensor)

    results = postprocess_predictions(outputs)
    results["field_id"] = field_id
    results["bbox"] = bbox
    results["opt_tensor"] = opt_tensor
    results["sar_tensor"] = sar_tensor
    results["weather_tensor"] = weather_tensor
    results["optical_np"] = optical_np
    return results
