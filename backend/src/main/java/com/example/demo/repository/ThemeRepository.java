package com.example.demo.repository;

import com.example.demo.model.DailyTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface ThemeRepository extends JpaRepository<DailyTheme, LocalDate> {
}