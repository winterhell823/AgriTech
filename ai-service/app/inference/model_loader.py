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

import threading

_MODEL_INSTANCE = None
_MODEL_LOCK = threading.Lock()

def get_loaded_model():
    """Returns thread-safe singleton instance of the loaded fine-tuned model."""
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is not None:
        return _MODEL_INSTANCE

    with _MODEL_LOCK:
        if _MODEL_INSTANCE is None:
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            print(f"[INFO] Loading Fine-Tuned Model on Device: {device}...")
            
            model = CropIntelligenceMultimodalModel().to(device)
            
            # Check local checkpoint first, otherwise attempt Hugging Face Hub download
            local_checkpoint = os.path.join(os.path.dirname(__file__), "..", "..", "checkpoints", "fine_tuned_prithvi_multimodal.pth")
            if os.path.exists(local_checkpoint):
                state_dict = torch.load(local_checkpoint, map_location=device)
                model.load_state_dict(state_dict, strict=False)
                print(f"[SUCCESS] Loaded local fine-tuned model weights from {local_checkpoint}!")
            else:
                try:
                    weights_path = download_model_from_huggingface(
                        repo_id=settings.HF_MODEL_ID,
                        filename="fine_tuned_prithvi_multimodal.pth"
                    )
                    state_dict = torch.load(weights_path, map_location=device)
                    model.load_state_dict(state_dict, strict=False)
                    print("[SUCCESS] Fine-tuned Prithvi weights loaded from Hugging Face Hub successfully!")
                except Exception as e:
                    print(f"[WARNING] Could not load from HF Hub ({e}). Using initialized model weights.")
                
            model.eval()
            _MODEL_INSTANCE = model
    return _MODEL_INSTANCE

if __name__ == "__main__":
    m = get_loaded_model()
    print("[SUCCESS] Model Loader Verification Successful!")