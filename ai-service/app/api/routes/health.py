"""
Diagnostic Health & System Readiness API Route
---------------------------------------------
GET /api/v1/health
"""

import torch
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health/diagnostics")
def get_ai_service_diagnostics():
    cuda_available = torch.cuda.is_available()
    device_name = torch.cuda.get_device_name(0) if cuda_available else "CPU"
    
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "device": device_name,
        "cuda_available": cuda_available,
        "huggingface_repo": settings.HF_MODEL_ID,
        "s3_bucket": settings.AWS_S3_BUCKET
    }
