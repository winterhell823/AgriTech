"""
Prithvi EO-2.0 LoRA Fine-Tuning Setup
--------------------------------------
Configures LoRA injection for Prithvi Vision Transformer backbone.
"""

import torch
import torch.nn as nn
from typing import Tuple
from app.models.prithvi.prithvi_lora import inject_lora_into_prithvi, get_trainable_parameter_stats

def setup_lora_finetuning(model: nn.Module, r: int = 16, lora_alpha: float = 16.0) -> Tuple[nn.Module, list]:
    """
    Injects LoRA into Vision Transformer attention layers and constructs parameter optimizer groups.
    Only LoRA parameters (lora_A, lora_B) and multi-task heads will be trained.
    """
    # 1. Inject LoRA into Prithvi backbone
    model = inject_lora_into_prithvi(model, r=r, lora_alpha=lora_alpha)

    # 2. Collect trainable parameters for optimizer
    trainable_params = [p for p in model.parameters() if p.requires_grad]

    trainable, total, pct = get_trainable_parameter_stats(model)
    print(f"[INFO] Configured LoRA Fine-Tuning: Trainable Params = {trainable:,} / {total:,} ({pct:.2f}%)")

    return model, trainable_params
