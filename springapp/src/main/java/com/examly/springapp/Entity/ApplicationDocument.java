package com.examly.springapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;

    private String fileType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data", columnDefinition = "LONGBLOB")
    private byte[] data;


   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "application_id", nullable = false)
   @JsonBackReference
    private Application application;

     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

   
    // Constructors
    public ApplicationDocument() {
    }

    public ApplicationDocument(String fileName, String fileType, byte[] data, Application application) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
        this.application = application;
    }

    
}

    
