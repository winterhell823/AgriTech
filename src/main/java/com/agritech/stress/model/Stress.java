package com.agritech.stress.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "stress_observations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Enumerated(EnumType.STRING)
    @Column(name = "stress_level", nullable = false)
    private StressLevel stressLevel;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "moisture_index")
    private Double moistureIndex; // e.g. derived NDWI/NDMI value from the AI service

    @Column(name = "satellite_scene_id")
    private String satelliteSceneId;

    @Column(name = "observation_date", nullable = false)
    private Instant observationDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.observationDate == null) {
            this.observationDate = Instant.now();
        }
    }
}