package com.agritech.field.repository;

import com.agritech.field.model.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FieldRepository extends JpaRepository<Field, Long> {

    List<Field> findByOwnerId(String ownerId);

    @Query(value = "SELECT * FROM fields f WHERE ST_Intersects(f.boundary, ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326))", nativeQuery = true)
    List<Field> findFieldsInBoundingBox(
            @Param("minLon") double minLon,
            @Param("minLat") double minLat,
            @Param("maxLon") double maxLon,
            @Param("maxLat") double maxLat
    );
}