package com.example.demo.service;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public String uploadDrawing(byte[] imageBytes, String username) throws IOException {
        String fileName = username + "_" + UUID.randomUUID() + ".png";
        
        String uploadUrl = supabaseUrl + "/storage/v1/object/drawings/" + fileName;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost uploadRequest = new HttpPost(uploadUrl);
            
            uploadRequest.setHeader("Authorization", "Bearer " + supabaseKey);
            uploadRequest.setHeader("apiKey", supabaseKey);
            uploadRequest.setEntity(MultipartEntityBuilder.create()
                    .addBinaryBody("file", imageBytes, ContentType.IMAGE_PNG, fileName)
                    .build());

            return httpClient.execute(uploadRequest, response -> {
                if (response.getCode() >= 300) {
                    String errorBody = EntityUtils.toString(response.getEntity());
                    System.err.println("--- SUPABASE ERROR ---");
                    System.err.println("Status Code: " + response.getCode());
                    System.err.println("Error: " + errorBody);
                    throw new IOException("Supabase upload failed: " + errorBody);
                }
                
                return supabaseUrl + "/storage/v1/object/public/drawings/" + fileName;
            });
        }
    }
}