-- FitStudio schema (MySQL 8). Fresh install: run this file once.
-- (Hibernate ddl-auto=update will also create missing tables/columns.)
--
-- UPGRADING an existing DB? Run these first:
--   ALTER TABLE members MODIFY phone VARCHAR(15) NOT NULL;
--   ALTER TABLE members MODIFY plan VARCHAR(50) NULL;
--   DROP TABLE IF EXISTS admin;       -- replaced by users
--   DROP TABLE IF EXISTS attendance;  -- replaced by checkins

CREATE DATABASE IF NOT EXISTS fitstudio;
USE fitstudio;

CREATE TABLE IF NOT EXISTS users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,              -- BCrypt hash
    phone    VARCHAR(15),
    role     VARCHAR(20)  NOT NULL,              -- ADMIN | RECEPTIONIST | TRAINER | MEMBER
    status   VARCHAR(20)  NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS membership_plans (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    duration_days INT          NOT NULL,
    fee           DECIMAL(10,2) NOT NULL,
    features      VARCHAR(1000),
    status        VARCHAR(20)  NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS members (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    phone      VARCHAR(15)  NOT NULL,
    plan       VARCHAR(50),                      -- plan name (kept for the frontend)
    plan_id    BIGINT,
    user_id    BIGINT,
    trainer_id BIGINT,
    join_date  DATE,
    start_date DATE,
    end_date   DATE,                             -- start_date + plan.duration_days
    status     VARCHAR(20)  NOT NULL DEFAULT 'Active',
    FOREIGN KEY (plan_id)    REFERENCES membership_plans(id),
    FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS workout_routines (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    target_muscle VARCHAR(100),
    difficulty    VARCHAR(50),
    exercises     TEXT,
    trainer_id    BIGINT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS member_workouts (   -- routine <-> member assignment
    routine_id BIGINT NOT NULL,
    member_id  BIGINT NOT NULL,
    PRIMARY KEY (routine_id, member_id),
    FOREIGN KEY (routine_id) REFERENCES workout_routines(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id)  REFERENCES members(id)          ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS training_sessions (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id   BIGINT   NOT NULL,
    member_id    BIGINT   NOT NULL,
    session_time DATETIME NOT NULL,
    focus        VARCHAR(255),
    status       VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
    FOREIGN KEY (trainer_id) REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (member_id)  REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkins (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id     BIGINT   NOT NULL,
    check_in_time DATETIME NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Default plans
INSERT INTO membership_plans (name, duration_days, fee, features, status) VALUES
('Basic',    30,  1500.00, 'Gym floor access, Locker', 'Active'),
('Standard', 90,  3000.00, 'Gym floor access, Locker, Group classes', 'Active'),
('Premium',  180, 5000.00, 'All access, Personal trainer, Group classes, Locker', 'Active');

-- First admin  -> login: admin@fitstudio.com / Admin@123   (change the password after first login!)
INSERT INTO users (name, email, password, phone, role, status) VALUES
('Admin', 'admin@fitstudio.com', '$2a$10$tkmn2M.awXeffT1JJ9JhguHCVB7ESd16hCv/xZChtMOXHqFiK8hrC', NULL, 'ADMIN', 'Active');
