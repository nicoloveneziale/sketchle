package com.sketchle.demo.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sketchle.demo.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ErrorResponse>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<ErrorResponse> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(fieldError -> new ErrorResponse(
                fieldError.getDefaultMessage(), 
                fieldError.getField(),          
                HttpStatus.BAD_REQUEST.value(),
                System.currentTimeMillis()
            ))
            .toList();

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        System.out.println("DEBUG: Caught unhandled exception: " + ex.getClass().getName());
        
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(),
            "general",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            System.currentTimeMillis()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
