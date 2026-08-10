"""
Dataset Manifest Generator with Sample Field Population
------------------------------------------------------
1. Populates sample observations for fields field_001 to field_010.
2. Generates manifests/train.csv, manifests/val.csv, and manifests/test.csv.
3. Guarantees zero field leakage across splits.
"""

import os
import csv
import shutil
from pathlib import Path

CROP_MAPPINGS = {
    "Rice": 0,
    "Wheat": 1,
    "Maize": 2,
    "Cotton": 3,
    "Sugarcane": 4,
    "Other": 5
}

def generate_sample_manifests(output_dir: str = "manifests"):
    os.makedirs(output_dir, exist_ok=True)
    
    # Ensure sample rasters exist for field_002 to field_010 by copying field_001
    src_dir = Path("data/processed/field_001")
    if src_dir.exists():
        for i in range(2, 11):
            target_dir = Path(f"data/processed/field_00{i}" if i < 10 else f"data/processed/field_0{i}")
            target_dir.mkdir(parents=True, exist_ok=True)
            for f in src_dir.glob("*"):
                shutil.copy(f, target_dir / f.name)
        print("📁 Populated processed sample data for fields field_001 through field_010.")

    samples = [
        {"sample_id": "S_001", "field_id": "field_001", "district": "Ludhiana", "year": 2024, "crop_type": "Wheat", "split": "train"},
        {"sample_id": "S_002", "field_id": "field_002", "district": "Ludhiana", "year": 2024, "crop_type": "Rice", "split": "train"},
        {"sample_id": "S_003", "field_id": "field_003", "district": "Ludhiana", "year": 2023, "crop_type": "Maize", "split": "train"},
        {"sample_id": "S_004", "field_id": "field_004", "district": "Patiala", "year": 2024, "crop_type": "Cotton", "split": "train"},
        {"sample_id": "S_005", "field_id": "field_005", "district": "Patiala", "year": 2023, "crop_type": "Sugarcane", "split": "train"},
        {"sample_id": "S_006", "field_id": "field_006", "district": "Patiala", "year": 2022, "crop_type": "Other", "split": "train"},

        {"sample_id": "S_007", "field_id": "field_007", "district": "Jalandhar", "year": 2024, "crop_type": "Wheat", "split": "val"},
        {"sample_id": "S_008", "field_id": "field_008", "district": "Jalandhar", "year": 2024, "crop_type": "Rice", "split": "val"},

        {"sample_id": "S_009", "field_id": "field_009", "district": "Amritsar", "year": 2025, "crop_type": "Maize", "split": "test"},
        {"sample_id": "S_010", "field_id": "field_010", "district": "Amritsar", "year": 2025, "crop_type": "Cotton", "split": "test"}
    ]
    
    headers = [
        "sample_id", "field_id", "district", "year", "crop_type", "crop_label",
        "optical_path", "sar_path", "weather_path", "metadata_path"
    ]
    
    for split_name in ["train", "val", "test"]:
        filepath = Path(output_dir) / f"{split_name}.csv"
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            
            for item in samples:
                if item["split"] == split_name:
                    field_id = item["field_id"]
                    crop_name = item["crop_type"]
                    crop_label = CROP_MAPPINGS[crop_name]
                    
                    row = [
                        item["sample_id"],
                        field_id,
                        item["district"],
                        item["year"],
                        crop_name,
                        crop_label,
                        f"data/processed/{field_id}/2024-10-28_optical.tif",
                        f"data/processed/{field_id}/2024-10-28_sar.tif",
                        f"data/processed/{field_id}/2024-10-28_weather.json",
                        f"data/processed/{field_id}/metadata.json"
                    ]
                    writer.writerow(row)
                    
        print(f"📄 Generated manifests/{split_name}.csv")
        
    print("\n✅ Sample population & manifest generation complete!")

if __name__ == "__main__":
    generate_sample_manifests()