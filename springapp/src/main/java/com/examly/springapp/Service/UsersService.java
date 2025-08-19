package com.examly.springapp.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Repository.UsersRepository;

@Service
public class UsersService {
    @Autowired
    UsersRepository userrep;

    public Users saveUser(Users us) {
        if (us.getName() == null || us.getEmail() == null || us.getPassword() == null) {
            throw new IllegalArgumentException("Missing required fields");
        }
        
        return userrep.save(us);
    }

    public boolean emailExists(String email) {
        return userrep.findByEmail(email).isPresent();
    }

    public Page<Users> getAllUser(org.springframework.data.domain.Pageable pageable) {
    return userrep.findAll(pageable);
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

  

public ResponseEntity<?> login(Users user) {
    Optional<Users> existingUserOpt = userrep.findByEmail(user.getEmail());
    if (existingUserOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    Users existingUser = existingUserOpt.get();
    if (!user.getPassword().equals(existingUser.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
    }

    Map<String, Object> response = new HashMap<>();
    response.put("id", existingUser.getId());
    response.put("role", existingUser.getRole().toString());
    response.put("username", existingUser.getName());
    return ResponseEntity.ok(response);
}

    public Users updateUserProfile(Long userId, Users updatedUser) {
        Users existingUser = userrep.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        return userrep.save(existingUser);
    }

}
