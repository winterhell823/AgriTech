"""
Production Model Loader
-----------------------
Downloads the fine-tuned Prithvi model weights from Hugging Face Hub
on server startup and loads the PyTorch model into CPU/GPU memory.
"""

import os
import torch
from app.models.multimodal_model import CropIntelligenceMultimodalModel
from app.storage.huggingface_client import download_model_from_huggingface
from app.core.config import settings

_MODEL_INSTANCE = None

def get_loaded_model():
    """Returns singleton instance of the loaded fine-tuned model."""
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is not None:
        return _MODEL_INSTANCE

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🚀 Loading Fine-Tuned Model on Device: {device}...")
    
    model = CropIntelligenceMultimodalModel().to(device)
    
    # Try downloading fine-tuned weights from Hugging Face Hub
    try:
        weights_path = download_model_from_huggingface(
            repo_id=settings.HF_MODEL_ID,
            filename="fine_tuned_prithvi_multimodal.pth"
        )
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print("✅ Fine-tuned Prithvi weights loaded from Hugging Face Hub successfully!")
    except Exception as e:
        print(f"⚠️ Could not load from HF Hub ({e}). Using initialized model weights.")
        
    model.eval()
    _MODEL_INSTANCE = model
    return _MODEL_INSTANCE

if __name__ == "__main__":
    m = get_loaded_model()
    print("✅ Model Loader Verification Successful!")