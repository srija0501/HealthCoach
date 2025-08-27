package com.examly.springapp.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Service.UsersService;

@RestController
@RequestMapping("/user")
public class UsersController {
    
    @Autowired UsersService userser;

    //add datas
    @PostMapping("/add")
    public Users saveuser(@RequestBody Users us)
    {
        return userser.saveUser(us);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        return userser.login(user);
    }

    // Add reviewer (Admin only)
@PostMapping("/addReviewer")
public ResponseEntity<?> addReviewer(@RequestBody Users user) {
    // Check if email already exists
    if (userser.emailExists(user.getEmail())) {
        return ResponseEntity.badRequest().body("Email already registered");
    }

    // Force role to REVIEWER
    user.setRole(Role.REVIEWER);

    // Save user
    Users savedReviewer = userser.saveUser(user);

    return ResponseEntity.ok(savedReviewer);
}

    
    @PostMapping("/register")
    public ResponseEntity<?> registerApplicant(@RequestBody Users user) {

        // Check if email already exists
        if (userser.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // Force role to APPLICANT
        user.setRole(Users.Role.APPLICANT);

        // Save the user
        Users savedUser = userser.saveUser(user);

        return ResponseEntity.ok(savedUser);
    }

  @GetMapping("/get")
    public Page<Users> getAllUsers(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userser.getAllUser(pageable);
    }

    // View  (for all roles)
    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
       return userser.getUserById(id);
    }

 
     @GetMapping("/name/{username}")
     public Optional<Users> getUserByUsername(@PathVariable String username) {
       return userser.getUserByUsername(username);
     }
     
     
     //get data by role
     @GetMapping("/role/{role}")
     public List<Users> getUsersByRole(@PathVariable Role role) {
         return userser.getUsersByRole(role);
     }
     
  
     // Update Profile (for all roles)
     @PutMapping("/{id}/profile")
    public Users updateUserProfile(@PathVariable Long id, @RequestBody Users updatedUser) {
    return userser.updateUserProfile(id, updatedUser);
}





    
}
