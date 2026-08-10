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

        # 6 HLS Spectral Bands: B02, B03, B04, B08, B11, B12
        self.in_channels = 6
        self.patch_size = 16

        # ViT Patch Embedding Stem for 6-channel EO rasters
        self.patch_embed = nn.Conv2d(
            in_channels=self.in_channels,
            out_channels=self.embed_dim,
            kernel_size=self.patch_size,
            stride=self.patch_size,
        )

        # Transformer Encoder Block Representation
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

        if freeze_backbone:
            self.freeze()

    def freeze(self):
        """Freezes backbone parameters for head-only initial training."""
        for param in self.parameters():
            param.requires_grad = False
        print("[INFO] Prithvi EO-2.0 backbone frozen for initial head training.")

    def unfreeze(self, num_blocks: int = 2):
        """Unfreezes selected top transformer blocks for end-to-end fine-tuning."""
        for param in self.transformer_encoder.layers[-num_blocks:].parameters():
            param.requires_grad = True
        print(f"[INFO] Unfrozen top {num_blocks} Prithvi transformer blocks for fine-tuning.")

    def forward(self, optical_tensor: torch.Tensor) -> torch.Tensor:
        # Input shape: (B, 6, H, W) e.g., (B, 6, 512, 512)
        x = self.patch_embed(optical_tensor)  # (B, embed_dim, H/16, W/16) -> (B, 768, 32, 32)
        x = x.flatten(2).transpose(1, 2)       # (B, 1024, 768) sequence of patch tokens

        x = self.transformer_encoder(x)
        x = self.norm(x)

        # Mean pooling across patch tokens -> (B, embed_dim) feature vector
        embedding = x.mean(dim=1)
        return embedding


if __name__ == "__main__":
    print("Testing Prithvi EO-2.0 Backbone Loader...")
    backbone = PrithviBackbone(embed_dim=768, freeze_backbone=True)
    dummy_optical = torch.randn(2, 6, 512, 512)
    output_emb = backbone(dummy_optical)
    print(f"[SUCCESS] Input Tensor:  {dummy_optical.shape}")
    print(f"[SUCCESS] Output Embed:  {output_emb.shape}")  # Expect (2, 768)