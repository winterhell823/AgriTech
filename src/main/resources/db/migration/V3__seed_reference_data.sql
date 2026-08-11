-- V3__seed_reference_data.sql: Reference Seed Data for Initial Field Records

INSERT INTO users (id, name, email, password_hash, role, created_at)
VALUES 
(1, 'Agri Officer Punjab', 'officer.punjab@agritech.gov.in', '$2a$10$e7xXj90H3X7s8g0vX5A6d.u5d1w7c8e9f0g1h2i3j4k5l6m7n8o9', 'ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

INSERT INTO fields (id, owner_id, field_name, area_hectares, crop_type, created_at)
VALUES 
(1024, 'farmer_101', 'Ludhiana Wheat Parcel 4', 12.5, 'Wheat', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO predictions (id, field_id, crop_type, crop_confidence, phenology_stage, phenology_confidence, moisture_stress, stress_confidence, raster_s3_url, prediction_date, created_at)
VALUES 
(1001, 1024, 'Wheat', 0.91, 'Flowering', 0.87, 'Moderate', 0.83, 'https://crop-intelligence-rasters-2026.s3.us-east-1.amazonaws.com/outputs/stress_1024.tif', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
