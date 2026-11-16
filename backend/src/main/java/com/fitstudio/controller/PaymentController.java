package com.fitstudio.controller;

import com.fitstudio.dto.OrderRequest;
import com.fitstudio.dto.PaymentVerificationRequest;
import com.fitstudio.service.PaymentService;
import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000") // Adjust port if your React app runs on a different port
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 1. Endpoint to create a Razorpay order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Order order = paymentService.createOrder(orderRequest);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong: " + e.getMessage()));
        }
    }

    // 2. Endpoint to verify payment signature after checkout
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        boolean isVerified = paymentService.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isVerified) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "failure", "message", "Invalid payment signature!"));
        }
    }
}