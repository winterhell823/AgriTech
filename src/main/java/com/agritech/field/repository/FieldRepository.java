package com.agritech.field.repository;

import com.agritech.field.model.Field;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldRepository extends JpaRepository<Field, Long> {

    List<Field> findByOwnerId(String ownerId);
}