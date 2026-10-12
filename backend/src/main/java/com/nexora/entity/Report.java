package com.nexora.entity;

import com.nexora.enums.ReportStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports", indexes = {
    @Index(name = "idx_report_status", columnList = "status"),
    @Index(name = "idx_report_user", columnList = "reporting_user_id")
})
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @NotNull(message = "Reporting user is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporting_user_id", nullable = false)
    private User reportingUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_provider_id")
    private Provider reportedProvider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_review_id")
    private Rating reportedReview;

    @NotBlank(message = "Reason is required")
    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReportStatus status = ReportStatus.OPEN;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Report() {
    }

    public Report(User reportingUser, Provider reportedProvider, Rating reportedReview, String reason) {
        this.reportingUser = reportingUser;
        this.reportedProvider = reportedProvider;
        this.reportedReview = reportedReview;
        this.reason = reason;
        this.status = ReportStatus.OPEN;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public User getReportingUser() {
        return reportingUser;
    }

    public void setReportingUser(User reportingUser) {
        this.reportingUser = reportingUser;
    }

    public Provider getReportedProvider() {
        return reportedProvider;
    }

    public void setReportedProvider(Provider reportedProvider) {
        this.reportedProvider = reportedProvider;
    }

    public Rating getReportedReview() {
        return reportedReview;
    }

    public void setReportedReview(Rating reportedReview) {
        this.reportedReview = reportedReview;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
