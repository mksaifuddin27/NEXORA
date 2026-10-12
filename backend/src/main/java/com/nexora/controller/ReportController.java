package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import com.nexora.dto.ReportRequest;
import com.nexora.entity.Report;
import com.nexora.security.UserPrincipal;
import com.nexora.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> createReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReportRequest request
    ) {
        Report report = reportService.createReport(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(report, "Report filed for administrator review."));
    }
}
