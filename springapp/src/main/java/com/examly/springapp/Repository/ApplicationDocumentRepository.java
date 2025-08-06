package com.examly.springapp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.Entity.ApplicationDocument;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument,Long>{
    List<ApplicationDocument>findByApplicationId(Long applicationId);
    
}
