package com.examly.springapp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.Entity.Notification;
import com.examly.springapp.Entity.Users;
import com.examly.springapp.Service.NotificationService;
import com.examly.springapp.Service.UsersService;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UsersService userService;

    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Long userId) {
        Users user = userService.getUserById(userId);
        return notificationService.getNotificationsForUser(user);
    }
}
