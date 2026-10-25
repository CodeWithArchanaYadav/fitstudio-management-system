package com.fitstudio.controller;

import com.fitstudio.model.Member;
import com.fitstudio.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    @PostMapping
    public Member create(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable Long id, @RequestBody Member updated) {
        return memberRepository.findById(id).map(m -> {
            m.setName(updated.getName());
            m.setEmail(updated.getEmail());
            m.setPhone(updated.getPhone());
            m.setPlan(updated.getPlan());
            m.setStatus(updated.getStatus());
            return ResponseEntity.ok(memberRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
