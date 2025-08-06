package com.examly.springapp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.Entity.Notification;
import com.examly.springapp.Entity.Users;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(Users user);
}
