"""
Model Packaging & Hugging Face Publisher
----------------------------------------
Bundles all 7 required model artifacts with robust path resolution.
Calculates SHA-256 checksums, generates training_data_version.json,
and publishes release bundle to Hugging Face Hub.
"""

import sys
import os
import json
import hashlib
from pathlib import Path

# Anchor paths relative to ai-service directory
AI_SERVICE_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = AI_SERVICE_DIR.parent
sys.path.insert(0, str(AI_SERVICE_DIR))

from app.core.config import settings
from app.storage.huggingface_client import upload_model_to_huggingface


def compute_sha256(filepath: Path) -> str:
    """Computes SHA-256 checksum for artifact verification."""
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def find_file(filename: str, candidates: list[Path]) -> Path:
    """Finds a file among candidate paths."""
    for p in candidates:
        if p.exists():
            return p
    raise FileNotFoundError(f"Could not find required file '{filename}' in candidate locations: {candidates}")


def package_and_publish():
    print("📦 Starting Deployable Model Packaging...")

    required_artifacts = {
        "weights": find_file("fine_tuned_prithvi_multimodal.pth", [
            AI_SERVICE_DIR / "checkpoints" / "fine_tuned_prithvi_multimodal.pth",
            REPO_ROOT / "checkpoints" / "fine_tuned_prithvi_multimodal.pth",
        ]),
        "model_config": find_file("model_config.yaml", [
            AI_SERVICE_DIR / "app" / "models" / "configs" / "model_config.yaml",
        ]),
        "preprocessing_config": find_file("preprocessing_config.yaml", [
            AI_SERVICE_DIR / "app" / "models" / "configs" / "preprocessing_config.yaml",
        ]),
        "label_mappings": find_file("label_mappings.json", [
            AI_SERVICE_DIR / "app" / "models" / "configs" / "label_mappings.json",
        ]),
        "metrics": find_file("metrics.json", [
            REPO_ROOT / "metrics.json",
            AI_SERVICE_DIR / "metrics.json",
        ]),
        "model_card": find_file("model_card.md", [
            REPO_ROOT / "model_card.md",
            AI_SERVICE_DIR / "model_card.md",
        ]),
    }

    checksums = {}
    for key, path in required_artifacts.items():
        checksums[key] = {
            "file": path.name,
            "path": str(path),
            "sha256": compute_sha256(path),
        }

    # Generate training_data_version.json
    version_manifest = {
        "model_version": "1.0.0",
        "huggingface_repo": settings.HF_MODEL_ID,
        "base_model": "NASA-IMPACT/Prithvi-EO-2.0-300M",
        "data_split_version": "2026.1",
        "checksums": checksums,
    }

    version_path = REPO_ROOT / "training_data_version.json"
    with open(version_path, "w", encoding="utf-8") as f:
        json.dump(version_manifest, f, indent=2)
    print(f"📄 Generated {version_path.resolve()}")

    # Bundle into local release folder
    release_dir = AI_SERVICE_DIR / "checkpoints" / "release"
    release_dir.mkdir(parents=True, exist_ok=True)

    for key, path in required_artifacts.items():
        dest = release_dir / path.name
        with open(path, "rb") as sf, open(dest, "wb") as df:
            df.write(sf.read())

    with open(version_path, "rb") as sf, open(release_dir / version_path.name, "wb") as df:
        df.write(sf.read())

    print(f"✅ Local model release bundle prepared at '{release_dir.resolve()}'")

    # Upload if HF_TOKEN is configured
    if settings.HF_TOKEN:
        print("\n🤗 Uploading release bundle to Hugging Face Hub...")
        for artifact_path in release_dir.glob("*"):
            upload_model_to_huggingface(str(artifact_path))
    else:
        print("\nℹ️ HF_TOKEN not set in environment. Model bundle verified locally.")

    print("\n✅ Step 9 Package & Publish Complete!")


if __name__ == "__main__":
    package_and_publish()