package com.sketchle.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sketchle.demo.model.DailyTheme;

import java.time.LocalDate;

@Repository
public interface ThemeRepository extends JpaRepository<DailyTheme, LocalDate> {
}