"""
Weather Preprocessing & Open-Meteo Live API Fetcher
---------------------------------------------------
Fetches daily/hourly meteorological indicators (Temperature, Rainfall,
Humidity, Wind Speed) for a target latitude/longitude via Open-Meteo API
and formats them into normalized feature vectors for the Weather MLP Encoder.
"""

import requests
import numpy as np
from typing import Dict, List, Any

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def fetch_live_weather(lat: float, lon: float, days: int = 7) -> Dict[str, Any]:
    """
    Fetches temperature, precipitation, relative humidity, and wind speed
    from Open-Meteo API for given lat/lon coordinates. No API key required.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "windspeed_10m_max"],
        "hourly": ["relativehumidity_2m"],
        "forecast_days": days,
        "timezone": "auto"
    }
    
    response = requests.get(OPEN_METEO_URL, params=params, timeout=3.0)
    if response.status_code != 200:
        raise ConnectionError(f"Failed to fetch weather data from Open-Meteo: {response.status_code}")
    
    return response.json()

def extract_weather_feature_vector(weather_json: Dict[str, Any]) -> np.ndarray:
    """
    Extracts and normalizes weather parameters into a 4-element feature vector:
    [Mean Temperature (°C), Total Rainfall (mm), Mean Humidity (%), Max Wind Speed (km/h)]
    """
    daily = weather_json.get("daily", {})
    hourly = weather_json.get("hourly", {})
    
    temp_max = np.mean(daily.get("temperature_2m_max", [25.0]))
    temp_min = np.mean(daily.get("temperature_2m_min", [15.0]))
    mean_temp = (temp_max + temp_min) / 2.0
    
    total_precip = np.sum(daily.get("precipitation_sum", [0.0]))
    mean_humidity = np.mean(hourly.get("relativehumidity_2m", [50.0]))
    max_wind = np.max(daily.get("windspeed_10m_max", [10.0]))
    
    # Raw vector
    raw_vector = np.array([mean_temp, total_precip, mean_humidity, max_wind], dtype=np.float32)
    
    # Normalize features: Temp (/50), Precip (/100), Humidity (/100), Wind (/50)
    normalized_vector = raw_vector / np.array([50.0, 100.0, 100.0, 50.0], dtype=np.float32)
    return np.clip(normalized_vector, 0.0, 1.0)

def fetch_grid_weather(bbox: list) -> np.ndarray:
    """
    Samples weather parameters across 4 bounding box grid coordinates and averages feature vectors.
    """
    min_lon, min_lat, max_lon, max_lat = bbox
    grid_coords = [
        (min_lat, min_lon), (min_lat, max_lon),
        (max_lat, min_lon), (max_lat, max_lon)
    ]
    vectors = []
    for lat, lon in grid_coords:
        try:
            w_json = fetch_live_weather(lat, lon)
            vectors.append(extract_weather_feature_vector(w_json))
        except Exception as e:
            print(f"[NOTE] Weather fetch note for ({lat}, {lon}): {e}")
            
    if vectors:
        return np.mean(vectors, axis=0)
    return np.array([0.5, 0.1, 0.5, 0.2], dtype=np.float32)

if __name__ == "__main__":
    # Test for Punjab Coordinates
    test_lat, test_lon = 30.9, 75.8
    print(f"🌤️ Fetching weather data for Lat: {test_lat}, Lon: {test_lon}...")
    data = fetch_live_weather(test_lat, test_lon)
    vec = extract_weather_feature_vector(data)
    print(f"✅ Weather Feature Vector shape: {vec.shape}, Normalized values: {vec}")