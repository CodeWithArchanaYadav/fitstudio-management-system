package com.fitstudio.service;

import com.fitstudio.dto.OrderRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final String keyId;
    private final String keySecret;

    public PaymentService(
            @Value("${RAZORPAY_KEY_ID}") String keyId,
            @Value("${RAZORPAY_KEY_SECRET}") String keySecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
    }

    // 1. Create Razorpay Order
    public Order createOrder(OrderRequest orderRequest) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        
        JSONObject orderRequestJson = new JSONObject();
        orderRequestJson.put("amount", orderRequest.getAmount()); // amount in paisa
        orderRequestJson.put("currency", orderRequest.getCurrency());
        orderRequestJson.put("receipt", "txn_" + System.currentTimeMillis());

        return razorpay.orders.create(orderRequestJson);
    }

    // 2. Verify Payment Signature
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            
            // Use Razorpay's built-in utility to verify signature securely
            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            return false;
        }
    }
}