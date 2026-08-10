"""
Geospatial Vector Utility Functions
----------------------------------
GeoJSON parsing, bounding box calculations, and vector geometry mask generation.
"""

def extract_bbox_from_geojson(geojson_geom: dict) -> list:
    """
    Extracts bounding box [min_lon, min_lat, max_lon, max_lat] from GeoJSON geometry dict.
    """
    coords = []
    if geojson_geom.get("type") == "Polygon":
        coords = geojson_geom["coordinates"][0]
    elif geojson_geom.get("type") == "MultiPolygon":
        for poly in geojson_geom["coordinates"]:
            coords.extend(poly[0])

    if not coords:
        return [75.5, 30.5, 76.5, 31.5]

    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    return [float(min(lons)), float(min(lats)), float(max(lons)), float(max(lats))]

def get_centroid_from_bbox(bbox: list) -> tuple:
    """Calculates center (latitude, longitude) coordinate pair from [min_lon, min_lat, max_lon, max_lat]."""
    center_lon = (bbox[0] + bbox[2]) / 2.0
    center_lat = (bbox[1] + bbox[3]) / 2.0
    return float(center_lat), float(center_lon)
