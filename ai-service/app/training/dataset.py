"""
PyTorch Multimodal Crop Dataset Loader
--------------------------------------
Loads 6-band optical tensors, 3-channel SAR tensors, 4-element weather vectors,
and multi-task ground-truth labels (Crop Type, Phenology Stage, Moisture Stress).
"""

import os
import torch
from torch.utils.data import Dataset
import numpy as np

# Label Mappings
CROP_CLASSES = {0: "Rice", 1: "Wheat", 2: "Maize", 3: "Cotton", 4: "Sugarcane", 5: "Other"}
PHENOLOGY_STAGES = {0: "Germination", 1: "Vegetative", 2: "Flowering", 3: "Maturity", 4: "Harvest"}
STRESS_LEVELS = {0: "Healthy", 1: "Mild", 2: "Moderate", 3: "Severe"}

class CropIntelligenceDataset(Dataset):
    def __init__(self, num_samples: int = 100, tile_size: int = 512):
        """
        Initializes dataset. Generates structured sample tiles for model training
        and fine-tuning validation.
        """
        self.num_samples = num_samples
        self.tile_size = tile_size
        
        # Pre-generate synthetic sample tensors matching real pipeline shapes
        np.random.seed(42)
        self.optical_data = np.random.rand(num_samples, 6, tile_size, tile_size).astype(np.float32)
        self.sar_data = np.random.rand(num_samples, 3, tile_size, tile_size).astype(np.float32)
        self.weather_data = np.random.rand(num_samples, 4).astype(np.float32)
        
        # Ground Truth Labels
        self.crop_labels = np.random.randint(0, 6, size=num_samples)
        self.phenology_labels = np.random.randint(0, 5, size=num_samples)
        self.stress_labels = np.random.randint(0, 4, size=num_samples)

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        optical_tensor = torch.tensor(self.optical_data[idx], dtype=torch.float32)
        sar_tensor = torch.tensor(self.sar_data[idx], dtype=torch.float32)
        weather_tensor = torch.tensor(self.weather_data[idx], dtype=torch.float32)
        
        crop_label = torch.tensor(self.crop_labels[idx], dtype=torch.long)
        phenology_label = torch.tensor(self.phenology_labels[idx], dtype=torch.long)
        stress_label = torch.tensor(self.stress_labels[idx], dtype=torch.long)
        
        return {
            "optical": optical_tensor,
            "sar": sar_tensor,
            "weather": weather_tensor,
            "crop_label": crop_label,
            "phenology_label": phenology_label,
            "stress_label": stress_label
        }

if __name__ == "__main__":
    dataset = CropIntelligenceDataset(num_samples=10)
    sample = dataset[0]
    print("✅ PyTorch Dataset Loader Successful!")
    print(f"   - Optical Tensor Shape: {sample['optical'].shape}")   # (6, 512, 512)
    print(f"   - SAR Tensor Shape:     {sample['sar'].shape}")       # (3, 512, 512)
    print(f"   - Weather Vector Shape: {sample['weather'].shape}")   # (4,)
    print(f"   - Crop Label:           {sample['crop_label'].item()} ({CROP_CLASSES[sample['crop_label'].item()]})")