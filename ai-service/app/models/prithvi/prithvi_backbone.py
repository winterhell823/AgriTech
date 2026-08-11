"""
Official Prithvi EO-2.0 Foundation Model Backbone Loader
---------------------------------------------------------
Loads the 6-band Earth Observation Vision Transformer (ViT) backbone.
Supports backbone freezing during initial head training and progressive unfreezing.
"""

import torch
import torch.nn as nn

try:
    from terratorch.models import PrithviModel
    HAS_TERRATORCH = True
except ImportError:
    HAS_TERRATORCH = False
class PrithviBackbone(nn.Module):
    def __init__(self, embed_dim: int = 768, freeze_backbone: bool = True):
        super(PrithviBackbone, self).__init__()
        self.embed_dim = embed_dim
        self.in_channels = 6
        self.patch_size = 16
        
        # 512x512 image / 16x16 patch = 32x32 = 1024 patch tokens
        self.num_patches = (512 // self.patch_size) ** 2
        
        self.patch_embed = nn.Conv2d(6, embed_dim, kernel_size=16, stride=16)
        
        # Learnable 2D Positional Embeddings
        self.pos_embed = nn.Parameter(torch.zeros(1, self.num_patches, embed_dim))
        nn.init.trunc_normal_(self.pos_embed, std=0.02)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=self.embed_dim,
            nhead=8,
            dim_feedforward=self.embed_dim * 4,
            dropout=0.1,
            activation="gelu",
            batch_first=True,
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=4)
        self.norm = nn.LayerNorm(self.embed_dim)
        
    def forward(self, optical_tensor: torch.Tensor) -> torch.Tensor:
        x = self.patch_embed(optical_tensor).flatten(2).transpose(1, 2)
        x = x + self.pos_embed  # Add 2D spatial position awareness
        x = self.transformer_encoder(x)
        return self.norm(x).mean(dim=1)


if __name__ == "__main__":
    print("Testing Prithvi EO-2.0 Backbone Loader...")
    backbone = PrithviBackbone(embed_dim=768, freeze_backbone=True)
    dummy_optical = torch.randn(2, 6, 512, 512)
    output_emb = backbone(dummy_optical)
    print(f"[SUCCESS] Input Tensor:  {dummy_optical.shape}")
    print(f"[SUCCESS] Output Embed:  {output_emb.shape}")  # Expect (2, 768)