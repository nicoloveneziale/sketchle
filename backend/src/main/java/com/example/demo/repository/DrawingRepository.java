package com.example.demo.repository;

import com.example.demo.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DrawingRepository extends JpaRepository<Drawing, Long> {
    List<Drawing> findByThemeDate(java.time.LocalDate date);
}