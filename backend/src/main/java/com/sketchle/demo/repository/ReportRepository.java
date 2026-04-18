package com.sketchle.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sketchle.demo.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
}
