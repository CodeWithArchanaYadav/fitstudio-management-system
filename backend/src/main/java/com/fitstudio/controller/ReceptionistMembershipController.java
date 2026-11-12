package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.model.MembershipPlan;
import com.fitstudio.model.MembershipSubscription;
import com.fitstudio.model.Payment;

import com.fitstudio.repository.Repositories.MemberRepository;
import com.fitstudio.repository.Repositories.MembershipPlanRepository;
import com.fitstudio.repository.Repositories.MembershipSubscriptionRepository;
import com.fitstudio.repository.Repositories.PaymentRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/receptionist/memberships")
@Validated
@PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
public class ReceptionistMembershipController {

    private final MemberRepository members;
    private final MembershipPlanRepository plans;
    private final MembershipSubscriptionRepository subscriptions;
    private final PaymentRepository payments;

    public ReceptionistMembershipController(
            MemberRepository members,
            MembershipPlanRepository plans,
            MembershipSubscriptionRepository subscriptions,
            PaymentRepository payments) {

        this.members = members;
        this.plans = plans;
        this.subscriptions = subscriptions;
        this.payments = payments;
    }

    // 1. Get all subscriptions
    @GetMapping
    public List<MembershipSubscription> getAllSubscriptions() {

        return subscriptions.findAllByOrderByStartDateDesc();
    }

    // 2. Get subscription history of a member
    @GetMapping("/member/{memberId}")
    public List<MembershipSubscription> getMemberHistory(
            @PathVariable Long memberId) {

        if (!members.existsById(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Member not found");
        }

        return subscriptions.findByMemberIdOrderByStartDateDesc(memberId);
    }

    // 3. Enroll a new member in a plan
    @PostMapping("/enroll/{memberId}/{planId}")
    @Transactional
    public ResponseEntity<MembershipSubscription> enrollMember(
            @PathVariable Long memberId,
            @PathVariable Long planId,
            @Valid @RequestBody MembershipRequest request) {

        Member member = findMember(memberId);
        MembershipPlan plan = findActivePlan(planId);

        if (member.getEndDate() != null
                && !member.getEndDate().isBefore(LocalDate.now())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Member already has an active membership. Use renewal instead.");
        }

        LocalDate startDate = LocalDate.now();

        MembershipSubscription subscription =
                createSubscription(member, plan, request, startDate);

        members.save(member);

        return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
    }

    // 4. Renew an existing membership
    @PostMapping("/renew/{memberId}/{planId}")
    @Transactional
    public ResponseEntity<MembershipSubscription> renewMembership(
            @PathVariable Long memberId,
            @PathVariable Long planId,
            @Valid @RequestBody MembershipRequest request) {

        Member member = findMember(memberId);
        MembershipPlan plan = findActivePlan(planId);

        LocalDate startDate = LocalDate.now();

        // Continue after the existing expiry date if membership is still active
        if (member.getEndDate() != null
                && !member.getEndDate().isBefore(startDate)) {

            startDate = member.getEndDate().plusDays(1);
        }

        MembershipSubscription subscription =
                createSubscription(member, plan, request, startDate);

        members.save(member);

        return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
    }

    // 5. Common subscription and payment creation
    private MembershipSubscription createSubscription(
            Member member,
            MembershipPlan plan,
            MembershipRequest request,
            LocalDate startDate) {

        LocalDate expiryDate =
                startDate.plusDays(plan.getDurationDays());

        // Create payment
        Payment payment = new Payment();

        payment.setMemberId(member.getId());
        payment.setAmount(plan.getFee());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNotes(request.getNotes());
        payment.setInvoiceNumber(
                "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus("Paid");

        Payment savedPayment = payments.save(payment);

        // Create subscription history
        MembershipSubscription subscription =
                new MembershipSubscription();

        subscription.setMemberId(member.getId());
        subscription.setPlanId(plan.getId());
        subscription.setPlanName(plan.getName());
        subscription.setFee(plan.getFee());
        subscription.setStartDate(startDate);
        subscription.setExpiryDate(expiryDate);
        subscription.setStatus("Active");
        subscription.setPaymentId(savedPayment.getId());

        MembershipSubscription savedSubscription =
                subscriptions.save(subscription);

        // Update current member membership
        member.setPlanId(plan.getId());
        member.setPlan(plan.getName());
        member.setStartDate(startDate);
        member.setEndDate(expiryDate);
        member.setStatus("Active");

        return savedSubscription;
    }

    // 6. Find member
    private Member findMember(Long memberId) {

        return members.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Member not found"));
    }

    // 7. Find active plan
    private MembershipPlan findActivePlan(Long planId) {

        MembershipPlan plan = plans.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Membership plan not found"));

        if (!"Active".equalsIgnoreCase(plan.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Membership plan is inactive");
        }

        return plan;
    }

    // Request body
    public static class MembershipRequest {

        @NotBlank(message = "Payment method is required")
        @Pattern(
                regexp = "Cash|Card|UPI",
                message = "Payment method must be Cash, Card or UPI"
        )
        private String paymentMethod;

        private String notes;

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}