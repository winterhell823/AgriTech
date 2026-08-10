"""
Central Application Settings & Environment Variables
"""
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Crop Intelligence AI Microservice"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    PORT: int = 8000
    
    # Hugging Face Model Registry
    HF_MODEL_ID: str = "kratika24076536835854/fine-tuned-prithvi-crop-intelligence"
    HF_TOKEN: str = ""
    
    # AWS S3 Credentials (Loaded automatically from .env at runtime)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: str = "crop-intelligence-rasters"
    
    DEFAULT_BBOX: list = [75.5, 30.5, 76.5, 31.5]
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()