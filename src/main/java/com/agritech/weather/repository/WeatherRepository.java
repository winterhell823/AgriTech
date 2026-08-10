package com.agritech.weather.repository;

import com.agritech.weather.model.Weather;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeatherRepository extends JpaRepository<Weather, Long> {

    List<Weather> findByFieldIdOrderByRecordedAtDesc(Long fieldId);

    Optional<Weather> findTopByFieldIdOrderByRecordedAtDesc(Long fieldId);
}