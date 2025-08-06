package com.examly.springapp.DTO;
public class DocumentMetaDTO {
    private Long id;
    private String fileName;
    private String fileType;

    // Constructors
    public DocumentMetaDTO() {}

    public DocumentMetaDTO(Long id, String fileName, String fileType) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
    }

    // Getters and Setters
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
}
