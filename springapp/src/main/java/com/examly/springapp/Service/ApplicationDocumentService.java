package com.examly.springapp.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.examly.springapp.DTO.DocumentReponseDTO;
import com.examly.springapp.Entity.Application;
import com.examly.springapp.Entity.ApplicationDocument;
import com.examly.springapp.Repository.ApplicationDocumentRepository;
import com.examly.springapp.Repository.ApplicationRepository;

@Service
public class ApplicationDocumentService {

    @Autowired
    private ApplicationRepository apprep;

    @Autowired
    private ApplicationDocumentRepository docrepo;

    public void saveDocuments(Long applicationId, List<MultipartFile> files) throws IOException {
    Application application = apprep.findById(applicationId)
        .orElseThrow(() -> new RuntimeException("Application not found"));

    List<ApplicationDocument> documentList = new ArrayList<>();

    for (MultipartFile file : files) {
        ApplicationDocument doc = new ApplicationDocument(
            file.getOriginalFilename(),
            file.getContentType(),
            file.getBytes(),
            application
        );
        documentList.add(doc);
    }

    // Update the application's document list
    application.getDocuments().addAll(documentList);

    // Save all documents
    docrepo.saveAll(documentList);

    // Optional: If you're using CascadeType.ALL, this will persist the documents too
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
}
