CREATE DATABASE IF NOT EXISTS fitstudio;
USE fitstudio;

CREATE TABLE admin (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE members (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    name   VARCHAR(255) NOT NULL,
    email  VARCHAR(255) NOT NULL,
    phone  VARCHAR(10)  NOT NULL,
    plan   VARCHAR(50)  NOT NULL,
    status VARCHAR(20)  NOT NULL
);

CREATE TABLE attendance (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    day   VARCHAR(10) NOT NULL,
    count INT         NOT NULL DEFAULT 0
);

INSERT INTO attendance (day, count) VALUES
('Mon', 0), ('Tue', 0), ('Wed', 0), ('Thu', 0),
('Fri', 0), ('Sat', 0), ('Sun', 0);
