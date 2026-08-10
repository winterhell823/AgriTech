"""
Download Pre-trained / Fine-Tuned Prithvi Checkpoint Script
"""
from app.storage.huggingface_client import download_model_from_huggingface
from app.core.config import settings

def main():
    print(f"[INFO] Pulling model from Hugging Face Hub: {settings.HF_MODEL_ID}...")
    local_path = download_model_from_huggingface(
        repo_id=settings.HF_MODEL_ID,
        filename="fine_tuned_prithvi_multimodal.pth"
    )
    print(f"[SUCCESS] Download completed: {local_path}")

if __name__ == "__main__":
    main()
