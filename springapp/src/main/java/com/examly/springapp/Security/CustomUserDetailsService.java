package com.examly.springapp.Security;


import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.examly.springapp.Repository.UsersRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsersRepository repo;

    public CustomUserDetailsService(UsersRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
