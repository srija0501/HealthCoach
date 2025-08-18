package com.examly.springapp.DTO;

public class DashboardDTO {
    // For all roles
    private final Integer pendingCount;
    
    // For applicants
    private final String applicationStatus;
    
    // For admin
    private final Long totalUsers;

    private DashboardDTO(Integer pendingCount, String applicationStatus, Long totalUsers) {
        this.pendingCount = pendingCount;
        this.applicationStatus = applicationStatus;
        this.totalUsers = totalUsers;
    }

    // Factory methods
    public static DashboardDTO createForApplicant(String status) {
        return new DashboardDTO(null, status, null);
    }

    public static DashboardDTO createForReviewer(Integer pendingCount) {
        return new DashboardDTO(pendingCount, null, null);
    }

    public static DashboardDTO createForAdmin(Integer pendingCount, Long totalUsers) {
        return new DashboardDTO(pendingCount, null, totalUsers);
    }

    // Getters
    public Integer getPendingCount() { return pendingCount; }
    public String getApplicationStatus() { return applicationStatus; }
    public Long getTotalUsers() { return totalUsers; }
}