"""
Temporal Sequence Feature Extraction
------------------------------------
Derives temporal vegetation trends and rate of change metrics
over multi-date observation sequences.
"""

import numpy as np

def compute_ndvi_trend(ndvi_sequence: list) -> float:
    """Computes linear rate of change (slope) across a time-series sequence of mean NDVI values."""
    if len(ndvi_sequence) < 2:
        return 0.0
    x = np.arange(len(ndvi_sequence))
    y = np.array(ndvi_sequence, dtype=np.float64)
    slope, _ = np.polyfit(x, y, 1)
    return float(slope)

def compute_temporal_summary(ndvi_sequence: list, ndwi_sequence: list) -> dict:
    """Returns aggregated temporal features (min, max, mean, trend) for vegetation & moisture indices."""
    if not ndvi_sequence:
        return {
            "max_ndvi": 0.0,
            "min_ndvi": 0.0,
            "mean_ndvi": 0.0,
            "ndvi_trend": 0.0,
            "max_ndwi": 0.0,
            "min_ndwi": 0.0,
            "mean_ndwi": 0.0,
            "ndwi_trend": 0.0
        }

    return {
        "max_ndvi": float(np.max(ndvi_sequence)),
        "min_ndvi": float(np.min(ndvi_sequence)),
        "mean_ndvi": float(np.mean(ndvi_sequence)),
        "ndvi_trend": compute_ndvi_trend(ndvi_sequence),
        "max_ndwi": float(np.max(ndwi_sequence)) if ndwi_sequence else 0.0,
        "min_ndwi": float(np.min(ndwi_sequence)) if ndwi_sequence else 0.0,
        "mean_ndwi": float(np.mean(ndwi_sequence)) if ndwi_sequence else 0.0,
        "ndwi_trend": compute_ndvi_trend(ndwi_sequence) if len(ndwi_sequence) >= 2 else 0.0
    }
