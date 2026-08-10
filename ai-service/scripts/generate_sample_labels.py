"""
Generate Ground-Truth Sample Labels & Manifests Helper Script
"""
import os
import pandas as pd

def generate_sample_manifests():
    os.makedirs("manifests", exist_ok=True)
    train_samples = [
        {"sample_id": f"S_{i:03d}", "field_id": f"F_{100+i}", "optical_path": f"data/processed/field_{i:03d}/2024-10-28_optical.tif", "sar_path": f"data/processed/field_{i:03d}/2024-10-28_sar.tif", "weather_path": f"data/processed/field_{i:03d}/2024-10-28_weather.json", "crop_label": i % 6, "phenology_label": i % 5, "stress_label": i % 4}
        for i in range(1, 11)
    ]
    val_samples = [
        {"sample_id": f"V_{i:03d}", "field_id": f"F_{200+i}", "optical_path": f"data/processed/field_{10+i:03d}/2024-10-28_optical.tif", "sar_path": f"data/processed/field_{10+i:03d}/2024-10-28_sar.tif", "weather_path": f"data/processed/field_{10+i:03d}/2024-10-28_weather.json", "crop_label": i % 6, "phenology_label": i % 5, "stress_label": i % 4}
        for i in range(1, 4)
    ]
    pd.DataFrame(train_samples).to_csv("manifests/train.csv", index=False)
    pd.DataFrame(val_samples).to_csv("manifests/val.csv", index=False)
    print(f"[SUCCESS] Generated dataset manifests in manifests/train.csv and manifests/val.csv")

if __name__ == "__main__":
    generate_sample_manifests()
