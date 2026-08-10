package com.agritech.report.dto;

import com.agritech.report.model.ReportStatus;
import com.agritech.report.model.ReportType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponseDto {

    private Long id;
    private String fieldId;
    private ReportType reportType;
    private ReportStatus status;
    private String fileUrl;
    private Instant periodStart;
    private Instant periodEnd;
    private Instant createdAt;
    private Instant completedAt;
}