#!/usr/bin/env bash
# Production Training Runner Script
set -e

echo "[INFO] Launching Prithvi EO-2.0 LoRA Fine-Tuning Execution..."
python app/training/train.py

echo "[INFO] Uploading fine-tuned model checkpoints to Hugging Face Hub..."
python app/storage/huggingface_client.py

echo "[SUCCESS] Training pipeline completed!"
