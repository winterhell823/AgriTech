"""
Master Multimodal Multi-Task Neural Network
"""
import torch
import torch.nn as nn
from app.models.prithvi.prithvi_backbone import PrithviBackbone
from app.models.sar_encoder.sar_cnn import SAREncoder
from app.models.weather_encoder.weather_mlp import WeatherEncoder
from app.models.fusion.fusion_module import MultimodalFusion
from app.models.heads.crop_head import CropHead
from app.models.heads.phenology_head import PhenologyHead
from app.models.heads.stress_head import StressHead

class CropIntelligenceMultimodalModel(nn.Module):
    def __init__(self):
        super(CropIntelligenceMultimodalModel, self).__init__()
        self.optical_backbone = PrithviBackbone()
        self.sar_encoder = SAREncoder()
        self.weather_encoder = WeatherEncoder()
        self.fusion = MultimodalFusion()
        
        self.crop_head = CropHead(num_classes=6)       # Rice, Wheat, Maize, Cotton, Sugarcane, Other
        self.phenology_head = PhenologyHead(num_classes=5) # Germination, Vegetative, Flowering, Maturity, Harvest
        self.stress_head = StressHead(num_classes=4)    # Healthy, Mild, Moderate, Severe

    def forward(self, optical: torch.Tensor, sar: torch.Tensor, weather: torch.Tensor):
        opt_emb = self.optical_backbone(optical)
        sar_emb = self.sar_encoder(sar)
        weather_emb = self.weather_encoder(weather)
        
        fused = self.fusion(opt_emb, sar_emb, weather_emb)
        
        return {
            "crop_type": self.crop_head(fused),
            "phenology_stage": self.phenology_head(fused),
            "moisture_stress": self.stress_head(fused)
        }