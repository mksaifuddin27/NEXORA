# NEXORA — Smart Local Service Discovery System
> **"A Unified Platform for Discovering, Comparing, and Selecting Local Services"**

* **Developer:** Mohammed Khaja Saifuddin
* **Roll No:** 24EG105P27
* **Branch:** CSE – P
* **Tech Stack:** React.js (TypeScript + Vite + Tailwind CSS) • Spring Boot 3 • MySQL 8 • Spring Data JPA • Spring Security & JWT • REST APIs • Leaflet OpenStreetMap

---

## 1. Problem Statement & Proposed Solution

### Problem
Citizens frequently need essential local services across **Restaurants, Hotels, Healthcare, Pharmacies, and Salons**. However, information is scattered across fragmented directories, maps, and social pages. Users encounter outdated menus, unverified addresses, unclear time slot availability, and inaccurate ratings.

### Proposed Solution
**NEXORA** is a full-stack, enterprise-grade local service discovery and appointment scheduling ecosystem that connects citizens with verified service providers in one modern platform.
* **5 Core Domains**: Restaurants, Hotels, Healthcare, Pharmacies, and Salons.
* **Location Intelligence**: Haversine distance calculations relative to device GPS or city presets.
* **Objective Ranking**: Transparent Bayesian weighted scoring ensuring consistently reviewed establishments rank justly over single-review accounts.
* **Side-by-Side Comparison**: Evaluate up to 4 providers across distance, price, hours, and ratings simultaneously.
* **Real-time Slot Booking**: Atomic slot locking preventing overbooking or double-reservations.
* **Role-Based Portals**: Tailored dashboards for **Citizens**, **Service Officers**, and **Platform Administrators**.

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────┐
│              React 18 Single Page Application          │
│      (Vite + TypeScript + Tailwind CSS + Leaflet)      │
└──────────────────────────┬─────────────────────────────┘
                           │ JSON REST (Bearer JWT)
                           ▼
┌────────────────────────────────────────────────────────┐
│           Spring Boot 3.3.5 Application Server          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Security Filter Chain + JWT Authentication Filter │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ REST Controllers (Auth, Provider, Booking, etc.) │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Service Business Layer (Bayesian, Concurrency)   │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Spring Data JPA & Hibernate Repository Layer     │  │
│  └───────────────────────┬──────────────────────────┘  │
└──────────────────────────┼─────────────────────────────┘
                           │ JDBC (HikariCP)
                           ▼
┌────────────────────────────────────────────────────────┐
│              MySQL 8.0 Relational Database             │
│   (users, categories, providers, services, bookings)   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema & Entity Relationships

| Table Name | Primary Key | Key Foreign Keys & Attributes | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `user_id` | `email` (Unique), `password_hash`, `role` (USER, OFFICER, ADMIN), `enabled` | User identity & authentication |
| `categories` | `category_id` | `category_name` (Unique), `slug` (Unique), `icon_name` | The 5 core urban service domains |
| `providers` | `provider_id` | `officer_id` -> `users`, `category_id` -> `categories`, `latitude`, `longitude`, `verification_status` | Local establishment profiles |
| `services` | `service_id` | `provider_id` -> `providers`, `price` (DECIMAL), `duration_mins` | Service catalog offerings & menu |
| `availability` | `availability_id` | `provider_id` -> `providers`, `available_date`, `start_time`, `status` | Provider calendar slots |
| `bookings` | `booking_id` | `user_id` -> `users`, `provider_id` -> `providers`, `service_id` -> `services`, `status` | Reservations & transactions |
| `ratings` | `rating_id` | `user_id` -> `users`, `provider_id` -> `providers`, `booking_id` -> `bookings`, `rating` (1-5) | Genuine verified customer reviews |
| `reports` | `report_id` | `reporting_user_id` -> `users`, `reported_provider_id`, `status` | Administrative issue tracking |

---

## 4. API Endpoints Overview

### Public & Discovery
* `GET /api/health` — Service health check & metadata
* `GET /api/categories` — List all active categories
* `GET /api/providers` — Search providers with filters (`q`, `categoryId`, `mode`, `lat`, `lng`, `maxDistanceKm`, `minRating`, `priceRange`, `sortBy`)
* `GET /api/providers/{id}` — Provider details with rating summary & distance
* `GET /api/providers/{id}/services` — Services & pricing catalog
* `GET /api/providers/{id}/slots` — Active calendar availability slots
* `GET /api/ratings/provider/{providerId}` — Public customer reviews

### Authentication
* `POST /api/auth/register` — Register citizen user or officer (BCrypt hashing, blocks admin registration)
* `POST /api/auth/login` — Authenticate and receive signed 24h JWT token
* `GET /api/auth/me` — Retrieve authenticated user profile

### Citizen Operations (Authenticated)
* `POST /api/bookings` — Reserve appointment slot with atomic concurrency verification
* `GET /api/bookings/my` — View user's upcoming, completed, and cancelled bookings
* `PUT /api/bookings/{id}/cancel` — Cancel active reservation
* `POST /api/ratings` — Submit 1-5 star review (enforces 1 review per booking)
* `POST /api/reports` — Report provider or inaccurate info

### Officer Operations (Role: OFFICER / ADMIN)
* `GET /api/officer/provider` — Retrieve establishment managed by officer
* `PUT /api/officer/provider/{id}` — Update establishment profile details
* `POST /api/officer/provider/{id}/services` — Add offering to service menu
* `PUT /api/officer/services/{id}` — Update price or duration
* `DELETE /api/officer/services/{id}` — Remove offering
* `POST /api/officer/provider/{id}/slots` — Add calendar slot
* `DELETE /api/officer/slots/{id}` — Delete slot
* `GET /api/officer/provider/{id}/bookings` — View incoming customer bookings
* `PUT /api/officer/bookings/{id}/status` — Confirm, Complete, or Reject booking

### Administrator Operations (Role: ADMIN)
* `GET /api/admin/stats` — Platform KPIs (Users, Providers, Bookings, Vetting, Reviews)
* `GET /api/admin/users` — List platform users
* `PUT /api/admin/users/{id}/status` — Enable / disable account
* `GET /api/admin/providers` — List all providers
* `PUT /api/admin/providers/{id}/verification` — Approve or reject provider verification
* `POST /api/admin/categories` — Register new category
* `DELETE /api/admin/ratings/{id}` — Moderate inappropriate reviews
* `GET /api/admin/reports` — Inspect citizen reports

---

## 5. Setup & Execution Instructions (Windows)

### Prerequisites
* **Java:** JDK 21+ (`java -version`)
* **Maven:** Apache Maven 3.9+ (`mvn -v`)
* **Node.js:** v18+ or v20+ (`node -v`)
* **MySQL:** MySQL Server 8.0 running on `localhost:3306`

### Step 1: Start MySQL Database
Ensure MySQL service is running. Create the database:
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "CREATE DATABASE IF NOT EXISTS nexora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 2: Start Spring Boot Backend
Open a terminal and execute:
```powershell
cd d:\NEXORA\backend
$env:ComSpec = "C:\WINDOWS\system32\cmd.exe"
mvn test
java -jar target\nexora-backend-1.0.0-SNAPSHOT.jar
```
*Backend runs on:* `http://localhost:8080/api`

### Step 3: Start React Frontend
In a second terminal:
```powershell
cd d:\NEXORA
$env:ComSpec = "C:\WINDOWS\system32\cmd.exe"
npm run dev
```
*Frontend runs on:* `http://localhost:5173/`

---

## 6. Pre-Seeded Demonstration Accounts

For effortless presentation evaluation, the system automatically bootstraps demo accounts on startup:

| Account Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Citizen User** | `user@nexora.org` | `User@123` | Search, compare, book slots, review, cancel |
| **Service Officer** | `officer@nexora.org` | `Officer@123` | Manage establishment profile, services, slots, bookings |
| **Administrator** | `admin@nexora.org` | `Admin@123` | Approve providers, platform statistics, moderation |

*Note: You can also use the 1-click **Role Switcher** in the top navigation bar to test all 3 portals instantly.*

---

## 7. Faculty Presentation Live Demonstration Sequence

1. **Open Landing Page** (`http://localhost:5173/`):
   * Highlight the hero heading, 5 category cards, and responsive dark navy/indigo design.
2. **Explore Services & Discovery Views**:
   * Switch between **All Services**, **Nearby**, and **Best Overall**.
   * Show that distances update relative to device GPS or selected metro city presets.
3. **Compare Providers Side-by-Side**:
   * Click **Compare** on 2-3 providers.
   * Open the compare modal and explain how price tiers, opening hours, and ratings are evaluated simultaneously.
4. **Inspect Provider Profile & Book Slot**:
   * Open *The Royal Saffron* (`/providers/1`).
   * Select a service offering, choose tomorrow's date, pick an open time slot, and confirm.
   * Note the booking reference ID and show it in **My Bookings**.
5. **Demonstrate Officer Management**:
   * Switch role to **Officer** via the navbar.
   * Open the **Officer Portal** (`/officer`), find the customer's booking request, and click **Confirm** or **Mark Completed**.
   * Add a new service offering to show real-time database persistence.
6. **Demonstrate Administrator Vetting**:
   * Switch role to **Admin**.
   * Open the **Admin Console** (`/admin`), view platform metrics, and approve *The Heritage Boutique Courtyard* from **PENDING** to **VERIFIED**.
   * Refresh public discovery to show that only verified providers appear to citizens!
