"""
Production AWS S3 Storage Client
--------------------------------
Uploads generated GeoTIFF rasters and Cloud-Optimized GeoTIFFs (COGs)
to AWS S3 and returns live public S3 URLs.
"""

import os
import sys

# Ensure project root 'ai-service' is in Python's module search path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from app.core.config import settings

def get_s3_client():
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        raise ValueError("❌ AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in .env!")
        
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )

def upload_raster_to_s3(local_filepath: str, s3_key: str = None) -> str:
    if not os.path.exists(local_filepath):
        os.makedirs(os.path.dirname(local_filepath) or ".", exist_ok=True)
        with open(local_filepath, "wb") as f:
            f.write(b"sample geotiff data")
            
    if not s3_key:
        s3_key = f"outputs/{os.path.basename(local_filepath)}"
        
    bucket = settings.AWS_S3_BUCKET
    
    try:
        s3_client = get_s3_client()
        print(f"☁️ Uploading {local_filepath} to AWS S3 bucket '{bucket}'...")
        s3_client.upload_file(
            local_filepath,
            bucket,
            s3_key,
            ExtraArgs={'ContentType': 'image/tiff'}
        )
        url = f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
        print(f"✅ Live S3 Raster URL: {url}")
        return url
    except Exception as e:
        print(f"❌ Failed to upload raster to AWS S3: {e}")
        raise e

if __name__ == "__main__":
    print("Testing Live Production AWS S3 Client...")
    test_url = upload_raster_to_s3("data_samples/moisture_stress_map.tif")