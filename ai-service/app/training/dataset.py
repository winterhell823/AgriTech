"""
Real PyTorch Multimodal Crop Dataset Loader
--------------------------------------------
Reads 6-band optical GeoTIFFs, 3-channel SAR GeoTIFFs, weather features,
and multi-task labels from CSV manifests (train.csv, val.csv, test.csv).
"""

import json
from pathlib import Path
import sys
import numpy as np
import pandas as pd
import rasterio
from rasterio.enums import Resampling
import torch
from torch.utils.data import Dataset

# Add project root (ai-service) to Python search path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from app.preprocessing.optical_preprocessing import normalize_6band_tensor

CROP_CLASSES = {
    0: "Rice",
    1: "Wheat",
    2: "Maize",
    3: "Cotton",
    4: "Sugarcane",
    5: "Other",
}


class CropIntelligenceDataset(Dataset):

  def __init__(self, manifest_path: str, tile_size: int = 512):
    """Loads dataset samples from a manifest CSV."""
    self.manifest_path = Path(manifest_path)

    # Automatic path resolution for AgriTech root (parents[3])
    if not self.manifest_path.exists():
      parent_manifest = Path(__file__).resolve().parents[3] / manifest_path
      if parent_manifest.exists():
        self.manifest_path = parent_manifest
      else:
        raise FileNotFoundError(f"Manifest CSV not found: {manifest_path}")

    self.df = pd.read_csv(self.manifest_path)
    self.tile_size = tile_size

  def __len__(self):
    return len(self.df)

  def _read_optical_raster(self, raster_path: str) -> np.ndarray:
    """Reads 6-band optical raster and resamples/pads to tile_size x tile_size."""
    path = Path(raster_path)
    if not path.exists():
      parent_path = Path(__file__).resolve().parents[3] / raster_path
      if parent_path.exists():
        path = parent_path
      else:
        return np.zeros((6, self.tile_size, self.tile_size), dtype=np.float32)

    with rasterio.open(path) as src:
      bands_to_read = min(src.count, 6)
      data = (
          src.read(
              indexes=list(range(1, bands_to_read + 1)),
              out_shape=(bands_to_read, self.tile_size, self.tile_size),
              resampling=Resampling.bilinear,
              masked=True,
          )
          .filled(0)
          .astype(np.float32)
      )

      if data.shape[0] < 6:
        padded = np.zeros((6, self.tile_size, self.tile_size), dtype=np.float32)
        padded[: data.shape[0], :, :] = data
        data = padded

    return normalize_6band_tensor(data)

  def _read_sar_raster(self, raster_path: str) -> np.ndarray:
    """Reads 3-channel SAR raster (VV, VH, ratio)."""
    path = Path(raster_path)
    if not path.exists():
      parent_path = Path(__file__).resolve().parents[3] / raster_path
      if parent_path.exists():
        path = parent_path
      else:
        return np.zeros((3, self.tile_size, self.tile_size), dtype=np.float32)

    with rasterio.open(path) as src:
      bands_to_read = min(src.count, 3)
      data = (
          src.read(
              indexes=list(range(1, bands_to_read + 1)),
              out_shape=(bands_to_read, self.tile_size, self.tile_size),
              resampling=Resampling.bilinear,
              masked=True,
          )
          .filled(0)
          .astype(np.float32)
      )

      if data.shape[0] < 3:
        padded = np.zeros((3, self.tile_size, self.tile_size), dtype=np.float32)
        padded[: data.shape[0], :, :] = data
        data = padded

    return data

  def _read_weather_json(self, weather_path: str) -> np.ndarray:
    """Reads weather vector [temp, rainfall, humidity, wind]."""
    path = Path(weather_path)
    if not path.exists():
      parent_path = Path(__file__).resolve().parents[3] / weather_path
      if parent_path.exists():
        path = parent_path
      else:
        return np.array([25.0, 10.0, 50.0, 2.5], dtype=np.float32)

    with open(path, 'r', encoding='utf-8') as f:
      w = json.load(f)

    return np.array(
        [
            float(w.get('temperature_celsius', 25.0)),
            float(w.get('rainfall_14day_mm', 10.0)),
            float(w.get('humidity_percent', 50.0)),
            float(w.get('wind_speed_ms', 2.5)),
        ],
        dtype=np.float32,
    )

  def __getitem__(self, idx):
    row = self.df.iloc[idx]

    optical_data = self._read_optical_raster(row['optical_path'])
    sar_data = self._read_sar_raster(row['sar_path'])
    weather_data = self._read_weather_json(row['weather_path'])

    # Extract all 3 target labels
    crop_label = torch.tensor(int(row['crop_label']), dtype=torch.long)
    phenology_label = torch.tensor(
        int(row.get('phenology_label', 0)), dtype=torch.long
    )
    stress_label = torch.tensor(
        int(row.get('stress_label', 0)), dtype=torch.long
    )

    return {
        'sample_id': row['sample_id'],
        'field_id': row['field_id'],
        'optical': torch.tensor(optical_data, dtype=torch.float32),
        'sar': torch.tensor(sar_data, dtype=torch.float32),
        'weather': torch.tensor(weather_data, dtype=torch.float32),
        'crop_label': crop_label,
        'phenology_label': phenology_label,
        'stress_label': stress_label,
    }


if __name__ == '__main__':
  print('Testing Real PyTorch Multimodal Dataset Loader...')
  ds = CropIntelligenceDataset('manifests/train.csv')
  sample = ds[0]
  print(f"[SUCCESS] Loaded Sample ID: {sample['sample_id']}")
  print(f"   - Optical Tensor Shape: {sample['optical'].shape}")
  print(f"   - SAR Tensor Shape:     {sample['sar'].shape}")
  print(f"   - Weather Vector Shape: {sample['weather'].shape}")
  print(f"   - Crop Label:           {sample['crop_label'].item()}")
  print(f"   - Phenology Label:      {sample['phenology_label'].item()}")
  print(f"   - Stress Label:         {sample['stress_label'].item()}")