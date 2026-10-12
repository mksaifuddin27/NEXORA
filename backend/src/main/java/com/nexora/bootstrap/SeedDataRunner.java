package com.nexora.bootstrap;

import com.nexora.entity.*;
import com.nexora.enums.Role;
import com.nexora.enums.SlotStatus;
import com.nexora.enums.VerificationStatus;
import com.nexora.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class SeedDataRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedDataRunner.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProviderRepository providerRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final AvailabilityRepository availabilityRepository;
    private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    public SeedDataRunner(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProviderRepository providerRepository,
            ServiceItemRepository serviceItemRepository,
            AvailabilityRepository availabilityRepository,
            RatingRepository ratingRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.providerRepository = providerRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.availabilityRepository = availabilityRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Seed data bootstrap is disabled.");
            return;
        }

        if (userRepository.count() > 0 && categoryRepository.count() > 0) {
            log.info("Database already contains seed records. Skipping bootstrap.");
            return;
        }

        log.info("Starting NEXORA database bootstrap seeding...");

        // 1. Seed Core Accounts
        User adminUser = new User("Chief Administrator", "admin@nexora.org", passwordEncoder.encode("Admin@123"), Role.ADMIN, "+91 99001 12233");
        User officerUser = new User("Ananya Verma (Officer)", "officer@nexora.org", passwordEncoder.encode("Officer@123"), Role.OFFICER, "+91 91234 56789");
        User citizenUser = new User("Rahul Sharma", "user@nexora.org", passwordEncoder.encode("User@123"), Role.USER, "+91 98765 43210");

        userRepository.saveAll(List.of(adminUser, officerUser, citizenUser));
        log.info("Seeded 3 core user accounts: admin@nexora.org, officer@nexora.org, user@nexora.org");

        // 2. Seed 5 Core Categories
        Category catRestaurants = new Category("Restaurants", "restaurants", "Fine dining, artisanal cafes, family bistros, and authentic regional cuisines.", "Utensils", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80");
        Category catHotels = new Category("Hotels", "hotels", "Luxury stays, business suites, boutique lodges, and comfortable bed & breakfasts.", "Hotel", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
        Category catHealthcare = new Category("Healthcare", "healthcare", "Multi-specialty clinics, dental care, diagnostic labs, and pediatric consultants.", "Stethoscope", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80");
        Category catPharmacies = new Category("Pharmacies", "pharmacies", "24/7 emergency drug stores, registered chemists, wellness items, and prescription refills.", "Pill", "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80");
        Category catSalons = new Category("Salons", "salons", "Unisex styling, therapeutic hair spas, bridal makeover, and gentlemen grooming lounges.", "Scissors", "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80");

        categoryRepository.saveAll(List.of(catRestaurants, catHotels, catHealthcare, catPharmacies, catSalons));
        log.info("Seeded 5 core categories.");

        // 3. Seed Demonstrative Providers across the 5 Categories
        Provider p1 = new Provider();
        p1.setOfficer(officerUser);
        p1.setCategory(catRestaurants);
        p1.setProviderName("The Royal Saffron Fine Dining [Demo]");
        p1.setDescription("Authentic Nawabi and North Indian delicacy crafted with slow-cooked heirloom spices in a serene palace-inspired ambiance.");
        p1.setPhone("+91 40 2345 6789");
        p1.setEmail("contact@royalsaffron.demo");
        p1.setAddress("Plot 42, Jubilee Hills Road No. 36");
        p1.setCity("Hyderabad");
        p1.setLatitude(17.4325);
        p1.setLongitude(78.4072);
        p1.setOpeningHours("12:00 PM - 11:30 PM (Daily)");
        p1.setVerificationStatus(VerificationStatus.VERIFIED);
        p1.setBookingSupported(true);
        p1.setImageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80");
        p1.setPriceRange("$$$");

        Provider p2 = new Provider();
        p2.setOfficer(officerUser);
        p2.setCategory(catRestaurants);
        p2.setProviderName("Urban Bistro & Craft Cafe [Demo]");
        p2.setDescription("Modern continental breakfast, artisanal sourdough bakes, specialty pour-over coffee, and gourmet pasta.");
        p2.setPhone("+91 40 4455 6677");
        p2.setEmail("hello@urbanbistro.demo");
        p2.setAddress("Level 2, Cyber Pearl Plaza, Hitec City");
        p2.setCity("Hyderabad");
        p2.setLatitude(17.4485);
        p2.setLongitude(78.3752);
        p2.setOpeningHours("08:00 AM - 10:30 PM");
        p2.setVerificationStatus(VerificationStatus.VERIFIED);
        p2.setBookingSupported(true);
        p2.setImageUrl("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80");
        p2.setPriceRange("$$");

        Provider p3 = new Provider();
        p3.setOfficer(officerUser);
        p3.setCategory(catHotels);
        p3.setProviderName("Grand Horizon Luxury Suites [Demo]");
        p3.setDescription("5-star executive comfort featuring panoramic skyline suites, infinity rooftop pool, curated spa, and convention facilities.");
        p3.setPhone("+91 40 6677 8899");
        p3.setEmail("reservations@grandhorizon.demo");
        p3.setAddress("Financial District, Nanakramguda, Gachibowli");
        p3.setCity("Hyderabad");
        p3.setLatitude(17.4182);
        p3.setLongitude(78.3489);
        p3.setOpeningHours("24 Hours Front Desk");
        p3.setVerificationStatus(VerificationStatus.VERIFIED);
        p3.setBookingSupported(true);
        p3.setImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80");
        p3.setPriceRange("$$$$");

        Provider p4 = new Provider();
        p4.setOfficer(officerUser);
        p4.setCategory(catHealthcare);
        p4.setProviderName("CareFirst Multi-Speciality Clinic [Demo]");
        p4.setDescription("Comprehensive outpatient care with board-certified physicians, preventive diagnostics, cardiology, and pediatrics.");
        p4.setPhone("+91 40 8899 0011");
        p4.setEmail("care@carefirst.demo");
        p4.setAddress("Main Boulevard, Madhapur, Opp. Inorbit Mall");
        p4.setCity("Hyderabad");
        p4.setLatitude(17.4344);
        p4.setLongitude(78.3866);
        p4.setOpeningHours("08:30 AM - 08:30 PM (Mon-Sat)");
        p4.setVerificationStatus(VerificationStatus.VERIFIED);
        p4.setBookingSupported(true);
        p4.setImageUrl("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80");
        p4.setPriceRange("$$");

        Provider p5 = new Provider();
        p5.setOfficer(officerUser);
        p5.setCategory(catPharmacies);
        p5.setProviderName("MedPlus 24x7 Express Chemist [Demo]");
        p5.setDescription("Reliable 24-hour licensed retail pharmacy stocked with cold-chain insulin, emergency life medicines, and home test kits.");
        p5.setPhone("+91 40 9988 7766");
        p5.setEmail("info@medplus.demo");
        p5.setAddress("Shop 14, Gachibowli Circle, Near DLF Gate 3");
        p5.setCity("Hyderabad");
        p5.setLatitude(17.4402);
        p5.setLongitude(78.3582);
        p5.setOpeningHours("24 Hours Open");
        p5.setVerificationStatus(VerificationStatus.VERIFIED);
        p5.setBookingSupported(true);
        p5.setImageUrl("https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1000&q=80");
        p5.setPriceRange("$");

        Provider p6 = new Provider();
        p6.setOfficer(officerUser);
        p6.setCategory(catSalons);
        p6.setProviderName("Luxe & Co. Premium Unisex Salon [Demo]");
        p6.setDescription("Award-winning styling studio offering bespoke haircuts, Olaplex hair spa treatments, and organic skincare.");
        p6.setPhone("+91 40 4433 2211");
        p6.setEmail("styling@luxesalon.demo");
        p6.setAddress("Suite 301, Road 45, Jubilee Hills");
        p6.setCity("Hyderabad");
        p6.setLatitude(17.4361);
        p6.setLongitude(78.4019);
        p6.setOpeningHours("10:00 AM - 09:00 PM (Daily)");
        p6.setVerificationStatus(VerificationStatus.VERIFIED);
        p6.setBookingSupported(true);
        p6.setImageUrl("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80");
        p6.setPriceRange("$$$");

        Provider p7 = new Provider();
        p7.setOfficer(officerUser);
        p7.setCategory(catHotels);
        p7.setProviderName("The Heritage Boutique Courtyard [Demo - Pending Vetting]");
        p7.setDescription("Colonial-era architecture infused with contemporary comfort. Ready for administrator verification.");
        p7.setPhone("+91 40 2233 4455");
        p7.setEmail("heritage@boutique.demo");
        p7.setAddress("Begumpet Airport Road, Near Prakash Nagar");
        p7.setCity("Hyderabad");
        p7.setLatitude(17.4442);
        p7.setLongitude(78.4719);
        p7.setOpeningHours("24 Hours Front Desk");
        p7.setVerificationStatus(VerificationStatus.PENDING); // Great for testing admin verification!
        p7.setBookingSupported(true);
        p7.setImageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80");
        p7.setPriceRange("$$$");

        providerRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7));
        log.info("Seeded 7 demonstration providers across all categories.");

        // 4. Seed Services
        ServiceItem s1 = new ServiceItem(p1, "Table Reservation (2 Guests)", "Window view table reservation with complimentary welcome beverage.", new BigDecimal("500.00"), 90);
        ServiceItem s2 = new ServiceItem(p1, "Royal Degustation Menu", "5-course curated tasting experience with live culinary plating.", new BigDecimal("2400.00"), 120);
        ServiceItem s3 = new ServiceItem(p3, "Executive Deluxe Suite", "King bed, city skyline view, complimentary luxury breakfast and airport shuttle.", new BigDecimal("7500.00"), 1440);
        ServiceItem s4 = new ServiceItem(p4, "General Physician Consultation", "Thorough health check, vital analysis, and digital prescription issuance.", new BigDecimal("600.00"), 30);
        ServiceItem s5 = new ServiceItem(p5, "Express Prescription Reservation", "Hold order for rapid collection or doorstep delivery verification.", new BigDecimal("50.00"), 15);
        ServiceItem s6 = new ServiceItem(p6, "Signature Haircut & Styling (Unisex)", "Consultation, botanical wash, custom precision cut, and blow-dry finish.", new BigDecimal("1100.00"), 60);

        serviceItemRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6));
        log.info("Seeded demonstration services.");

        // 5. Seed Calendar Availability Slots
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        Availability a1 = new Availability(p1, tomorrow, LocalTime.of(12, 30), LocalTime.of(14, 0), SlotStatus.AVAILABLE, 4);
        Availability a2 = new Availability(p1, tomorrow, LocalTime.of(19, 30), LocalTime.of(21, 0), SlotStatus.AVAILABLE, 4);
        Availability a3 = new Availability(p4, tomorrow, LocalTime.of(10, 0), LocalTime.of(10, 30), SlotStatus.AVAILABLE, 1);
        Availability a4 = new Availability(p4, tomorrow, LocalTime.of(11, 0), LocalTime.of(11, 30), SlotStatus.AVAILABLE, 1);
        Availability a5 = new Availability(p6, tomorrow, LocalTime.of(11, 30), LocalTime.of(12, 30), SlotStatus.AVAILABLE, 2);
        Availability a6 = new Availability(p6, dayAfter, LocalTime.of(15, 0), LocalTime.of(16, 0), SlotStatus.AVAILABLE, 2);

        availabilityRepository.saveAll(List.of(a1, a2, a3, a4, a5, a6));
        log.info("Seeded demonstration availability slots.");

        // 6. Seed Sample Demonstration Reviews
        Rating r1 = new Rating(citizenUser, p1, null, 5, "[Demonstration Review] Outstanding culinary presentation and courteous staff. High quality local service.");
        Rating r2 = new Rating(citizenUser, p4, null, 5, "[Demonstration Review] Quick turnaround time with minimal queue waiting. Highly experienced physicians.");
        Rating r3 = new Rating(citizenUser, p6, null, 5, "[Demonstration Review] Professional stylists and hygienic salon environment. Recommended!");

        ratingRepository.saveAll(List.of(r1, r2, r3));
        log.info("Seeded demonstration reviews.");

        log.info("NEXORA database bootstrap completed successfully!");
    }
}
