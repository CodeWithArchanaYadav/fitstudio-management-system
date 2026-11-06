package com.fitstudio.controller;

import com.fitstudio.model.Payment;
import com.fitstudio.repository.Repositories.PaymentRepository;
import com.fitstudio.repository.Repositories.MemberRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;

    public PaymentController(
            PaymentRepository paymentRepository,
            MemberRepository memberRepository) {

        this.paymentRepository = paymentRepository;
        this.memberRepository = memberRepository;
    }

    // Get all payment records
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc();
    }

    // Get payments by member ID
    @GetMapping("/member/{memberId}")
    public List<Payment> getPaymentsByMember(@PathVariable Long memberId) {

        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Member not found");
        }

        return paymentRepository
                .findByMemberIdOrderByPaymentDateDesc(memberId);
    }

    // Record a new payment
    @PostMapping
    public ResponseEntity<Payment> recordPayment(
            @Valid @RequestBody Payment payment) {

        if (!memberRepository.existsById(payment.getMemberId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Member not found");
        }

        payment.setId(null);

        payment.setInvoiceNumber(
                "INV-" + UUID.randomUUID().toString()
                        .substring(0, 8).toUpperCase()
        );

        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("Paid");

        Payment savedPayment = paymentRepository.save(payment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedPayment);
    }
}