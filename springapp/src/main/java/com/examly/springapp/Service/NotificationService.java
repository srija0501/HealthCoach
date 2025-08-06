package com.examly.springapp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.Entity.Notification;
import com.examly.springapp.Entity.Users;
import com.examly.springapp.Repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(Users user, String message) {
        Notification notification = new Notification(message, user);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Users user) {
        return notificationRepository.findByUser(user);
    }
}
