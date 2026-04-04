package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DrawingRepository extends JpaRepository<Drawing, Long> {
    @Query("SELECT d FROM Drawing d WHERE d.theme.date = :date ORDER BY SIZE(d.likes) DESC LIMIT 10")
    List<Drawing> findTop10ByThemeDate(@Param("date") LocalDate date);

    Page<Drawing> findByThemeDate(LocalDate date, Pageable pageable);

    List<Drawing> findByUserOrderBySubmittedAtDesc(User user);

    Drawing findByUserAndThemeDate(User user, LocalDate date);
}