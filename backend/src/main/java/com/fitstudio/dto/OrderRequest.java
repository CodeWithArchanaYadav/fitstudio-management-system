package com.fitstudio.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private int amount; // Amount in the smallest currency unit (paisa)
    private String currency; // e.g., "INR"
}