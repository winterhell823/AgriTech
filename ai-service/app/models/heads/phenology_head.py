import torch.nn as nn
class PhenologyHead(nn.Module):
    def __init__(self, fused_dim: int = 512, num_classes: int = 5):
        super().__init__()
        self.fc = nn.Linear(fused_dim, num_classes)
    def forward(self, x): return self.fc(x)