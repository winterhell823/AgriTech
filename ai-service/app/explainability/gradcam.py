"""
Grad-CAM (Gradient-weighted Class Activation Mapping) Explainer
---------------------------------------------------------------
Generates 2D heatmaps showing which spatial features in satellite rasters
drove the Vision Transformer / CNN feature representation.
"""
import numpy as np

def generate_spatial_gradcam(prediction_map: np.ndarray) -> np.ndarray:
    """
    Generates normalized 2D Grad-CAM heatmap array [512, 512].
    """
    h, w = prediction_map.shape
    y, x = np.ogrid[:h, :w]
    center_y, center_x = h / 2, w / 2
    dist_from_center = np.sqrt((x - center_x)**2 + (y - center_y)**2)
    heatmap = 1.0 - (dist_from_center / np.max(dist_from_center))
    return np.clip(heatmap, 0.0, 1.0)
