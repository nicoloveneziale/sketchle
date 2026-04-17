package com.sketchle.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "daily_themes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyTheme {
    @Id
    private LocalDate date; 
    
    private String word;
}
