"""
Optical Spectral Indices Feature Extraction
-------------------------------------------
Computes NDVI, NDWI, EVI, and SAVI from Sentinel-2 6-band reflectance tensors.
Band order: [B02 (Blue), B03 (Green), B04 (Red), B08 (NIR), B11 (SWIR1), B12 (SWIR2)]
"""

import numpy as np

def compute_ndvi(nir: np.ndarray, red: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Normalized Difference Vegetation Index (NDVI) = (NIR - Red) / (NIR + Red)"""
    return (nir - red) / (nir + red + eps)

def compute_ndwi(green: np.ndarray, nir: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Normalized Difference Water Index (NDWI) = (Green - NIR) / (Green + NIR)"""
    return (green - nir) / (green + nir + eps)

def compute_evi(blue: np.ndarray, red: np.ndarray, nir: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Enhanced Vegetation Index (EVI) = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)"""
    return 2.5 * (nir - red) / (nir + 6.0 * red - 7.5 * blue + 1.0 + eps)

def compute_savi(red: np.ndarray, nir: np.ndarray, L: float = 0.5, eps: float = 1e-6) -> np.ndarray:
    """Soil Adjusted Vegetation Index (SAVI) = ((NIR - Red) / (NIR + Red + L)) * (1 + L)"""
    return ((nir - red) / (nir + red + L + eps)) * (1.0 + L)

def extract_all_optical_features(optical_tensor: np.ndarray) -> dict:
    """
    Given an optical raster tensor of shape (6, H, W) or (N, 6, H, W),
    extracts all spectral indices and statistical summaries.
    """
    if optical_tensor.ndim == 3:
        blue, green, red, nir = optical_tensor[0], optical_tensor[1], optical_tensor[2], optical_tensor[3]
    else:
        blue, green, red, nir = optical_tensor[:, 0], optical_tensor[:, 1], optical_tensor[:, 2], optical_tensor[:, 3]

    ndvi = compute_ndvi(nir, red)
    ndwi = compute_ndwi(green, nir)
    evi = compute_evi(blue, red, nir)
    savi = compute_savi(red, nir)

    return {
        "ndvi": ndvi,
        "ndwi": ndwi,
        "evi": evi,
        "savi": savi,
        "mean_ndvi": float(np.mean(ndvi)),
        "mean_ndwi": float(np.mean(ndwi)),
        "mean_evi": float(np.mean(evi)),
        "mean_savi": float(np.mean(savi)),
    }
