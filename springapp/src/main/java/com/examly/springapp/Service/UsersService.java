package com.examly.springapp.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Repository.UsersRepository;
import com.examly.springapp.Security.JwtUtil;

@Service
public class UsersService {

    @Autowired
    private UsersRepository userrep;

    // Password encoder bean
    @Autowired
private BCryptPasswordEncoder passwordEncoder;
    // Register user with encrypted password
    public Users saveUser(Users us) {
        if (us.getName() == null || us.getEmail() == null || us.getPassword() == null) {
            throw new IllegalArgumentException("Missing required fields");
        }

        // Encrypt password before saving
        us.setPassword(passwordEncoder.encode(us.getPassword()));
        System.out.println("Adding reviewer: " + us.getEmail());
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

   @Autowired
private JwtUtil jwtUtil;

public ResponseEntity<?> login(Users user) {
    Optional<Users> existingUserOpt = userrep.findByEmail(user.getEmail());
    if (existingUserOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    Users existingUser = existingUserOpt.get();

    if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
    }

    // ✅ Generate JWT
    String token = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getRole().toString());

    // ✅ Response with user info + token
    Map<String, Object> response = new HashMap<>();
    response.put("id", existingUser.getId());
    response.put("role", existingUser.getRole().toString());
    response.put("username", existingUser.getName());
    response.put("token", token);

    return ResponseEntity.ok(response);
}
    public Users updateUserProfile(Long userId, Users updatedUser) {
        Users existingUser = userrep.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        // If password is updated, re-encode
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userrep.save(existingUser);
    }

    public void deleteUserById(Long userId) {
        Optional<Users> userOpt = userrep.findById(userId);
        if (userOpt.isPresent()) {
            userrep.delete(userOpt.get()); // cascades to applications → documents
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }
}
