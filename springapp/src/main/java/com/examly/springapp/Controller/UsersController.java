package com.examly.springapp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.Entity.Users;
import com.examly.springapp.Service.UsersService;

@RestController
@RequestMapping("/user")
public class UsersController {
    
    @Autowired UsersService userser;

    @PostMapping("/add")
    public Users saveuser(@RequestBody Users us)
    {
        return userser.saveUser(us);
    }
    @GetMapping("/get")
    public List<Users> getAll()
    {
        return userser.getAllUser();
    }
    
}
