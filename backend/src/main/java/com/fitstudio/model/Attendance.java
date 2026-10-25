package com.fitstudio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String day;
    private int count;

    public Long getId() { return id; }
    public String getDay() { return day; }
    public int getCount() { return count; }
    public void setId(Long id) { this.id = id; }
    public void setDay(String day) { this.day = day; }
    public void setCount(int count) { this.count = count; }
}
