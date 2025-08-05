package com.examly.springapp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.Entity.Users;

public interface UsersRepository extends JpaRepository<Users,Integer>{
    
    
}
