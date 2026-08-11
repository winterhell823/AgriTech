-- V1__init_schema.sql: Database Schema DDL for AgriTech Microservices Platform

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fields (
    id BIGSERIAL PRIMARY KEY,
    owner_id VARCHAR(100) NOT NULL,
    field_name VARCHAR(150) NOT NULL,
    area_hectares DOUBLE PRECISION NOT NULL,
    crop_type VARCHAR(100),
    boundary GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    field_id BIGINT NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    crop_confidence DOUBLE PRECISION NOT NULL,
    phenology_stage VARCHAR(100) NOT NULL,
    phenology_confidence DOUBLE PRECISION NOT NULL,
    moisture_stress VARCHAR(100) NOT NULL,
    stress_confidence DOUBLE PRECISION NOT NULL,
    raster_s3_url TEXT,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fields_owner_id ON fields(owner_id);
CREATE INDEX IF NOT EXISTS idx_predictions_field_id ON predictions(field_id);
