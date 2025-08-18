package com.examly.springapp.DTO;

public class ApplicationStatusResponse {
    
   
    private String status;

    public ApplicationStatusResponse(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }


}
