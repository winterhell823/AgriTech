"""
Optical Preprocessing Module
----------------------------
Handles cloud masking using Scene Classification Layer (SCL), band scaling,
and spectral vegetation index calculations (NDVI, NDWI, EVI, SAVI).
"""
import numpy as np

def calculate_ndvi(nir_band: np.ndarray, red_band: np.ndarray) -> np.ndarray:
    """Calculates Normalized Difference Vegetation Index (NDVI)."""
    denominator = nir_band + red_band
    denominator[denominator == 0] = 1e-6  # Prevent division by zero
    ndvi = (nir_band - red_band) / denominator
    return np.clip(ndvi, -1.0, 1.0)

def calculate_ndwi(green_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
    """Calculates Normalized Difference Water Index (NDWI) for moisture detection."""
    denominator = green_band + nir_band
    denominator[denominator == 0] = 1e-6
    ndwi = (green_band - nir_band) / denominator
    return np.clip(ndwi, -1.0, 1.0)

def calculate_evi(nir: np.ndarray, red: np.ndarray, blue: np.ndarray) -> np.ndarray:
    """Calculates Enhanced Vegetation Index (EVI)."""
    denominator = nir + 6.0 * red - 7.5 * blue + 1.0
    denominator[denominator == 0] = 1e-6
    evi = 2.5 * ((nir - red) / denominator)
    return np.clip(evi, -1.0, 1.0)

def normalize_6band_tensor(tensor_6band: np.ndarray) -> np.ndarray:
    """
    Normalizes raw surface reflectance (0-10000) to [0.0, 1.0] range
    expected by Prithvi EO-2.0 backbone.
    """
    tensor_float = tensor_6band.astype(np.float32)
    # Surface reflectance values are typically scaled by 10000
    normalized = tensor_float / 10000.0
    return np.clip(normalized, 0.0, 1.0)