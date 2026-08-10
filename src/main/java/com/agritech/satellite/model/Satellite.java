package com.agritech.satellite.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "satellite_scenes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Satellite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scene_id", nullable = false, unique = true)
    private String sceneId; // e.g. Sentinel scene identifier from Copernicus catalog

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private SatelliteSource source;

    @Column(name = "field_id")
    private Long fieldId; // nullable — a scene can cover multiple fields before being field-linked

    @Column(name = "capture_date", nullable = false)
    private Instant captureDate;

    @Column(name = "cloud_coverage_pct")
    private Double cloudCoveragePct;

    @Column(name = "s3_url")
    private String s3Url;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProcessingStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.status == null) {
            this.status = ProcessingStatus.PENDING;
        }
    }
}