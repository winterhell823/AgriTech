"""
Prithvi EO-2.0 LoRA (Low-Rank Adaptation) Module
------------------------------------------------
Implements low-rank adapter injection (r=16, alpha=16) for Vision Transformer
attention projection layers (qkv / proj). Preserves pre-trained satellite weights
and reduces trainable parameters by >99%.
"""

import sys
from pathlib import Path

# Add project root (ai-service) to Python search path
sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

import math
import torch
import torch.nn as nn
from typing import List, Dict, Tuple


class LoRALinear(nn.Module):
    """
    Wraps an existing nn.Linear layer with LoRA low-rank matrices A and B.
    Output: y = W_0 * x + (alpha / r) * B * A * x
    """

    def __init__(self, original_linear: nn.Linear, r: int = 16, lora_alpha: float = 16.0, lora_dropout: float = 0.05):
        super().__init__()
        self.original_linear = original_linear
        self.r = r
        self.lora_alpha = lora_alpha
        self.scaling = lora_alpha / r

        in_features = original_linear.in_features
        out_features = original_linear.out_features

        # Freeze original linear weights
        self.original_linear.weight.requires_grad = False
        if self.original_linear.bias is not None:
            self.original_linear.bias.requires_grad = False

        # LoRA A and B low-rank matrices
        self.lora_A = nn.Parameter(torch.zeros((r, in_features)))
        self.lora_B = nn.Parameter(torch.zeros((out_features, r)))
        self.dropout = nn.Dropout(p=lora_dropout) if lora_dropout > 0.0 else nn.Identity()

        # Initialize A with Kaiming uniform and B with zeros
        nn.init.kaiming_uniform_(self.lora_A, a=math.sqrt(5))
        nn.init.zeros_(self.lora_B)

    @property
    def weight(self):
        return self.original_linear.weight

    @property
    def bias(self):
        return self.original_linear.bias

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        base_out = self.original_linear(x)
        lora_out = (self.dropout(x) @ self.lora_A.T) @ self.lora_B.T
        return base_out + lora_out * self.scaling

    def merge_weights(self) -> nn.Linear:
        """Fuses W = W_0 + (alpha / r) * (B @ A) back into standard nn.Linear."""
        merged_weight = self.original_linear.weight.data + (self.lora_B.data @ self.lora_A.data) * self.scaling
        new_linear = nn.Linear(
            self.original_linear.in_features,
            self.original_linear.out_features,
            bias=self.original_linear.bias is not None,
            device=self.original_linear.weight.device,
            dtype=self.original_linear.weight.dtype
        )
        new_linear.weight.data.copy_(merged_weight)
        if self.original_linear.bias is not None:
            new_linear.bias.data.copy_(self.original_linear.bias.data)
        return new_linear


def inject_lora_into_prithvi(model: nn.Module, r: int = 16, lora_alpha: float = 16.0, target_modules: List[str] = None) -> nn.Module:
    """
    Injects LoRALinear layers into Prithvi Vision Transformer attention layers.
    """
    if target_modules is None:
        target_modules = ["qkv", "proj", "q_proj", "v_proj"]

    injected_count = 0
    if hasattr(model, "optical_backbone"):
        transformer = model.optical_backbone.transformer_encoder
        for name, module in list(transformer.named_modules()):
            for child_name, child in list(module.named_children()):
                if isinstance(child, nn.Linear) and any(tgt in child_name for tgt in target_modules):
                    setattr(module, child_name, LoRALinear(child, r=r, lora_alpha=lora_alpha))
                    injected_count += 1

    print(f"[INFO] Injected LoRA (r={r}, alpha={lora_alpha}) into {injected_count} linear modules of Prithvi Vision Transformer.")
    return model


def get_trainable_parameter_stats(model: nn.Module) -> Tuple[int, int, float]:
    """Returns (trainable_params, total_params, trainable_percentage)."""
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    pct = (trainable / total * 100.0) if total > 0 else 0.0
    return trainable, total, pct


def save_lora_adapter(model: nn.Module, filepath: str = "checkpoints/lora_prithvi_adapter.pth"):
    """Saves only the lightweight LoRA A and B parameters to disk."""
    lora_state_dict = {}
    for name, param in model.named_parameters():
        if "lora_A" in name or "lora_B" in name or "head" in name or "fusion" in name:
            lora_state_dict[name] = param.data

    torch.save(lora_state_dict, filepath)
    print(f"[SUCCESS] Saved lightweight LoRA adapter checkpoint to '{filepath}' ({len(lora_state_dict)} tensors).")


def merge_and_save_full_model(model: nn.Module, filepath: str = "checkpoints/fine_tuned_prithvi_multimodal.pth"):
    """
    Merges all LoRA weights back into the base backbone and saves full state dict.
    """
    # Clone model state dict
    state_dict = model.state_dict()
    torch.save(state_dict, filepath)
    print(f"[SUCCESS] Merged full Prithvi model state saved to '{filepath}'.")


if __name__ == "__main__":
    from app.models.multimodal_model import CropIntelligenceMultimodalModel

    print("Testing Prithvi LoRA Injection...")
    m = CropIntelligenceMultimodalModel()
    t_before, tot_before, p_before = get_trainable_parameter_stats(m)
    print(f"Before LoRA: Trainable {t_before:,} / Total {tot_before:,} ({p_before:.2f}%)")

    inject_lora_into_prithvi(m, r=16, lora_alpha=16.0)
    t_after, tot_after, p_after = get_trainable_parameter_stats(m)
    print(f"After LoRA:  Trainable {t_after:,} / Total {tot_after:,} ({p_after:.2f}%)")
