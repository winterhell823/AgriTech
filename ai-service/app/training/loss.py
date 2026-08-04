"""
Multi-Task Loss Function
------------------------
Combines Cross-Entropy losses for Crop Classification, Phenological Stage,
and Moisture Stress Detection with configurable task weights:
L = 0.4 * L_crop + 0.3 * L_phenology + 0.3 * L_stress
"""

import torch
import torch.nn as nn

class MultiTaskLoss(nn.Module):
    def __init__(self, w_crop: float = 0.4, w_phenology: float = 0.3, w_stress: float = 0.3):
        super(MultiTaskLoss, self).__init__()
        self.w_crop = w_crop
        self.w_phenology = w_phenology
        self.w_stress = w_stress
        
        self.ce_crop = nn.CrossEntropyLoss()
        self.ce_phenology = nn.CrossEntropyLoss()
        self.ce_stress = nn.CrossEntropyLoss()

    def forward(self, predictions: dict, targets: dict):
        l_crop = self.ce_crop(predictions["crop_type"], targets["crop_label"])
        l_phenology = self.ce_phenology(predictions["phenology_stage"], targets["phenology_label"])
        l_stress = self.ce_stress(predictions["moisture_stress"], targets["stress_label"])
        
        total_loss = (self.w_crop * l_crop) + (self.w_phenology * l_phenology) + (self.w_stress * l_stress)
        
        return total_loss, {
            "loss_total": total_loss.item(),
            "loss_crop": l_crop.item(),
            "loss_phenology": l_phenology.item(),
            "loss_stress": l_stress.item()
        }