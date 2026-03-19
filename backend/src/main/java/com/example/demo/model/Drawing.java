package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "drawings")
@Getter @Setter
public class Drawing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "theme_id", nullable = false)
    private DailyTheme theme;

    @Column(nullable = false)
    private String drawingUrl;

   private LocalDateTime submittedAt = LocalDateTime.now();

   public Drawing() {}
}
