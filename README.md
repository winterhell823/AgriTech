# 🌾 AI Crop Intelligence

AI Crop Intelligence is a multimodal AI-powered precision agriculture platform that uses satellite imagery, SAR data, weather information, and agricultural ground truth to provide field-level crop intelligence.

Video Demo Link : 

<img width="1509" height="829" alt="Screenshot 2026-08-11 at 7 56 51 PM" src="https://github.com/user-attachments/assets/ebb95afc-b8f7-4338-99a4-2baf5ab5f340" />


## 🎯 Key Features

- 🌱 **Crop Type Classification** – Identifies crop types from satellite observations.
- 🌿 **Phenological Stage Mapping** – Detects crop growth stages such as germination, vegetative, flowering, and maturity.
- 💧 **Moisture Stress Detection** – Identifies and classifies crop moisture stress.
- 🗺️ **GIS Dashboard** – Interactive field-level visualization using maps and satellite layers.
- ⏳ **Time Slider** – Visualizes crop conditions and changes across different observations.
- 🤖 **AI Assistant** – RAG-based chatbot for querying crop reports, model outputs, and geospatial insights.
- 🚜 **Irrigation Decision Support** – Provides field-level irrigation priorities based on detected moisture stress.

## 🧠 AI & Methodology

The system follows a multimodal approach:

**Optical Satellite Data + SAR + Weather Data**
→ Data Preprocessing & Temporal Alignment  
→ **Prithvi EO-2.0 + LoRA** for efficient Earth Observation feature extraction  
→ SAR CNN + Weather Encoder  
→ Multimodal Feature Fusion  
→ Multi-Task Prediction  
→ Crop Type + Phenology + Moisture Stress  
→ GIS Visualization & Irrigation Recommendations

## 🛰️ Data Sources

- Sentinel-2 / Landsat – Optical imagery
- Sentinel-1 – SAR imagery
- ERA5 / Meteorological datasets – Weather information
- Agricultural ground-truth datasets – Model training and validation

## 🏗️ Technology Stack

**Frontend:** React + Leaflet  
**Backend:** Spring Boot REST APIs  
**AI Service:** Python + PyTorch + Geospatial Libraries  
**Model:** Prithvi EO-2.0 (300M) + LoRA  
**Database:** PostgreSQL + PostGIS  
**Cache:** Redis  
**Storage:** AWS S3 for satellite rasters and large geospatial objects  
**AI Communication:** Spring Boot ↔ Python REST APIs  
**Chatbot:** LLM + RAG  
**Model Hosting:** Hugging Face Hub

## 🔄 System Workflow

```text
Satellite + Weather + Ground Truth
              ↓
       Data Preprocessing
              ↓
     Multimodal AI Pipeline
              ↓
     Crop Intelligence
   ┌──────────┼──────────┐
   ↓          ↓          ↓
 Crop      Phenology   Moisture
 Type       Stage       Stress
   └──────────┼──────────┘
              ↓
        GIS Processing
              ↓
    Field-Level Insights
              ↓
   Irrigation Recommendations
              ↓
      React GIS Dashboard

# Setup Guide 
Environment Variables

# Create a .env file inside the AI service:

# Hugging Face
HF_TOKEN=hf_xxxxxxxxxxxxxxxxx

# Fine-tuned Prithvi Model
HF_MODEL_REPO=your-username/fine-tuned-prithvi-crop-intelligence

# AWS S3
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
AWS_REGION=ap-south-1
AWS_S3_BUCKET=crop-intelligence-data

# Optional LLM / AI Assistant
LLM_API_KEY=xxxxxxxxxxxxxxxx
