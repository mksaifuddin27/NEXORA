# NEXORA Backend (Spring Boot + MySQL)

> **Notice:** As per Phase 1 project instructions, this directory is reserved for the upcoming **Java Spring Boot** backend. The frontend currently operates against an isolated, structured API service layer (`src/services/`) that mirrors these endpoints.

## Target Architecture (Phase 2)

* **Language & Framework:** Java 17+ with Spring Boot 3.x
* **Security & Auth:** Spring Security 6 with Stateless JWT Filter
* **ORM & Database:** Spring Data JPA + Hibernate with MySQL 8.x
* **API Architecture:** RESTful APIs returning JSON `ResponseEntity<ApiResponse<T>>`
* **Build Tool:** Maven (`pom.xml`)

## Database Schema (from Specification)

```sql
-- 1. Users Table
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'OFFICER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Providers Table
CREATE TABLE providers (
    provider_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    officer_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (officer_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 4. Services Table
CREATE TABLE services (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE CASCADE
);

-- 5. Availability Table
CREATE TABLE availability (
    availability_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE CASCADE
);

-- 6. Bookings Table
CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 7. Ratings Table
CREATE TABLE ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
);
```

## Planned Package Structure

```
backend/
├── src/main/java/com/nexora/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── CategoryController.java
│   │   ├── ProviderController.java
│   │   ├── BookingController.java
│   │   ├── RatingController.java
│   │   ├── OfficerController.java
│   │   └── AdminController.java
│   ├── dto/
│   ├── entity/
│   │   ├── User.java
│   │   ├── Category.java
│   │   ├── Provider.java
│   │   ├── ServiceItem.java
│   │   ├── AvailabilitySlot.java
│   │   ├── Booking.java
│   │   └── Rating.java
│   ├── repository/
│   ├── service/
│   └── NexoraApplication.java
└── pom.xml
```
