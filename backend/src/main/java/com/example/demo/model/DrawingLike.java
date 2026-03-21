package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "drawing_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "drawing_id"})
})
@Data
@NoArgsConstructor
public class DrawingLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "drawing_id", nullable = false)
    private Drawing drawing;

    private LocalDateTime likedAt = LocalDateTime.now();

    public DrawingLike(User user, Drawing drawing) {
        this.user = user;
        this.drawing = drawing;
    }
}