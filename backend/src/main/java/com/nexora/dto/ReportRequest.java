package com.nexora.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportRequest {

    private Long reportedProviderId;
    private Long reportedReviewId;

    @NotBlank(message = "Reason is required")
    private String reason;

    public ReportRequest() {
    }

    public Long getReportedProviderId() { return reportedProviderId; }
    public void setReportedProviderId(Long reportedProviderId) { this.reportedProviderId = reportedProviderId; }
    public Long getReportedReviewId() { return reportedReviewId; }
    public void setReportedReviewId(Long reportedReviewId) { this.reportedReviewId = reportedReviewId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
