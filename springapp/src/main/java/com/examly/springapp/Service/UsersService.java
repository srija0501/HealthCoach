package com.examly.springapp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.Entity.Users;
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
    
}
