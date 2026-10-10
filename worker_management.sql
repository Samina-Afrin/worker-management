-- ShramikHub - Worker Management System
-- MySQL / MariaDB schema (6 tables)

CREATE DATABASE IF NOT EXISTS worker_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE worker_management;

-- 1. users (Admin & Manager login)
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,              -- store hash
  role       ENUM('admin','manager') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. departments
CREATE TABLE departments (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. designations
CREATE TABLE designations (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 4. workers
CREATE TABLE workers (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  phone          VARCHAR(20),
  nid            VARCHAR(30) NOT NULL UNIQUE,
  address        TEXT,
  department_id  INT NOT NULL,
  designation_id INT NOT NULL,
  joining_date   DATE NOT NULL,
  basic_salary   DECIMAL(10,2) NOT NULL,
  status         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_workers_phone (phone),
  INDEX idx_workers_status (status),
  CONSTRAINT fk_workers_department  FOREIGN KEY (department_id)  REFERENCES departments(id),
  CONSTRAINT fk_workers_designation FOREIGN KEY (designation_id) REFERENCES designations(id)
) ENGINE=InnoDB;

-- 5. attendances
CREATE TABLE attendances (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  date      DATE NOT NULL,
  in_time   TIME NULL,
  out_time  TIME NULL,
  status    ENUM('present','absent','late') NOT NULL,
  UNIQUE KEY uq_worker_date (worker_id, date),   -- blocks duplicate attendance
  CONSTRAINT fk_att_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. salaries
CREATE TABLE salaries (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  worker_id            INT NOT NULL,
  month                TINYINT NOT NULL,          -- 1 to 12
  year                 SMALLINT NOT NULL,
  basic_salary         DECIMAL(10,2) NOT NULL,    -- salary of that month
  present_days         INT NOT NULL DEFAULT 0,    -- auto from attendance
  absent_days          INT NOT NULL DEFAULT 0,
  late_days            INT NOT NULL DEFAULT 0,
  attendance_deduction DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonus                DECIMAL(10,2) NOT NULL DEFAULT 0,
  deduction            DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_salary           DECIMAL(10,2) NOT NULL,    -- final amount
  payment_status       ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  UNIQUE KEY uq_worker_month_year (worker_id, month, year),
  CONSTRAINT chk_salary_month CHECK (month BETWEEN 1 AND 12),
  CONSTRAINT fk_sal_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample data
INSERT INTO departments (name) VALUES ('Construction'),('Factory'),('Warehouse'),('Transport');
INSERT INTO designations (name) VALUES ('Helper'),('Mason'),('Operator'),('Supervisor'),('Driver');
INSERT INTO users (name,email,password,role) VALUES ('Admin','admin@shramikhub.com','$2y$10$JhSPpf4frEOp98zeux.DE.Fdk0GVH0hdCTuknPrPCBIxb7OHNiz7C','admin'); -- password: admin123
