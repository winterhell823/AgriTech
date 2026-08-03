package com.agritech.report.dto;

import com.agritech.report.model.ReportType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    @NotNull(message = "reportType is required")
    private ReportType reportType;

    private Instant periodStart;

    private Instant periodEnd;
}