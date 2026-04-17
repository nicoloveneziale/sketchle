package com.sketchle.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.DrawingLike;
import com.sketchle.demo.model.User;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<DrawingLike, Long> {
    Optional<DrawingLike> findByUserAndDrawing(User user, Drawing drawing);
    long countByDrawing(Drawing drawing);
    boolean existsByUserAndDrawing(User user, Drawing drawing);
}
