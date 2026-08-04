"""
SAR 2D CNN Encoder
"""
import torch
import torch.nn as nn

class SAREncoder(nn.Module):
    def __init__(self, in_channels: int = 3, embed_dim: int = 256):
        super(SAREncoder, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((8, 8)),
            nn.Flatten()
        )
        self.fc = nn.Linear(64 * 8 * 8, embed_dim)

    def forward(self, sar_tensor: torch.Tensor) -> torch.Tensor:
        x = self.features(sar_tensor)
        return self.fc(x)