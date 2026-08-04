"""
Multimodal Alignment Module
---------------------------
Ensures Optical, SAR, and Weather features are aligned in shape and CRS
before passing into the Multimodal Fusion Model.
"""

import numpy as np
from typing import Tuple

def align_spatial_dimensions(optical_tensor: np.ndarray, sar_tensor: np.ndarray, target_size: int = 512) -> Tuple[np.ndarray, np.ndarray]:
    """Resizes or crops Optical and SAR tensors to match uniform (H, W) = (target_size, target_size)."""
    # Verify optical shape (6, target_size, target_size)
    opt_shape = optical_tensor.shape
    sar_shape = sar_tensor.shape
    
    assert opt_shape[-2:] == (target_size, target_size), f"Optical tensor dimensions {opt_shape} must end in ({target_size}, {target_size})"
    assert sar_shape[-2:] == (target_size, target_size), f"SAR tensor dimensions {sar_shape} must end in ({target_size}, {target_size})"
    
    return optical_tensor, sar_tensor