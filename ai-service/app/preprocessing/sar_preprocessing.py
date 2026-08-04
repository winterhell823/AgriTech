"""
SAR (Synthetic Aperture Radar) Preprocessing
--------------------------------------------
Processes Sentinel-1 VV and VH backscatter channels, computes VV/VH ratio,
and applies noise reduction filtering.
"""

import numpy as np

def apply_simple_speckle_filter(sar_array: np.ndarray, window_size: int = 3) -> np.ndarray:
    """Applies a simple moving average speckle noise filter to SAR backscatter array."""
    from scipy.ndimage import uniform_filter
    return uniform_filter(sar_array, size=window_size)

def compute_vv_vh_ratio(vv_band: np.ndarray, vh_band: np.ndarray) -> np.ndarray:
    """
    Computes cross-polarization ratio (VV / VH).
    VV/VH ratio correlates strongly with vegetation canopy structure and moisture.
    """
    # Prevent division by zero
    vh_safe = np.where(vh_band == 0, 1e-6, vh_band)
    ratio = vv_band / vh_safe
    return np.clip(ratio, 0.0, 10.0)

def preprocess_sar_channels(vv_band: np.ndarray, vh_band: np.ndarray) -> np.ndarray:
    """
    Preprocesses VV and VH bands into a 3-channel SAR tensor array:
    Channel 0: Filtered VV
    Channel 1: Filtered VH
    Channel 2: Filtered VV/VH Ratio
    Returns shape: (3, H, W)
    """
    vv_filtered = apply_simple_speckle_filter(vv_band)
    vh_filtered = apply_simple_speckle_filter(vh_band)
    ratio = compute_vv_vh_ratio(vv_filtered, vh_filtered)
    
    stacked_sar = np.stack([vv_filtered, vh_filtered, ratio], axis=0)
    return stacked_sar.astype(np.float32)