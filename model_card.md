# Prithvi EO-2.0 Crop Intelligence Model Card

## Model Details
- **Architecture**: NASA-IMPACT Prithvi EO-2.0 Multimodal Transformer
- **Task**: Crop Type Classification (6 Classes: Rice, Wheat, Maize, Cotton, Sugarcane, Other)
- **Input Channels**: 6 Optical HLS Bands (B02, B03, B04, B08, B11, B12), 3 SAR Channels (VV, VH, VV/VH), 4 Weather Variables
- **Spatial Resolution**: 10m resampled

## Test Performance Metrics
- **Total Test Samples**: 2
- **Overall Accuracy**: 50.00%
- **Macro F1 Score**: 0.3333
- **Macro Precision**: 0.2500
- **Macro Recall**: 0.5000

## Per-Class Performance
| Crop Class | Precision | Recall | F1 Score |
| :--- | :--- | :--- | :--- |
| Rice | 0.0000 | 0.0000 | 0.0000 |
| Wheat | 0.0000 | 0.0000 | 0.0000 |
| Maize | 0.5000 | 1.0000 | 0.6667 |
| Cotton | 0.0000 | 0.0000 | 0.0000 |
| Sugarcane | 0.0000 | 0.0000 | 0.0000 |
| Other | 0.0000 | 0.0000 | 0.0000 |
