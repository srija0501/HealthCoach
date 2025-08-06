package com.examly.springapp.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.examly.springapp.DTO.ApplicationResponseDTO;
import com.examly.springapp.DTO.DocumentMetaDTO;
import com.examly.springapp.Entity.Application;
import com.examly.springapp.Entity.Application.ApplicationStatus;
import com.examly.springapp.Entity.Users;

import com.examly.springapp.Repository.ApplicationRepository;
@Service
public class ApplicationService {
       @Autowired
       private ApplicationRepository apprep;
       @Autowired
       private UsersService us;

       @Autowired
       private NotificationService notificationService;
      public Application submitApplication(Long userId, Application application) {
        Users user = us.getUserById(userId); 

        if (user.getRole() != Users.Role.APPLICANT) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only APPLICANTS can submit applications");
       }

       if (apprep.existsByApplicantId(userId)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Application already submitted");
       }

        application.setApplicant(user);
        application.setSubmissionDate(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        Application savedApp = apprep.save(application);


    // ✅ Send notification to all reviewers
     List<Users> reviewers = us.getUsersByRole(Users.Role.REVIEWER);
       for (Users reviewer : reviewers) {
        notificationService.sendNotification(reviewer, "New application submitted by: " + user.getName());
       }

        return savedApp;
    }


    public Optional<Application> getApplicationById(Long id) {
        return apprep.findById(id);
    }

    public List<Application> getAllApplications() {
        return apprep.findAll();
    }

    public List<Application> searchByNameAndEmail(String name, String email) {
        return apprep.searchByNameAndEmail(name, email);
    }

   
    public List<Application> getApplicationsByStatus(ApplicationStatus status) {
        return apprep.findByStatus(status);
    }
    public List<Application> getPendingApplications() {
        return apprep.findByStatus(ApplicationStatus.PENDING);
    }
    
    public List<ApplicationResponseDTO> getDashboardApplications(Long userId) {
    Users user = us.getUserById(userId);  // Fetch user from DB

    List<Application> applications;

    switch (user.getRole()) {
        case APPLICANT:
            // Applications submitted by this applicant
            applications = apprep.findByApplicantId(userId);
            break;

        case REVIEWER:
            // Show only PENDING applications (you don’t have assigned logic yet)
            applications = apprep.findByStatus(Application.ApplicationStatus.PENDING);
            break;

        case ADMIN:
            // Show all applications
            applications = apprep.findAll();
            break;

        default:
            throw new RuntimeException("Unsupported role: " + user.getRole());
    }

    // Map to ApplicationResponseDTO (with document info)
    return applications.stream()
        .map(app -> {
            List<DocumentMetaDTO> docDTOs = app.getDocuments().stream()
                .map(doc -> new DocumentMetaDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
                .collect(Collectors.toList());
            return new ApplicationResponseDTO(app, docDTOs);
        })
        .collect(Collectors.toList());
}



   public Application updateApplicationStatus(Long appId, ApplicationStatus status, String rejectionReason) {
    Application app = apprep.findById(appId)
        .orElseThrow(() -> new RuntimeException("Application not found"));

    app.setStatus(status);

    Application updatedApp = apprep.save(app);

    // Notify the applicant
    String message;
    if (status == ApplicationStatus.REJECTED) {
        message = "Your application has been REJECTED. Reason: " + rejectionReason;
    } else if (status == ApplicationStatus.APPROVED) {
        message = "Your application has been APPROVED.";
    } else {
        message = "Your application status has been updated to: " + status;
    }

    notificationService.sendNotification(app.getApplicant(), message);

    return updatedApp;
   }

   public List<Application> filterByStatus(String status) {
    return apprep.findByStatus(ApplicationStatus.valueOf(status.toUpperCase()));
  }


}
