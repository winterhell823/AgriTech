"""
Master LoRA Fine-Tuning & Training Loop for Prithvi EO-2.0
----------------------------------------------------------
Runs Parameter-Efficient LoRA (r=16, alpha=16) fine-tuning on real optical/SAR/weather rasters.
Saves lightweight adapter weights (`lora_prithvi_adapter.pth`) and merged model weights (`fine_tuned_prithvi_multimodal.pth`).
"""

import sys
import os
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from pathlib import Path

# Add project root (ai-service) to Python search path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from app.training.loss import MultiTaskLoss
from app.models.multimodal_model import CropIntelligenceMultimodalModel
from app.models.prithvi.prithvi_lora import (
    inject_lora_into_prithvi,
    get_trainable_parameter_stats,
    save_lora_adapter,
    merge_and_save_full_model
)
from app.training.dataset import CropIntelligenceDataset


def calculate_accuracy(predictions: torch.Tensor, targets: torch.Tensor) -> float:
    """Calculates classification accuracy."""
    preds = torch.argmax(predictions, dim=1)
    correct = (preds == targets).sum().item()
    return correct / targets.size(0)


def train_model(
    train_manifest: str = "manifests/train.csv",
    val_manifest: str = "manifests/val.csv",
    epochs: int = 2,
    batch_size: int = 2,
    lr: float = 1e-4,
    lora_r: int = 16,
    lora_alpha: float = 16.0,
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Initializing Prithvi EO-2.0 LoRA (r={lora_r}, alpha={lora_alpha}) Training Pipeline on Device: {device}")

    # 1. Datasets & Dataloaders
    train_dataset = CropIntelligenceDataset(train_manifest)
    val_dataset = CropIntelligenceDataset(val_manifest)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    print(f"[INFO] Train samples: {len(train_dataset)} | Validation samples: {len(val_dataset)}")

    # 2. Instantiate Model & Inject LoRA
    model = CropIntelligenceMultimodalModel().to(device)
    model = inject_lora_into_prithvi(model, r=lora_r, lora_alpha=lora_alpha)

    trainable, total, pct = get_trainable_parameter_stats(model)
    print(f"[INFO] LoRA Active Parameters: Trainable {trainable:,} / Total {total:,} ({pct:.2f}%)")

    criterion = MultiTaskLoss(w_crop=0.4, w_phenology=0.3, w_stress=0.3)
    trainable_params = [p for p in model.parameters() if p.requires_grad]

    optimizer = torch.optim.AdamW(trainable_params, lr=lr, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    best_val_loss = float("inf")
    os.makedirs("checkpoints", exist_ok=True)
    checkpoint_path = "checkpoints/fine_tuned_prithvi_multimodal.pth"
    adapter_path = "checkpoints/lora_prithvi_adapter.pth"

    # 3. Training Loop
    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        train_acc = 0.0

        for batch in train_loader:
            optical = batch["optical"].to(device)
            sar = batch["sar"].to(device)
            weather = batch["weather"].to(device)
            crop_label = batch["crop_label"].to(device)

            optimizer.zero_grad()

            outputs = model(optical, sar, weather)
            loss, loss_dict = criterion(outputs, {
                "crop_label": batch["crop_label"].to(device),
                "phenology_label": batch["phenology_label"].to(device),
                "stress_label": batch["stress_label"].to(device)
            })

            loss.backward()
            optimizer.step()

            train_loss += loss.item() * optical.size(0)
            train_acc += calculate_accuracy(outputs["crop_type"], crop_label) * optical.size(0)

        scheduler.step()

        train_loss /= len(train_dataset)
        train_acc /= len(train_dataset)

        # 4. Validation Loop
        model.eval()
        val_loss = 0.0
        val_acc = 0.0

        with torch.no_grad():
            for batch in val_loader:
                optical = batch["optical"].to(device)
                sar = batch["sar"].to(device)
                weather = batch["weather"].to(device)

                targets = {
                    "crop_label": batch["crop_label"].to(device),
                    "phenology_label": batch["phenology_label"].to(device),
                    "stress_label": batch["stress_label"].to(device),
                }

                outputs = model(optical, sar, weather)
                loss, loss_dict = criterion(outputs, targets)

                val_loss += loss.item() * optical.size(0)
                val_acc += calculate_accuracy(
                    outputs["crop_type"], targets["crop_label"]
                ) * optical.size(0)

        val_loss /= len(val_dataset)
        val_acc /= len(val_dataset)

        print(
            f"Epoch [{epoch:02d}/{epochs:02d}] -> "
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:.1f}% | "
            f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc*100:.1f}%"
        )

        # 5. Save Checkpoints on Best Validation Performance
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            save_lora_adapter(model, adapter_path)
            merge_and_save_full_model(model, checkpoint_path)
            print(f"   [SAVE] Saved new best LoRA adapter & merged model checkpoint (Val Loss: {val_loss:.4f})")

    print(f"\n[SUCCESS] LoRA Fine-Tuning Completed Successfully! Merged Checkpoint: {checkpoint_path}")
    return checkpoint_path


if __name__ == "__main__":
    train_model(epochs=2, batch_size=2)