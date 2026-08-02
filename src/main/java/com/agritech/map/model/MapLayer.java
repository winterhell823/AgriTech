package com.agritech.map.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "map_layers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapLayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Enumerated(EnumType.STRING)
    @Column(name = "layer_type", nullable = false)
    private LayerType layerType;

    @Column(name = "layer_name", nullable = false)
    private String layerName;

    @Column(name = "data_url")
    private String dataUrl; // S3/tile URL for raster layers (e.g. NDVI, satellite)

    @Column(name = "geo_json_data", columnDefinition = "TEXT")
    private String geoJsonData; // for vector layers (e.g. boundary, stress zones)

    @Column(name = "capture_date")
    private Instant captureDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}