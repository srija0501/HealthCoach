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
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Repository.UsersRepository;
import com.examly.springapp.Repository.ApplicationRepository;
import com.examly.springapp.Security.JwtUtil;

@Service
public class UsersService {

    @Autowired
    private UsersRepository userrep;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private EntityManager entityManager;

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

    @Transactional
    public void deleteUserById(Long userId) {
        if (!userrep.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        // Delete in correct order using native SQL
        // 1. Delete documents first
        Query deleteDocsQuery = entityManager.createNativeQuery(
            "DELETE FROM application_document WHERE application_id IN (SELECT id FROM applications WHERE applicant_id = ?)");
        deleteDocsQuery.setParameter(1, userId);
        deleteDocsQuery.executeUpdate();
        
        // 2. Delete applications
        Query deleteAppsQuery = entityManager.createNativeQuery("DELETE FROM applications WHERE applicant_id = ?");
        deleteAppsQuery.setParameter(1, userId);
        deleteAppsQuery.executeUpdate();
        
        // 3. Delete notifications
        Query deleteNotificationsQuery = entityManager.createNativeQuery("DELETE FROM notification WHERE user_id = ?");
        deleteNotificationsQuery.setParameter(1, userId);
        deleteNotificationsQuery.executeUpdate();
        
        // 4. Delete user
        Query deleteUserQuery = entityManager.createNativeQuery("DELETE FROM users WHERE id = ?");
        deleteUserQuery.setParameter(1, userId);
        deleteUserQuery.executeUpdate();
    }
}
