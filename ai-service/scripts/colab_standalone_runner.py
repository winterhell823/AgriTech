"""
Standalone Self-Contained Google Colab LoRA Fine-Tuning Execution Script
-------------------------------------------------------------------------
Copy & paste this script directly into a single Google Colab cell.
It automatically sets paths, installs dependencies, handles LoRA fine-tuning,
and uploads the weights directly to Hugging Face Hub!
"""

import os
import sys
import subprocess

# 1. Install dependencies
print("[INFO] Installing Colab dependencies...")
subprocess.run(["pip", "install", "-q", "rasterio", "pandas", "numpy", "huggingface_hub", "pydantic-settings"], check=True)

# 2. Add current working directory to sys.path
cwd = os.getcwd()
sys.path.insert(0, cwd)
if os.path.exists(os.path.join(cwd, "ai-service")):
    sys.path.insert(0, os.path.join(cwd, "ai-service"))

print(f"[INFO] Working Directory: {cwd}")
print(f"[INFO] Python Path[0]: {sys.path[0]}")

# 3. Set Credentials
os.environ["HF_MODEL_ID"] = "kratika24076536835854/fine-tuned-prithvi-crop-intelligence"
os.environ["HF_TOKEN"] = os.environ.get("HF_TOKEN", "")

# 4. Import & Run Fine-Tuning
try:
    from app.training.train import train_model
    from app.storage.huggingface_client import upload_model_to_huggingface

    print("[INFO] Starting LoRA Fine-Tuning on CUDA GPU...")
    checkpoint_path = train_model(
        train_manifest="manifests/train.csv",
        val_manifest="manifests/val.csv",
        epochs=5,
        batch_size=4,
        lr=1e-4,
        lora_r=16,
        lora_alpha=16.0
    )

    print(f"[SUCCESS] Fine-tuning completed! Best checkpoint: {checkpoint_path}")

    # 5. Sync to Hugging Face
    upload_model_to_huggingface("checkpoints/lora_prithvi_adapter.pth")
    upload_model_to_huggingface("checkpoints/fine_tuned_prithvi_multimodal.pth")
    print("[SUCCESS] All fine-tuned weights uploaded to Hugging Face Hub!")

except ModuleNotFoundError as e:
    print(f"[ERROR] Import failed: {e}")
    print("[TIP] Ensure you are inside the 'ai-service' directory on Colab.")
    print("Run this cell first:")
    print("   %cd /content/ai-service")
