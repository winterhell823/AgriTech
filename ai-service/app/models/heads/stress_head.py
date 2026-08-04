import torch.nn as nn
class StressHead(nn.Module):
    def __init__(self, fused_dim: int = 512, num_classes: int = 4):
        super().__init__()
        self.fc = nn.Linear(fused_dim, num_classes)
    def forward(self, x): return self.fc(x)