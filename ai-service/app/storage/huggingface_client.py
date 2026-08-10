"""
Hugging Face Hub Model Registry Client
--------------------------------------
Uploads fine-tuned model checkpoints, configs, and label maps to Hugging Face Hub,
and pulls model weights on server startup.
"""

import os
from huggingface_hub import HfApi, hf_hub_download
from app.core.config import settings

def upload_model_to_huggingface(checkpoint_path: str = "checkpoints/fine_tuned_prithvi_multimodal.pth", repo_id: str = settings.HF_MODEL_ID):
    """Uploads local checkpoint file to target Hugging Face Hub repository."""
    token = settings.HF_TOKEN
    if not token:
        print("[WARNING] HF_TOKEN not set in environment or settings. Skipping live Hugging Face upload.")
        return False
        
    api = HfApi()
    print(f"[INFO] Uploading {checkpoint_path} to Hugging Face Hub repo: {repo_id}...")
    api.upload_file(
        path_or_fileobj=checkpoint_path,
        path_in_repo="fine_tuned_prithvi_multimodal.pth",
        repo_id=repo_id,
        token=token
    )
    print("[SUCCESS] Model uploaded to Hugging Face Hub successfully!")
    return True

def download_model_from_huggingface(repo_id: str = settings.HF_MODEL_ID, filename: str = "fine_tuned_prithvi_multimodal.pth") -> str:
    """Downloads model checkpoint from Hugging Face Hub into local cache."""
    print(f"[INFO] Downloading {filename} from Hugging Face Hub ({repo_id})...")
    local_path = hf_hub_download(repo_id=repo_id, filename=filename)
    print(f"[SUCCESS] Model downloaded to local cache: {local_path}")
    return local_path

if __name__ == "__main__":
    print("Testing Hugging Face Client...")
    upload_model_to_huggingface()