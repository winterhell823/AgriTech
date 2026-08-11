"""
FastAPI AI Services Microservice Entry Point
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import predict, explain, health, phenology, stress

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI Microservice for Crop Type Classification, Phenology and Moisture Stress"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, "CORS_ORIGINS") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Production Routers
app.include_router(predict.router, prefix=settings.API_PREFIX, tags=["ML Inference"])
app.include_router(explain.router, prefix=settings.API_PREFIX, tags=["Explainability"])
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["System Health"])
app.include_router(phenology.router, prefix=settings.API_PREFIX, tags=["Phenology Tracking"])
app.include_router(stress.router, prefix=settings.API_PREFIX, tags=["Moisture Stress Analysis"])

@app.get("/")
def root():
    return {"service": settings.PROJECT_NAME, "status": "online"}

@app.get("/health")
def health():
    return {"status": "healthy", "hf_registry": settings.HF_MODEL_ID}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=settings.PORT, reload=True)