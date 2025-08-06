package com.examly.springapp.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Repository.UsersRepository;


@Service
public class UsersService {
    @Autowired UsersRepository userrep;

    public Users saveUser(Users us)
    {
        return userrep.save(us);
    }

    public List<Users> getAllUser( )
    {
        return userrep.findAll();
    }

    public Optional<Users> getUserByUsername(String name) {
        return userrep.findByName(name);
    }
    
    public List<Users> getUsersByRole(Role role) {
        return userrep.findByRole(role);
    }

    public Users getUserById(Long id) {
        return userrep.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    


    
    public Users updateUserProfile(Long userId, Users updatedUser) {
    Users existingUser = userrep.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

    existingUser.setName(updatedUser.getName());
    existingUser.setEmail(updatedUser.getEmail());

    return userrep.save(existingUser);
}

    
}
