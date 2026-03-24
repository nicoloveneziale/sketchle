package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JoinColumn(name = "theme_date", referencedColumnName = "date")
    private DailyTheme theme;

    @Column(nullable = false)
    private String drawingUrl;

    @OneToMany(mappedBy = "drawing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore 
    private List<DrawingLike> likes;

    @Formula("(SELECT COUNT(*) FROM drawing_likes dl WHERE dl.drawing_id = id)")
    private int likesCount;

   private LocalDateTime submittedAt = LocalDateTime.now();

   public Drawing() {}
}
