"""
Multi-Task Loss Function
------------------------
Combines Cross-Entropy losses for Crop Classification, Phenological Stage,
and Moisture Stress Detection with configurable task weights:
L = 0.4 * L_crop + 0.3 * L_phenology + 0.3 * L_stress
"""

import torch
import torch.nn as nn

class MultiTaskUncertaintyLoss(nn.Module):
    """
    Homoscedastic Kendall Uncertainty Weighting Multi-Task Loss Function.
    Dynamically balances Crop Classification, Phenology, and Stress gradients.
    """
    def __init__(self):
        super(MultiTaskUncertaintyLoss, self).__init__()
        self.log_var_crop = nn.Parameter(torch.zeros(1))
        self.log_var_phenology = nn.Parameter(torch.zeros(1))
        self.log_var_stress = nn.Parameter(torch.zeros(1))
        
        self.ce_crop = nn.CrossEntropyLoss()
        self.ce_phenology = nn.CrossEntropyLoss()
        self.ce_stress = nn.CrossEntropyLoss()

    def forward(self, predictions: dict, targets: dict):
        l_crop = self.ce_crop(predictions["crop_type"], targets["crop_label"])
        l_phenology = self.ce_phenology(predictions["phenology_stage"], targets["phenology_label"])
        l_stress = self.ce_stress(predictions["moisture_stress"], targets["stress_label"])
        
        precision_crop = torch.exp(-self.log_var_crop)
        precision_phenology = torch.exp(-self.log_var_phenology)
        precision_stress = torch.exp(-self.log_var_stress)
        
        total_loss = (0.5 * precision_crop * l_crop + 0.5 * self.log_var_crop) + \
                     (0.5 * precision_phenology * l_phenology + 0.5 * self.log_var_phenology) + \
                     (0.5 * precision_stress * l_stress + 0.5 * self.log_var_stress)
                     
        return total_loss.squeeze(), {
            "loss_total": total_loss.item(),
            "loss_crop": l_crop.item(),
            "loss_phenology": l_phenology.item(),
            "loss_stress": l_stress.item()
        }

class MultiTaskLoss(MultiTaskUncertaintyLoss):
    pass