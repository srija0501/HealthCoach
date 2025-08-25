package com.examly.springapp.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
     
    
    
   
     // get datas 
    @GetMapping("/dashboard/{userId}")
    public List<ApplicationResponseDTO> getDashboardData(@PathVariable Long userId) {
       return appser.getDashboardApplications(userId);
    }

    //get application status byt id
    @GetMapping("/{userId}/application-status")
public ResponseEntity<String> getApplicationStatus(@PathVariable Long userId) {
    String status = appser.getApplicationStatus(userId);
    
    return ResponseEntity.ok(status);
}



  
    // submit the application form
   
   @PostMapping("/submit/{userId}")
@PreAuthorize("hasRole('APPLICANT')")
public Application submitApplication(@PathVariable Long userId, @RequestBody Application application) {
    System.out.println("✅ Received application: " + application);
    return appser.submitApplication(userId, application);
}

   
   
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

    //Reviewer should be able to fetch all pending applications for review
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


   // update status
    @PutMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId, @RequestBody StatusUpdateDTO statusDTO) {
       return appser.updateApplicationStatus(applicationId,statusDTO.getStatus(),statusDTO.getRejectionReason()
    );
    }

   

     // list the application detail based on the status
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

   @GetMapping("/status-counts")
public ResponseEntity<?> getStatusCounts() {
    long pending = appser.countByStatus(Application.ApplicationStatus.PENDING);
    long approved = appser.countByStatus(Application.ApplicationStatus.APPROVED);
    long rejected = appser.countByStatus(Application.ApplicationStatus.REJECTED);

    return ResponseEntity.ok(new java.util.HashMap<String, Long>() {{
        put("pending", pending);
        put("approved", approved);
        put("rejected", rejected);
    }});
}


     @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @RequestBody Application updatedApp) {

        Application saved = appser.updateApplication(id, updatedApp);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }


   
}
   
   


