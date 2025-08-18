package com.examly.springapp.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    private Users applicant;

    private String fullName;
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "experience_years", nullable = false)
    private int experienceYears;

    // ✅ New field: program selection
    @Enumerated(EnumType.STRING)
    @Column(name = "program", nullable = false)
    private ProgramType program;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ApplicationDocument> documents = new ArrayList<>();

    // --- Constructors ---
    public Application() {
        this.submissionDate = LocalDateTime.now();
        this.status = ApplicationStatus.PENDING;
    }

    public Application(Users applicant, String fullName, String phoneNumber,
                       String address, int experienceYears, ProgramType program) {
        this.applicant = applicant;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.experienceYears = experienceYears;
        this.program = program;
        this.submissionDate = LocalDateTime.now();
        this.status = ApplicationStatus.PENDING;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }

    public Users getApplicant() { return applicant; }
    public void setApplicant(Users applicant) { this.applicant = applicant; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public ProgramType getProgram() { return program; }
    public void setProgram(ProgramType program) { this.program = program; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public List<ApplicationDocument> getDocuments() { return documents; }
    public void setDocuments(List<ApplicationDocument> documents) { this.documents = documents; }

    // --- Enums ---
    public enum ApplicationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    public enum ProgramType {
        FITNESS,
        MENTAL_WELLNESS,
        NUTRITION,
        YOGA,
        LIFESTYLE
    }
}
