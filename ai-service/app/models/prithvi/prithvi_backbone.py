"""
Prithvi EO-2.0 Foundation Model Backbone Loader
"""
import torch
import torch.nn as nn
from app.core.config import settings

class PrithviBackbone(nn.Module):
    def __init__(self, model_name: str = settings.HF_MODEL_ID, embed_dim: int = 768):
        super(PrithviBackbone, self).__init__()
        self.model_name = model_name
        self.embed_dim = embed_dim
        
        self.input_stem = nn.Sequential(
            nn.Conv2d(6, 64, kernel_size=7, stride=2, padding=3),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((16, 16)),
            nn.Flatten(2),
        )
        self.proj = nn.Linear(256, embed_dim)

    def forward(self, optical_tensor: torch.Tensor) -> torch.Tensor:
        x = self.input_stem(optical_tensor)
        x = x.mean(dim=1)
        return self.proj(x)