/**
 * types/tracking.ts
 * Live Tracking Engine — domain types
 * Sprint 7 — DriveLink AI
 */

/** A single recorded GPS point */
export interface LocationPoint {
  lat: number;
  lng: number;
  speed: number;       // km/h
  heading: number;     // degrees 0–360
  timestamp: string;   // ISO string
  accuracy?: number;   // meters (mock)
}

/** Possible states of a tracking session */
export type TrackingStatus =
  | "idle"
  | "waiting"      // delivery accepted, engine not yet started
  | "active"       // engine running, GPS updating
  | "paused"       // engine paused (offline scenario)
  | "completed";   // delivery done, engine stopped

/** Delivery-level tracking milestones */
export type TrackingMilestone =
  | "waiting"
  | "assigned"
  | "moving_to_pickup"
  | "at_pickup"
  | "in_transit"
  | "near_destination"
  | "delivered"
  | "completed";

/** A full tracking session for one active delivery */
export interface TrackingSession {
  deliveryId: string;
  deliveryNumber: string;
  driverId: string;
  driverName: string;

  /** Engine lifecycle state */
  status: TrackingStatus;

  /** Current GPS position */
  currentLat: number;
  currentLng: number;

  /** Pickup & destination coordinates (simulated from delivery data) */
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;

  /** Live telemetry */
  speed: number;          // km/h
  heading: number;        // degrees
  eta: string;            // "14 min"
  etaMinutes: number;     // numeric for countdowns
  remainingDistance: number; // km

  /** Breadcrumb trail */
  routeHistory: LocationPoint[];

  /** Current interpolation waypoint index */
  waypointIndex: number;

  /** Current delivery milestone */
  currentMilestone: TrackingMilestone;

  /** Timestamps */
  startedAt: string | null;
  lastUpdated: string;
  completedAt: string | null;

  // Sprint 8: Offline telemetry tracking properties
  isOffline?: boolean;
  lastSyncedLat?: number;
  lastSyncedLng?: number;
  lastSyncedTime?: string;
  estimatedReconnectTime?: string | null;
  pendingSyncCount?: number;
}

/** Summary shown in dashboard widgets */
export interface TrackingSummary {
  deliveryId: string;
  deliveryNumber: string;
  driverName: string;
  eta: string;
  remainingDistance: number;
  speed: number;
  currentMilestone: TrackingMilestone;
  lastUpdated: string;
}
