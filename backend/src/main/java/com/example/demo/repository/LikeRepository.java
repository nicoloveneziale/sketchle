package com.example.demo.repository;

import com.example.demo.model.DrawingLike;
import com.example.demo.model.User;
import com.example.demo.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<DrawingLike, Long> {
    Optional<DrawingLike> findByUserAndDrawing(User user, Drawing drawing);
    long countByDrawing(Drawing drawing);
    boolean existsByUserAndDrawing(User user, Drawing drawing);
}
