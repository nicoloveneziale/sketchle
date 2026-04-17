package com.sketchle.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling 
public class SketchleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SketchleApplication.class, args);
    }
}