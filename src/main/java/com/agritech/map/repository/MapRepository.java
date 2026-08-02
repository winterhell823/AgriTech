package com.agritech.map.repository;

import com.agritech.map.model.LayerType;
import com.agritech.map.model.MapLayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MapRepository extends JpaRepository<MapLayer, Long> {

    List<MapLayer> findByFieldId(Long fieldId);

    List<MapLayer> findByFieldIdAndLayerType(Long fieldId, LayerType layerType);
}