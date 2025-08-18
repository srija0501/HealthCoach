package com.examly.springapp.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.examly.springapp.DTO.DocumentReponseDTO;
import com.examly.springapp.Entity.Application;
import com.examly.springapp.Entity.ApplicationDocument;
import com.examly.springapp.Repository.ApplicationDocumentRepository;
import com.examly.springapp.Repository.ApplicationRepository;

@Service
public class ApplicationDocumentService {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    @Autowired
    private ApplicationRepository apprep;

    @Autowired
    private ApplicationDocumentRepository docrepo;

    public void saveDocuments(Long applicationId, List<MultipartFile> files) throws IOException {
        Application application = apprep.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));

        List<ApplicationDocument> documentList = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "File too large (max 2MB): " + file.getOriginalFilename());
            }

            ApplicationDocument doc = new ApplicationDocument(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes(),
                application
            );
            documentList.add(doc);
        }

        application.getDocuments().addAll(documentList);

        docrepo.saveAll(documentList);
        // Optionally save the application again if not using cascade:
        // apprep.save(application);
    }

    public List<DocumentReponseDTO> getDocumentsByApplicationId(Long applicationId) {
        List<ApplicationDocument> documents = docrepo.findByApplicationId(applicationId);
        return documents.stream()
                .map(doc -> new DocumentReponseDTO(doc.getId(), doc.getFileName(), doc.getFileType()))
                .collect(Collectors.toList());
    }

    public ApplicationDocument downloadDocument(Long docId) {
        return docrepo.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

     public Optional<ApplicationDocument> getDocument(Long id) {
        return docrepo.findById(id);
    }




   public boolean deleteDocument(Long docId) {
      if (docrepo.existsById(docId)) {
        docrepo.deleteById(docId);
        return true;
      }
       return false;
    }

}
