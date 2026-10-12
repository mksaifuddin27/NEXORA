package com.nexora;

import com.nexora.service.ProviderService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NexoraAlgorithmTests {

    @Test
    void testHaversineDistanceCalculation() {
        // Distance between Jubilee Hills (17.4325, 78.4072) and Hitec City (17.4485, 78.3752)
        double distanceKm = ProviderService.calculateHaversineKm(17.4325, 78.4072, 17.4485, 78.3752);

        // Expected distance is approximately 3.8 km to 4.2 km
        assertTrue(distanceKm > 3.0 && distanceKm < 5.0, "Distance should be ~3.8 - 4.2 km");
        assertEquals(0.0, ProviderService.calculateHaversineKm(17.4, 78.4, 17.4, 78.4), "Distance to self should be 0.0");
    }

    @Test
    void testBayesianScoreRanking() {
        // Provider A: 5.0 rating with only 1 review
        double scoreA = ProviderService.calculateBayesianScore(5.0, 1);

        // Provider B: 4.8 rating with 50 reviews
        double scoreB = ProviderService.calculateBayesianScore(4.8, 50);

        // Under Bayesian ranking with prior mean C = 4.5 and threshold m = 3:
        // Score A = (1/4)*5.0 + (3/4)*4.5 = 1.25 + 3.375 = 4.625
        // Score B = (50/53)*4.8 + (3/53)*4.5 = 4.528 + 0.254 = 4.783
        // So Provider B with 50 reviews justly outranks Provider A with only 1 review!
        assertTrue(scoreB > scoreA, "Consistently reviewed provider B should rank higher than single-review provider A");
    }
}
