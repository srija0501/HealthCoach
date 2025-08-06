package com.examly.springapp.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Entity.Users.Role;
import com.examly.springapp.Service.UsersService;

@RestController
@RequestMapping("/user")
public class UsersController {
    
    @Autowired UsersService userser;

    //add datas to db
    //FR2.1: Applicant Registration (name, email, password)
    @PostMapping("/add")
    public Users saveuser(@RequestBody Users us)
    {
        return userser.saveUser(us);
    }

    // display all users
    @GetMapping("/get")
    public List<Users> getAll()
    {
        return userser.getAllUser();
    }
    //FR2.2: View  (for all roles)
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
     
  
     //FR2.2: Update Profile (for all roles)
     @PutMapping("/{id}/profile")
    public Users updateUserProfile(@PathVariable Long id, @RequestBody Users updatedUser) {
    return userser.updateUserProfile(id, updatedUser);
}




    
}
