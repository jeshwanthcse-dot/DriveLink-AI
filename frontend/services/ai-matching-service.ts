/**
 * services/ai-matching-service.ts
 * AI Smart Matching Engine — pure scoring & ranking service
 * Sprint 6 — DriveLink AI
 *
 * FORMULA:
 *   Rating       40%  →  (rating / 5) × 40
 *   Distance     30%  →  (1 - clamp(distKm / 500, 0, 1)) × 30
 *   Experience   20%  →  clamp(experience / 15, 0, 1) × 20
 *   Deliveries   10%  →  clamp(completedDeliveries / 500, 0, 1) × 10
 *
 * Total: 0–100 (sorted descending)
 */

import { Driver } from "@/types/driver";
import { MockDelivery } from "@/mock/deliveries";
import {
  MatchResult,
  MatchingSession,
  AIExplanation,
  AIScoreFactor,
} from "@/types/matching";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum driver rating to be eligible for matching */
const DEFAULT_MIN_RATING = 4.0;

/** Maximum distance normalization cap in km */
const DISTANCE_CAP_KM = 500;

/** Maximum experience normalization cap in years */
const EXPERIENCE_CAP_YEARS = 15;

/** Maximum completed deliveries normalization cap */
const DELIVERIES_CAP = 500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamps a number between min and max */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a deterministic-ish simulated distance from driver location
 * to pickup, based on driver ID and delivery ID to keep it consistent.
 * Returns a value between 1.5 km and 48 km.
 */
function simulateDistanceToPickup(driver: Driver, delivery: MockDelivery): number {
  // Seed a consistent pseudo-random value from driver + delivery IDs
  const seed =
    driver.id
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) +
    delivery.id
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const raw = ((seed * 9301 + 49297) % 233280) / 233280;
  // Map to 1.5–48 km range
  return parseFloat((1.5 + raw * 46.5).toFixed(1));
}

// ---------------------------------------------------------------------------
// 1. Filter eligible drivers
// ---------------------------------------------------------------------------

/**
 * Returns only drivers who are eligible to receive this delivery.
 * Rules:
 *  - Status must be "available"
 *  - Vehicle type must match delivery vehicle type
 *  - Rating must be ≥ DEFAULT_MIN_RATING
 */
export function filterEligibleDrivers(
  drivers: Driver[],
  delivery: MockDelivery
): Driver[] {
  return drivers.filter((driver) => {
    if (driver.status !== "available") return false;
    if (driver.vehicleType !== delivery.vehicleType) return false;
    if (driver.rating < DEFAULT_MIN_RATING) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// 2. Score a single driver
// ---------------------------------------------------------------------------

/**
 * Calculates the composite AI match score for a driver against a delivery.
 * Returns a value from 0–100.
 */
export function calculateMatchScore(
  driver: Driver,
  distanceToPickup: number
): number {
  const ratingScore = (driver.rating / 5) * 40;
  const distanceScore = (1 - clamp(distanceToPickup / DISTANCE_CAP_KM, 0, 1)) * 30;
  const experienceScore = clamp(driver.experience / EXPERIENCE_CAP_YEARS, 0, 1) * 20;
  const deliveriesScore = clamp(driver.completedDeliveries / DELIVERIES_CAP, 0, 1) * 10;

  const total = ratingScore + distanceScore + experienceScore + deliveriesScore;
  return parseFloat(total.toFixed(1));
}

// ---------------------------------------------------------------------------
// 3. Build AI explanation
// ---------------------------------------------------------------------------

/**
 * Builds a human-readable explanation for why this driver was recommended.
 */
export function buildAIExplanation(
  driver: Driver,
  distanceToPickup: number,
  score: number
): AIExplanation {
  const ratingContrib = parseFloat(((driver.rating / 5) * 40).toFixed(1));
  const distanceContrib = parseFloat(
    ((1 - clamp(distanceToPickup / DISTANCE_CAP_KM, 0, 1)) * 30).toFixed(1)
  );
  const expContrib = parseFloat(
    (clamp(driver.experience / EXPERIENCE_CAP_YEARS, 0, 1) * 20).toFixed(1)
  );
  const delivContrib = parseFloat(
    (clamp(driver.completedDeliveries / DELIVERIES_CAP, 0, 1) * 10).toFixed(1)
  );

  const factors: AIScoreFactor[] = [
    {
      label: "Driver Rating",
      displayValue: `${driver.rating.toFixed(1)}★`,
      contribution: ratingContrib,
      maxContribution: 40,
      weightLabel: "40%",
    },
    {
      label: "Distance to Pickup",
      displayValue: `${distanceToPickup.toFixed(1)} km`,
      contribution: distanceContrib,
      maxContribution: 30,
      weightLabel: "30%",
    },
    {
      label: "Experience",
      displayValue: `${driver.experience} yr${driver.experience !== 1 ? "s" : ""}`,
      contribution: expContrib,
      maxContribution: 20,
      weightLabel: "20%",
    },
    {
      label: "Completed Deliveries",
      displayValue: `${driver.completedDeliveries}`,
      contribution: delivContrib,
      maxContribution: 10,
      weightLabel: "10%",
    },
  ];

  const topFactor = factors.reduce((a, b) =>
    a.contribution > b.contribution ? a : b
  );

  return {
    summary: `Matched because ${driver.name} has exceptional ${topFactor.label.toLowerCase()} (${topFactor.displayValue}) with an AI composite score of ${score}.`,
    factors,
  };
}

// ---------------------------------------------------------------------------
// 4. Rank drivers
// ---------------------------------------------------------------------------

/**
 * Scores and ranks all eligible drivers for a delivery.
 * Returns MatchResult[] sorted descending by score.
 */
export function rankDrivers(
  eligibleDrivers: Driver[],
  delivery: MockDelivery
): MatchResult[] {
  const scored = eligibleDrivers.map((driver) => {
    const distanceToPickup = simulateDistanceToPickup(driver, delivery);
    const score = calculateMatchScore(driver, distanceToPickup);
    const explanation = buildAIExplanation(driver, distanceToPickup, score);

    return {
      driver,
      score,
      rank: 0, // assigned after sort
      distanceToPickup,
      explanation,
      notified: false,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Assign rank
  return scored.map((result, index) => ({
    ...result,
    rank: index + 1,
    notified: index < 3, // top 3 are notified
  }));
}

// ---------------------------------------------------------------------------
// 5. Run the full matching engine
// ---------------------------------------------------------------------------

/**
 * Entry point for the AI Matching Engine.
 * Filters, scores, ranks all drivers for a given delivery.
 * Returns a completed MatchingSession ready to be stored.
 */
export function runMatchingEngine(
  delivery: MockDelivery,
  allDrivers: Driver[]
): MatchingSession {
  const startedAt = new Date().toISOString();
  const eligible = filterEligibleDrivers(allDrivers, delivery);
  const rankedResults = rankDrivers(eligible, delivery);

  return {
    deliveryId: delivery.id,
    deliveryNumber: delivery.deliveryNumber,
    status: rankedResults.length > 0 ? "notifying" : "no_match",
    rankedResults,
    scannedCount: allDrivers.length,
    eligibleCount: eligible.length,
    assignedDriverId: null,
    assignedDriverName: null,
    startedAt,
    completedAt: new Date().toISOString(),
    assignedAt: null,
  };
}

/**
 * Convenience export object for use across the app.
 */
export const aiMatchingService = {
  filterEligibleDrivers,
  calculateMatchScore,
  buildAIExplanation,
  rankDrivers,
  runMatchingEngine,
};
