"""
Comprehensive Evaluation Suite for Fine-Tuned Prithvi EO-2.0
------------------------------------------------------------
Evaluates model on the untouched test set (manifests/test.csv).
Calculates Accuracy, Precision, Recall, Macro-F1, Per-Class F1, and Confusion Matrix.
Outputs: metrics.json & model_card.md
"""

import sys
import os
import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import precision_recall_fscore_support, accuracy_score, confusion_matrix
from pathlib import Path

# Add project root (ai-service) to Python search path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from app.models.multimodal_model import CropIntelligenceMultimodalModel
from app.training.dataset import CropIntelligenceDataset, CROP_CLASSES


def evaluate_test_set(
    test_manifest: str = "manifests/test.csv",
    checkpoint_path: str = "checkpoints/fine_tuned_prithvi_multimodal.pth",
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"📊 Starting Evaluation on Test Set: '{test_manifest}'...")

    if not Path(checkpoint_path).exists():
        raise FileNotFoundError(f"Model checkpoint not found: {checkpoint_path}")

    # 1. Load Test Dataset & Model Checkpoint
    test_dataset = CropIntelligenceDataset(test_manifest)
    test_loader = DataLoader(test_dataset, batch_size=2, shuffle=False)

    model = CropIntelligenceMultimodalModel().to(device)
    model.load_state_dict(torch.load(checkpoint_path, map_location=device))
    model.eval()

    all_preds = []
    all_targets = []

    # 2. Run Inference
    with torch.no_grad():
        for batch in test_loader:
            optical = batch["optical"].to(device)
            sar = batch["sar"].to(device)
            weather = batch["weather"].to(device)
            targets = batch["crop_label"].cpu().numpy()

            outputs = model(optical, sar, weather)
            preds = torch.argmax(outputs["crop_type"], dim=1).cpu().numpy()

            all_preds.extend(preds)
            all_targets.extend(targets)

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # 3. Calculate Metrics
    acc = float(accuracy_score(all_targets, all_preds))
    precision, recall, f1, _ = precision_recall_fscore_support(
        all_targets, all_preds, average="macro", zero_division=0
    )
    per_class_p, per_class_r, per_class_f1, _ = precision_recall_fscore_support(
        all_targets, all_preds, labels=list(CROP_CLASSES.keys()), zero_division=0
    )
    cm = confusion_matrix(all_targets, all_preds, labels=list(CROP_CLASSES.keys())).tolist()

    per_class_metrics = {}
    for idx, class_name in CROP_CLASSES.items():
        per_class_metrics[class_name] = {
            "precision": float(per_class_p[idx]),
            "recall": float(per_class_r[idx]),
            "f1_score": float(per_class_f1[idx]),
        }

    metrics_report = {
        "dataset_split": "test",
        "total_test_samples": len(test_dataset),
        "overall_accuracy": round(acc, 4),
        "macro_precision": round(float(precision), 4),
        "macro_recall": round(float(recall), 4),
        "macro_f1": round(float(f1), 4),
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": cm,
    }

    # 4. Write metrics.json
    metrics_path = Path("metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_report, f, indent=2)
    print(f"💾 Metrics written to {metrics_path.resolve()}")

    # 5. Write model_card.md
    model_card_content = f"""# Prithvi EO-2.0 Crop Intelligence Model Card

## Model Details
- **Architecture**: NASA-IMPACT Prithvi EO-2.0 Multimodal Transformer
- **Task**: Crop Type Classification (6 Classes: Rice, Wheat, Maize, Cotton, Sugarcane, Other)
- **Input Channels**: 6 Optical HLS Bands (B02, B03, B04, B08, B11, B12), 3 SAR Channels (VV, VH, VV/VH), 4 Weather Variables
- **Spatial Resolution**: 10m resampled

## Test Performance Metrics
- **Total Test Samples**: {len(test_dataset)}
- **Overall Accuracy**: {acc * 100:.2f}%
- **Macro F1 Score**: {float(f1):.4f}
- **Macro Precision**: {float(precision):.4f}
- **Macro Recall**: {float(recall):.4f}

## Per-Class Performance
| Crop Class | Precision | Recall | F1 Score |
| :--- | :--- | :--- | :--- |
"""
    for cls_name, m in per_class_metrics.items():
        model_card_content += f"| {cls_name} | {m['precision']:.4f} | {m['recall']:.4f} | {m['f1_score']:.4f} |\n"

    model_card_path = Path("model_card.md")
    with open(model_card_path, "w", encoding="utf-8") as f:
        f.write(model_card_content)
    print(f"📄 Model Card written to {model_card_path.resolve()}")

    print("\n✅ Test Evaluation Complete!")
    print(f"   - Accuracy: {acc*100:.1f}% | Macro-F1: {f1:.4f}")
    return metrics_report


if __name__ == "__main__":
    evaluate_test_set()