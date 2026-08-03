package com.agritech.report.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.report.dto.ReportRequestDto;
import com.agritech.report.dto.ReportResponseDto;
import com.agritech.report.model.Report;
import com.agritech.report.model.ReportStatus;
import com.agritech.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Override
    public ReportResponseDto requestReport(ReportRequestDto requestDto) {
        Report report = Report.builder()
                .fieldId(requestDto.getFieldId())
                .reportType(requestDto.getReportType())
                .status(ReportStatus.PENDING)
                .periodStart(requestDto.getPeriodStart())
                .periodEnd(requestDto.getPeriodEnd())
                .build();

        Report saved = reportRepository.save(report);
        return toDto(saved);
        // NOTE: actual PDF/report generation logic is not implemented here —
        // in a full build this would trigger an async job (e.g. via a queue or @Async service)
        // that renders the report and calls markCompleted(...) when done.
    }

    @Override
    public ReportResponseDto getById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
        return toDto(report);
    }

    @Override
    public List<ReportResponseDto> getByField(Long fieldId) {
        return reportRepository.findByFieldIdOrderByCreatedAtDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponseDto markCompleted(Long id, String fileUrl) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));

        report.setStatus(ReportStatus.COMPLETED);
        report.setFileUrl(fileUrl);
        report.setCompletedAt(Instant.now());

        Report updated = reportRepository.save(report);
        return toDto(updated);
    }

    @Override
    public ReportResponseDto markFailed(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));

        report.setStatus(ReportStatus.FAILED);

        Report updated = reportRepository.save(report);
        return toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Report", "id", id);
        }
        reportRepository.deleteById(id);
    }

    private ReportResponseDto toDto(Report report) {
        return ReportResponseDto.builder()
                .id(report.getId())
                .fieldId(report.getFieldId())
                .reportType(report.getReportType())
                .status(report.getStatus())
                .fileUrl(report.getFileUrl())
                .periodStart(report.getPeriodStart())
                .periodEnd(report.getPeriodEnd())
                .createdAt(report.getCreatedAt())
                .completedAt(report.getCompletedAt())
                .build();
    }
}