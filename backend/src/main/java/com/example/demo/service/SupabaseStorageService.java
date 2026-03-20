package com.example.demo.service;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;
import org.apache.hc.core5.http.ContentType;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public String uploadDrawing(String pixelData, String username) throws IOException {
    int size = 65;
    BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
    String[] pixels = pixelData.split(",");
    int k = 0;
    for (int y = 0; y < size; y++) {
        for (int x = 0; x < size; x++) {
            if (k < pixels.length) {
                int val = Integer.parseInt(pixels[k].trim());
                image.setRGB(x, y, (val == 1) ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
                k++;
            }
        }
    }

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ImageIO.write(image, "png", baos);
    byte[] imageBytes = baos.toByteArray();

    String fileName = username + "_" + UUID.randomUUID() + ".png";
    String uploadUrl = supabaseUrl + "/storage/v1/object/drawings/" + fileName;

    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
        HttpPost uploadRequest = new HttpPost(uploadUrl);
        uploadRequest.setHeader("Authorization", "Bearer " + supabaseKey);
        uploadRequest.setHeader("apiKey", supabaseKey);
        
        uploadRequest.setEntity(MultipartEntityBuilder.create()
                .addBinaryBody("file", imageBytes, ContentType.IMAGE_PNG, fileName)
                .build());
        httpClient.execute(uploadRequest, response -> {
            if (response.getCode() >= 300) {
                throw new IOException("Supabase upload failed with code: " + response.getCode());
            }
            return null; 
        });
    }

    return supabaseUrl + "/storage/v1/object/public/drawings/" + fileName;
}
}