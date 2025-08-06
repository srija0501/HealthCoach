package com.examly.springapp.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.DTO.ApplicationResponseDTO;
import com.examly.springapp.DTO.DocumentMetaDTO;
import com.examly.springapp.DTO.StatusUpdateDTO;
import com.examly.springapp.Entity.Application;
import com.examly.springapp.Service.ApplicationService;

@RestController
@RequestMapping("/application")
public class ApplicationController {

    @Autowired
    public ApplicationService appser;

    //Search by (name and email) or name or email
    @GetMapping("/search")
  public List<ApplicationResponseDTO> searchByNameAndEmail(@RequestParam(required = false) String name, @RequestParam(required = false) String email)    {
    List<Application> applications = appser.searchByNameAndEmail(name, email);

    return applications.stream()
            .map(app -> {
                List<DocumentMetaDTO> docDTOs = app.getDocuments().stream()
                        .map(doc -> new DocumentMetaDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
                        .collect(Collectors.toList());
                return new ApplicationResponseDTO(app, docDTOs);
            })
            .collect(Collectors.toList());
   }


    /**
     * FR3.1 - Only APPLICANT can submit application
     * FR3.3 - Prevent multiple submissions from same applicant
     * FR3.2 - Capture all required fields including personal, professional, and
     * certificate info
     */
    @PostMapping("/submit/{userId}")
    public Application submitApplication(@PathVariable Long userId, @RequestBody Application application) {
        return appser.submitApplication(userId, application);
    }

    /**
     * FR5 (extended) - Retrieve specific application details by ID
     * (Useful for both applicants and reviewers)
     */
    // Get Application by ID with DTO
    @GetMapping("/{id}")
    public ApplicationResponseDTO getApplicationById(@PathVariable Long id) {
        Application app = appser.getApplicationById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    List<DocumentMetaDTO> documentDTOs = app.getDocuments().stream()
            .map(doc -> new DocumentMetaDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
            .collect(Collectors.toList());

    return new ApplicationResponseDTO(app, documentDTOs);
    }

    /**
     * FR4.1 - Reviewer should be able to fetch all pending applications for review
     */
    @GetMapping("/pending")

    public List<ApplicationResponseDTO> getPendingApplications() {
        return appser.getPendingApplications()
            .stream()
            .map(app -> {
                List<DocumentMetaDTO> docDTOs = app.getDocuments().stream()
                        .map(doc -> new DocumentMetaDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
                        .collect(Collectors.toList());
                return new ApplicationResponseDTO(app, docDTOs);
            })
            .collect(Collectors.toList());
    }

    /**
     * FR4.2 - Reviewer can update application status
     * (APPROVED/REJECTED/UNDER_REVIEW)
     * FR4.3 - Ensure valid status update and appropriate feedback
     */
    @PutMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId, @RequestBody StatusUpdateDTO statusDTO) {
    return appser.updateApplicationStatus(
        applicationId,
        statusDTO.getStatus(),
        statusDTO.getRejectionReason()
    );
    }

    @GetMapping("/dashboard/{userId}")
    public List<ApplicationResponseDTO> getDashboardData(@PathVariable Long userId) {
       return appser.getDashboardApplications(userId);
    }


    @GetMapping("/filterByStatus")
    public List<ApplicationResponseDTO> filterByStatus(@RequestParam String status) {
       List<Application> applications = appser.filterByStatus(status);

      return applications.stream()
            .map(app -> {
                List<DocumentMetaDTO> docDTOs = app.getDocuments().stream()
                        .map(doc -> new DocumentMetaDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
                        .collect(Collectors.toList());
                return new ApplicationResponseDTO(app, docDTOs);
            })
            .collect(Collectors.toList());
    }
   
   

}
