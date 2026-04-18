package com.sketchle.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthErrorResponse  {
    String msg;
    String path;
    int status;
    long timestamp;
}