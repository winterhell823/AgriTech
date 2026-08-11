"""
Inference Post-Processing Module
--------------------------------
Applies softmax probability scaling, confidence estimation,
and string label decoding from model output logit dictionary.
"""

import torch

CROP_CLASSES = {0: "Rice", 1: "Wheat", 2: "Maize", 3: "Cotton", 4: "Sugarcane", 5: "Other"}
PHENOLOGY_STAGES = {0: "Germination", 1: "Vegetative", 2: "Flowering", 3: "Maturity", 4: "Harvest"}
STRESS_LEVELS = {0: "Healthy", 1: "Mild", 2: "Moderate", 3: "Severe"}

def postprocess_predictions(model_outputs: dict, temperature: float = 0.5) -> dict:
    """
    Given raw PyTorch logit tensors dict from CropIntelligenceMultimodalModel:
    {'crop_type': tensor, 'phenology_stage': tensor, 'moisture_stress': tensor},
    applies Temperature-Scaled Softmax (T=0.5) calibration and decodes class predictions.
    """
    # Crop Type
    crop_logits = model_outputs["crop_type"]
    crop_probs = torch.softmax(crop_logits / temperature, dim=1)[0]
    crop_idx = int(torch.argmax(crop_probs).item())
    crop_conf = round(float(crop_probs[crop_idx].item()), 4)

    # Phenology Stage
    stage_logits = model_outputs["phenology_stage"]
    stage_probs = torch.softmax(stage_logits / temperature, dim=1)[0]
    stage_idx = int(torch.argmax(stage_probs).item())
    stage_conf = round(float(stage_probs[stage_idx].item()), 4)

    # Moisture Stress
    stress_logits = model_outputs["moisture_stress"]
    stress_probs = torch.softmax(stress_logits / temperature, dim=1)[0]
    stress_idx = int(torch.argmax(stress_probs).item())
    stress_conf = round(float(stress_probs[stress_idx].item()), 4)

    return {
        "crop_type": CROP_CLASSES.get(crop_idx, "Wheat"),
        "crop_type_idx": crop_idx,
        "crop_confidence": crop_conf,
        "phenology_stage": PHENOLOGY_STAGES.get(stage_idx, "Flowering"),
        "phenology_stage_idx": stage_idx,
        "phenology_confidence": stage_conf,
        "moisture_stress": STRESS_LEVELS.get(stress_idx, "Moderate"),
        "moisture_stress_idx": stress_idx,
        "stress_confidence": stress_conf,
    }
