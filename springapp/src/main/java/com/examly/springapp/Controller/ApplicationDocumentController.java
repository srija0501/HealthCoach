package com.examly.springapp.Controller;


import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.examly.springapp.DTO.DocumentReponseDTO;
import com.examly.springapp.Entity.ApplicationDocument;
import com.examly.springapp.Service.ApplicationDocumentService;




@RestController
@RequestMapping("/documents")
public class ApplicationDocumentController {

    @Autowired
    private ApplicationDocumentService documentService;

    @PostMapping("/upload/{applicationId}")
    public ResponseEntity<String> uploadDocuments(@PathVariable Long applicationId,@RequestParam("files") List<MultipartFile> files) {
        try {
            documentService.saveDocuments(applicationId, files);
            return ResponseEntity.ok("Documents uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading documents.");
        }
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<DocumentReponseDTO>> getDocuments(@PathVariable Long applicationId) {
        List<DocumentReponseDTO> list = documentService.getDocumentsByApplicationId(applicationId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/download/{docId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long docId) {
     ApplicationDocument doc = documentService.downloadDocument(docId);

      MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
     if (doc.getFileType() != null && !doc.getFileType().isEmpty()) {
        try {
            mediaType = MediaType.parseMediaType(doc.getFileType());
        } catch (Exception e) {
            // Optional: log warning, fallback to octet-stream
        }
     }

     return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
            .contentType(mediaType)
            .body(doc.getData());
     }

     @DeleteMapping("/delete/{docId}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long docId) {
      boolean deleted = documentService.deleteDocument(docId);
     if (deleted) {
        return ResponseEntity.ok("Document deleted successfully.");
     } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
     }
   }

     // ✅ View document in browser
    @GetMapping("/view/{id}")
    public ResponseEntity<byte[]> viewDocument(@PathVariable Long id) {
        return documentService.getDocument(id)
                .map(doc -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                        .contentType(MediaType.parseMediaType(doc.getFileType()))
                        .body(doc.getData()))
                .orElse(ResponseEntity.notFound().build());
    }


}

