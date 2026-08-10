"""
SAR Radar Feature Extraction
----------------------------
Processes Sentinel-1 SAR dual-polarization rasters (VV, VH)
and derives polarimetric ratios and statistical summaries.
"""

import numpy as np

def compute_vv_vh_ratio(vv: np.ndarray, vh: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Computes VV / VH cross-polarization ratio"""
    return vv / (vh + eps)

def extract_all_sar_features(sar_tensor: np.ndarray) -> dict:
    """
    Given a SAR tensor of shape (3, H, W) where band 0 is VV, band 1 is VH, and band 2 is VV/VH,
    calculates backscatter statistics.
    """
    if sar_tensor.ndim == 3:
        vv = sar_tensor[0]
        vh = sar_tensor[1]
        ratio = sar_tensor[2] if sar_tensor.shape[0] > 2 else compute_vv_vh_ratio(vv, vh)
    else:
        vv = sar_tensor[:, 0]
        vh = sar_tensor[:, 1]
        ratio = sar_tensor[:, 2] if sar_tensor.shape[1] > 2 else compute_vv_vh_ratio(vv, vh)

    return {
        "vv": vv,
        "vh": vh,
        "ratio": ratio,
        "mean_vv": float(np.mean(vv)),
        "mean_vh": float(np.mean(vh)),
        "mean_ratio": float(np.mean(ratio)),
        "std_vv": float(np.std(vv)),
        "std_vh": float(np.std(vh)),
    }
