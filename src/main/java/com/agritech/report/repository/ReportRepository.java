package com.agritech.report.repository;

import com.agritech.report.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByFieldIdOrderByCreatedAtDesc(String fieldId);
}