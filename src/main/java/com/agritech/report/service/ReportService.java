package com.agritech.report.service;

import com.agritech.report.dto.ReportRequestDto;
import com.agritech.report.dto.ReportResponseDto;

import java.util.List;

public interface ReportService {

    /** Creates a report record in PENDING status; actual file generation happens async. */
    ReportResponseDto requestReport(ReportRequestDto requestDto);

    ReportResponseDto getById(Long id);

    List<ReportResponseDto> getByField(String fieldId);

    /** Called once the report file has actually been generated and uploaded to S3. */
    ReportResponseDto markCompleted(Long id, String fileUrl);

    ReportResponseDto markFailed(Long id);

    void delete(Long id);
}