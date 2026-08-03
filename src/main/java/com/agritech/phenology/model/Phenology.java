package com.agritech.phenology.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "phenology_observations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Phenology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Enumerated(EnumType.STRING)
    @Column(name = "growth_stage", nullable = false)
    private GrowthStage growthStage;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "satellite_scene_id")
    private String satelliteSceneId;

    @Column(name = "observation_date", nullable = false)
    private Instant observationDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if(this.observationDate == null) {
            this.observationDate = Instant.now();
        }
    }

}