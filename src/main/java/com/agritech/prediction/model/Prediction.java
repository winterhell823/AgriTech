package com.agritech.prediction.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_id", nullable = false)
    private Long fieldId;

    @Column(name = "satellite_scene_id")
    private String satelliteSceneId;

    @Column(name = "crop_type")
    private String cropType;

    @Column(name = "crop_confidence")
    private Double cropConfidence;

    @Column(name = "growth_stage")
    private String growthStage;

    @Column(name = "phenology_confidence")
    private Double phenologyConfidence;

    // Populated once the stress module exists -nullable for now
    @Column(name = "stress_level")
    private String stressLevel;

    @Column(name = "stress_confidence")
    private Double stressConfidence;

    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;  // full JSON from the AI service , kept for audit and debugging

    @Column(name = "prediction_date", nullable = false)
    private Instant predictionDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if(this.predictionDate == null) {
            this.predictionDate = Instant.now();
        }
    }
}