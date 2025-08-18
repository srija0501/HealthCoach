package com.examly.springapp.DTO;

import com.examly.springapp.Entity.Application;

import java.time.LocalDateTime;
import java.util.List;

public class ApplicationResponseDTO {

    private Long id;
    private String fullName;
    private String phoneNumber;
    private String address;
    private int experienceYears;
    private LocalDateTime submissionDate;
    private String status;
private String program; 
    private String applicantName;
     private List<DocumentMetaDTO> documents;

    public ApplicationResponseDTO(Application app,List<DocumentMetaDTO> documents) {
        this.id = app.getId();
        this.fullName = app.getFullName();
        this.phoneNumber = app.getPhoneNumber();
        this.address = app.getAddress();
        this.experienceYears = app.getExperienceYears();
        this.submissionDate = app.getSubmissionDate();
        this.status = app.getStatus().toString();
        this.applicantName = app.getApplicant().getName(); // Only if Users entity has `name`
     this.program = (app.getProgram() != null) ? app.getProgram().name() : "NOT_SPECIFIED";
  // ✅ Add specialization
         this.documents = documents;
    }

    // Getters and Setters
        public List<DocumentMetaDTO> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentMetaDTO> documents) {
        this.documents = documents;
    }
    public String getProgram() { return program; }
public void setProgram(String program) { this.program = program; }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public String getStatus() {
        return status;
    }

   

    public String getApplicantName() {
        return applicantName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }
}
