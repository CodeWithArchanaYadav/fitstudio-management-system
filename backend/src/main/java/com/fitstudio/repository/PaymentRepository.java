package com.fitstudio.repository;

import com.fitstudio.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find all payments made by a specific gym member
    List<Payment> findByMemberId(Long memberId);

    // Find a payment by its generated invoice number
    Optional<Payment> findByInvoiceNumber(String invoiceNumber);

    // Find a payment by Razorpay Order ID (used during signature verification)
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    // Find a payment by Razorpay Payment ID
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    // Filter payments by status (e.g., "Paid", "Pending", "Failed")
    List<Payment> findByStatus(String status);
}