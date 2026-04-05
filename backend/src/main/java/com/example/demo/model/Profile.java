package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profiles")
@Getter 
@Setter
@NoArgsConstructor 
public class Profile {

    @Id
    @Column(name = "user_id")
    private Long id; 

    @Column(length = 500)
    private String bio;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @ElementCollection
    @CollectionTable(name = "profile_badges", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "badge_name")
    private List<String> badges = new ArrayList<>();

    @OneToOne
    @MapsId 
    @JoinColumn(name = "user_id")
    @JsonIgnore 
    private User user;

    public Profile(User user) {
        this.user = user;
        this.createdAt = LocalDate.now();
    }
}