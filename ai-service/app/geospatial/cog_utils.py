"""
Cloud-Optimized GeoTIFF (COG) Exporter & Map Generator
"""

import os
import numpy as np
import rasterio
from rasterio.transform import from_bounds

def save_prediction_as_geotiff(prediction_grid: np.ndarray, bbox: list, output_path: str = "data_samples/moisture_stress_map.tif") -> str:
    """
    Saves a 2D prediction matrix (0=Healthy, 1=Mild, 2=Moderate, 3=Severe)
    into a GeoTIFF raster layer.
    """
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    height, width = prediction_grid.shape
    min_lon, min_lat, max_lon, max_lat = bbox
    
    transform = from_bounds(min_lon, min_lat, max_lon, max_lat, width, height)
    grid_uint8 = prediction_grid.astype(np.uint8)
    
    with rasterio.open(
        output_path,
        'w',
        driver='GTiff',
        height=height,
        width=width,
        count=1,
        dtype=np.uint8,
        crs='EPSG:4326',
        transform=transform,
    ) as dst:
        dst.write(grid_uint8, 1)
        
    print(f"[INFO] Saved prediction raster to GeoTIFF: {output_path}")
    return output_path