package com.examly.springapp.DTO;

import com.examly.springapp.Entity.Application.ApplicationStatus;

public class StatusUpdateDTO {
    private ApplicationStatus status;
     private String rejectionReason;

    public String getRejectionReason() {
        return rejectionReason;
    }

     public void setRejectionReason(String rejectionReason) {
         this.rejectionReason = rejectionReason;
     }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
