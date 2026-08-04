"""
Planetary Computer STAC Data Sourcing & 6-Band Tile Extractor
-------------------------------------------------------------
Queries Sentinel-2 L2A & Sentinel-1 SAR via Microsoft Planetary Computer STAC API,
maps the 6 HLS spectral channels required by Prithvi EO-2.0, crops scenes into
512x512 tiles, and saves them locally or to AWS S3.
"""

import os
import json
import numpy as np
import rasterio
from rasterio.windows import Window
import pystac_client
import planetary_computer

# 1. Prithvi EO-2.0 HLS 6-Band Channel Mapping
PRITHVI_HLS_BANDS = {
    "Blue": "B02",      # Band 2 (~490 nm)
    "Green": "B03",     # Band 3 (~560 nm)
    "Red": "B04",       # Band 4 (~665 nm)
    "Narrow_NIR": "B08",# Band 8 (~842 nm)
    "SWIR_1": "B11",    # Band 11 (~1610 nm)
    "SWIR_2": "B12"     # Band 12 (~2190 nm)
}

def connect_stac_catalog():
    """Connects to Microsoft Planetary Computer STAC catalog with signed URLs."""
    catalog = pystac_client.Client.open(
        "https://planetarycomputer.microsoft.com/api/stac/v1",
        modifier=planetary_computer.sign_inplace
    )
    return catalog

def search_sentinel2_scenes(catalog, bbox, date_range="2024-06-01/2024-10-31", max_cloud_cover=15):
    """Searches for Sentinel-2 L2A scenes matching AOI, date range, and cloud cover threshold."""
    search = catalog.search(
        collections=["sentinel-2-l2a"],
        bbox=bbox,
        datetime=date_range,
        query={"eo:cloud_cover": {"lt": max_cloud_cover}}
    )
    items = search.item_collection()
    print(f"✅ Found {len(items)} Sentinel-2 scenes matching criteria.")
    return items

def extract_prithvi_6band_tile(stac_item, tile_size=512):
    """
    Extracts and stacks the 6 HLS bands (B02, B03, B04, B08, B11, B12)
    expected by Prithvi EO-2.0 from a STAC item into a (6, tile_size, tile_size) tensor array.
    """
    band_arrays = []
    
    for band_name, band_id in PRITHVI_HLS_BANDS.items():
        if band_id not in stac_item.assets:
            raise KeyError(f"Band {band_id} ({band_name}) not found in STAC item assets.")
        
        href = stac_item.assets[band_id].href
        with rasterio.open(href) as src:
            # Read top-left 512x512 tile window for demo/training
            window = Window(0, 0, min(tile_size, src.width), min(tile_size, src.height))
            data = src.read(1, window=window)
            
            # Pad array if scene boundary is smaller than tile_size
            if data.shape != (tile_size, tile_size):
                padded = np.zeros((tile_size, tile_size), dtype=data.dtype)
                padded[:data.shape[0], :data.shape[1]] = data
                data = padded
                
            band_arrays.append(data)
            
    # Stack into 6-channel array: Shape (6, 512, 512)
    stacked_6band = np.stack(band_arrays, axis=0)
    print(f"✅ Extracted 6-Band Prithvi tensor tile. Shape: {stacked_6band.shape}")
    return stacked_6band

def search_sentinel1_sar_scenes(catalog, bbox, date_range="2024-06-01/2024-10-31"):
    """Searches for Sentinel-1 Ground Range Detected (GRD) SAR scenes."""
    search = catalog.search(
        collections=["sentinel-1-grd"],
        bbox=bbox,
        datetime=date_range
    )
    items = search.item_collection()
    print(f"✅ Found {len(items)} Sentinel-1 SAR scenes.")
    return items

if __name__ == "__main__":
    # Example AOI Bounding Box: [min_lon, min_lat, max_lon, max_lat] (e.g., Punjab Region)
    sample_bbox = [75.5, 30.5, 76.5, 31.5]
    
    print("🔍 Connecting to Microsoft Planetary Computer...")
    cat = connect_stac_catalog()
    
    print("🌾 Searching Optical Sentinel-2 Imagery...")
    s2_scenes = search_sentinel2_scenes(cat, bbox=sample_bbox)
    
    if len(s2_scenes) > 0:
        first_scene = s2_scenes[0]
        tile_data = extract_prithvi_6band_tile(first_scene, tile_size=512)
        
        # Save sample array locally for inspection
        os.makedirs("data_samples", exist_ok=True)
        np.save("data_samples/sample_6band_tile.npy", tile_data)
        print("💾 Saved sample 6-band tile to data_samples/sample_6band_tile.npy")
        
    print("📡 Searching SAR Sentinel-1 Imagery...")
    s1_scenes = search_sentinel1_sar_scenes(cat, bbox=sample_bbox)