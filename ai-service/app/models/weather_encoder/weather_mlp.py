"""
Weather MLP Encoder
"""
import torch
import torch.nn as nn

class WeatherEncoder(nn.Module):
    def __init__(self, in_features: int = 4, embed_dim: int = 128):
        super(WeatherEncoder, self).__init__()
        self.mlp = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(inplace=True),
            nn.Linear(64, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(inplace=True),
            nn.Linear(128, embed_dim)
        )

    def forward(self, weather_vector: torch.Tensor) -> torch.Tensor:
        return self.mlp(weather_vector)