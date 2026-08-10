"""
Geospatial Raster Utility Functions
----------------------------------
Reprojection, resampling, cloud masking, and spatial clipping for satellite rasters.
"""

import numpy as np

def mask_clouds_s2(optical_tensor: np.ndarray, qa_band: np.ndarray = None) -> np.ndarray:
    """
    Applies cloud and cirrus mask to Sentinel-2 reflectance tensor.
    If no QA band provided, returns clipped reflectance in range [0, 1].
    """
    cleaned = np.clip(optical_tensor, 0.0, 1.0)
    if qa_band is not None:
        cloud_mask = (qa_band & (1 << 10)) | (qa_band & (1 << 11))
        cleaned = np.where(cloud_mask > 0, np.nan, cleaned)
    return cleaned

def resample_raster_shape(data: np.ndarray, target_height: int = 512, target_width: int = 512) -> np.ndarray:
    """
    Resamples input array (C, H, W) or (H, W) to (C, target_height, target_width).
    """
    if data.ndim == 2:
        h, w = data.shape
        if h == target_height and w == target_width:
            return data
        y_indices = (np.linspace(0, h - 1, target_height)).astype(int)
        x_indices = (np.linspace(0, w - 1, target_width)).astype(int)
        return data[np.ix_(y_indices, x_indices)]

    channels, h, w = data.shape
    if h == target_height and w == target_width:
        return data

    y_indices = (np.linspace(0, h - 1, target_height)).astype(int)
    x_indices = (np.linspace(0, w - 1, target_width)).astype(int)
    resampled = np.zeros((channels, target_height, target_width), dtype=data.dtype)
    for c in range(channels):
        resampled[c] = data[c][np.ix_(y_indices, x_indices)]
    return resampled
