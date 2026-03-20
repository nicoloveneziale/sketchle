package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface DrawingRepository extends JpaRepository<Drawing, Long> {
    List<Drawing> findByThemeDateOrderBySubmittedAtDesc(LocalDate date);

    List<Drawing> findByUserOrderBySubmittedAtDesc(User user);
}