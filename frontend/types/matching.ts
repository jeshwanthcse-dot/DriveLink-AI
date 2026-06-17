/**
 * types/matching.ts
 * AI Smart Matching Engine — domain types
 * Sprint 6 — DriveLink AI
 */

import { Driver } from "@/types/driver";
import { MockDelivery } from "@/mock/deliveries";

/** Status of a matching session for a specific delivery */
export type MatchingStatus =
  | "idle"
  | "scanning"
  | "ranking"
  | "notifying"
  | "assigned"
  | "expired"
  | "no_match";

/** Per-factor breakdown used in the AI explanation panel */
export interface AIScoreFactor {
  /** Human-readable label */
  label: string;
  /** Raw display value (e.g., "4.9★", "2.1 km", "8 yrs", "540") */
  displayValue: string;
  /** Contribution to total score (0–40 / 0–30 / 0–20 / 0–10) */
  contribution: number;
  /** Maximum possible contribution for this factor */
  maxContribution: number;
  /** Weight as a percentage string (e.g., "40%") */
  weightLabel: string;
}

/** Human-readable AI explanation for why this driver was recommended */
export interface AIExplanation {
  summary: string;
  factors: AIScoreFactor[];
}

/** A single driver candidate with full match metadata */
export interface MatchResult {
  /** The matched driver */
  driver: Driver;
  /** Composite AI score 0–100 */
  score: number;
  /** Rank position (1 = top match) */
  rank: number;
  /** Simulated distance from driver to pickup in km */
  distanceToPickup: number;
  /** Per-factor breakdown */
  explanation: AIExplanation;
  /** Whether this driver has been notified */
  notified: boolean;
}

/** A full matching session tied to a delivery */
export interface MatchingSession {
  /** The delivery this session is for */
  deliveryId: string;
  /** Delivery number for display */
  deliveryNumber: string;
  /** Current matching phase */
  status: MatchingStatus;
  /** Ranked list of eligible drivers */
  rankedResults: MatchResult[];
  /** Total drivers scanned */
  scannedCount: number;
  /** Number eligible after filtering */
  eligibleCount: number;
  /** ID of the assigned driver, if any */
  assignedDriverId: string | null;
  /** Name of the assigned driver, if any */
  assignedDriverName: string | null;
  /** ISO timestamp when matching started */
  startedAt: string;
  /** ISO timestamp when matching completed */
  completedAt: string | null;
  /** ISO timestamp when assignment was made */
  assignedAt: string | null;
}

/** Summary used in dashboards */
export interface MatchingSummary {
  totalSessions: number;
  assignedSessions: number;
  averageScore: number;
  averageTimeToMatch: number; // seconds
}
