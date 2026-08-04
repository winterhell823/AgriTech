"""
Multimodal Feature Fusion Module
"""
import torch
import torch.nn as nn

class MultimodalFusion(nn.Module):
    def __init__(self, opt_dim: int = 768, sar_dim: int = 256, weather_dim: int = 128, fused_dim: int = 512):
        super(MultimodalFusion, self).__init__()
        total_dim = opt_dim + sar_dim + weather_dim
        
        self.fusion_fc = nn.Sequential(
            nn.Linear(total_dim, fused_dim),
            nn.BatchNorm1d(fused_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.3)
        )

    def forward(self, opt_emb: torch.Tensor, sar_emb: torch.Tensor, weather_emb: torch.Tensor) -> torch.Tensor:
        concat_features = torch.cat([opt_emb, sar_emb, weather_emb], dim=1)
        return self.fusion_fc(concat_features)