package com.examly.springapp.Repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.examly.springapp.Entity.Application;
import com.examly.springapp.Entity.Application.ApplicationStatus;
import com.examly.springapp.Entity.Users;
@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long>{
    boolean existsByApplicantId(Long applicantId);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByApplicantId(Long applicantId);

   // Optional<Application> findByApplicantId(Long applicantId);
    @Query("SELECT a FROM Application a " +
       "WHERE (:name IS NULL OR LOWER(a.applicant.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
       "AND (:email IS NULL OR LOWER(a.applicant.email) LIKE LOWER(CONCAT('%', :email, '%')))")
  List<Application> searchByNameAndEmail(@Param("name") String name,@Param("email") String email);

     // Count applications by status
   Optional<Application> findByApplicant(Users applicant);
 
    
    long countByStatus(Application.ApplicationStatus status);




}
