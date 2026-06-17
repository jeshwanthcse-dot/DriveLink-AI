/**
 * services/mock-location-engine.ts
 * GPS Simulation Engine — Sprint 7 DriveLink AI
 *
 * Generates realistic driver movement by interpolating between waypoints
 * derived from pickup/drop coordinates. Runs on setInterval.
 *
 * This service is purely functional — it writes updates to tracking-store
 * and app-store via their static .getState() methods so it works outside React.
 */

import { useTrackingStore } from "@/store/tracking-store";
import { useAppStore } from "@/store/app-store";
import { useOfflineStore } from "@/store/offline-store";
import { TrackingSession, TrackingMilestone } from "@/types/tracking";
import { MockDelivery } from "@/mock/deliveries";
import { Driver } from "@/types/driver";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Tick interval in milliseconds */
const TICK_MS = 3000;

/** km per tick at ~60km/h average */
const BASE_MOVE_KM = 0.05;

/** Registry of running interval IDs, keyed by deliveryId */
const activeIntervals: Record<string, ReturnType<typeof setInterval>> = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Haversine distance between two lat/lng points in km */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Bearing from point A to point B in degrees */
function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const la1 = (lat1 * Math.PI) / 180;
  const la2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Format ETA minutes into a readable string */
function formatEta(minutes: number): string {
  if (minutes <= 0) return "Arriving";
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

/** Add jitter to coordinates for realistic movement */
function addJitter(val: number, scale = 0.00005): number {
  return val + (Math.random() - 0.5) * scale;
}

// ─── Waypoint Generation ──────────────────────────────────────────────────────

/**
 * Generate intermediate waypoints between pickup and drop.
 * Uses Bengaluru-area coordinates derived from the delivery.
 */
export function generateWaypoints(
  pickupLat: number,
  pickupLng: number,
  dropLat: number,
  dropLng: number
): Array<{ lat: number; lng: number }> {
  const totalWaypoints = 20;
  const points: Array<{ lat: number; lng: number }> = [];

  for (let i = 0; i <= totalWaypoints; i++) {
    const t = i / totalWaypoints;
    // Cubic bezier-like curve: add a slight arc for realism
    const midLat = (pickupLat + dropLat) / 2 + 0.015;
    const midLng = (pickupLng + dropLng) / 2 - 0.01;

    const lat =
      (1 - t) * (1 - t) * pickupLat +
      2 * (1 - t) * t * midLat +
      t * t * dropLat;
    const lng =
      (1 - t) * (1 - t) * pickupLng +
      2 * (1 - t) * t * midLng +
      t * t * dropLng;

    points.push({ lat: addJitter(lat, 0.0003), lng: addJitter(lng, 0.0003) });
  }

  return points;
}

/**
 * Generate simulated Bengaluru coordinates for a delivery
 * using the delivery's distance as a proxy for how far apart pickup/drop are.
 */
export function deriveCoordinates(delivery: MockDelivery): {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
} {
  // Base coordinates: Bengaluru city center
  const baseLat = 12.9716;
  const baseLng = 77.5946;

  // Derive a deterministic offset from the delivery ID
  const seed = delivery.id
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const offsetLat = ((seed * 17 + 23) % 100) / 1000 - 0.05;
  const offsetLng = ((seed * 13 + 37) % 100) / 1000 - 0.05;

  const pickupLat = baseLat + offsetLat;
  const pickupLng = baseLng + offsetLng;

  // Drop is ~delivery.distance km away (rough approximation: 0.009 deg/km)
  const kmToDeg = 0.009;
  const distLat = (delivery.distance * kmToDeg * 0.7);
  const distLng = (delivery.distance * kmToDeg * 0.5);

  return {
    pickupLat,
    pickupLng,
    dropLat: pickupLat + distLat,
    dropLng: pickupLng + distLng,
  };
}

// ─── Milestone Resolution ─────────────────────────────────────────────────────

/** Determine the current milestone based on waypoint progress */
function getMilestoneFromProgress(
  waypointIndex: number,
  totalWaypoints: number
): TrackingMilestone {
  const pct = waypointIndex / totalWaypoints;
  if (pct < 0.05) return "moving_to_pickup";
  if (pct < 0.15) return "at_pickup";
  if (pct < 0.85) return "in_transit";
  if (pct < 0.95) return "near_destination";
  return "delivered";
}

/** Map milestone to delivery status for app-store */
function milestoneToDeliveryStatus(
  milestone: TrackingMilestone
): "pickup_started" | "in_transit" | "near_destination" | "delivered" | null {
  switch (milestone) {
    case "moving_to_pickup":
    case "at_pickup":
      return "pickup_started";
    case "in_transit":
      return "in_transit";
    case "near_destination":
      return "near_destination";
    case "delivered":
      return "delivered";
    default:
      return null;
  }
}

// ─── Engine Core ──────────────────────────────────────────────────────────────

/**
 * Start the mock GPS simulation engine for a delivery.
 * Updates tracking-store on every tick.
 * Automatically advances delivery status at milestones.
 */
export function startEngine(deliveryId: string, totalWaypoints: number): void {
  // Prevent duplicate engines
  if (activeIntervals[deliveryId]) return;

  let previousMilestone: TrackingMilestone | null = null;

  const interval = setInterval(() => {
    const trackingStore = useTrackingStore.getState();
    const appStore = useAppStore.getState();
    const offlineStore = useOfflineStore.getState();
    const session = trackingStore.sessions[deliveryId];

    if (!session || session.status !== "active") {
      clearInterval(interval);
      delete activeIntervals[deliveryId];
      return;
    }

    // Freeze engine if phone switches off (restart simulation)
    if (!offlineStore.isDeviceSwitchedOn) return;

    const waypoints = generateWaypoints(
      session.pickupLat,
      session.pickupLng,
      session.dropLat,
      session.dropLng
    );

    const nextIndex = Math.min(session.waypointIndex + 1, waypoints.length - 1);
    const nextPoint = waypoints[nextIndex];
    const currentPoint = waypoints[session.waypointIndex];

    // Calculate heading
    const head = bearing(currentPoint.lat, currentPoint.lng, nextPoint.lat, nextPoint.lng);

    // Calculate remaining distance
    const remaining = haversine(nextPoint.lat, nextPoint.lng, session.dropLat, session.dropLng);

    // Calculate speed (45–75 km/h with slight variance)
    const speed = Math.max(
      10,
      Math.min(80, 55 + (Math.random() - 0.5) * 30)
    );

    // Calculate ETA
    const etaMinutes = remaining > 0 ? (remaining / speed) * 60 : 0;
    const eta = formatEta(etaMinutes);

    const isOnline = offlineStore.isOnline;

    if (!isOnline) {
      // 1. Queue GPS point in offline local storage
      offlineStore.queueGps(deliveryId, {
        lat: nextPoint.lat,
        lng: nextPoint.lng,
        speed: Math.round(speed),
        heading: Math.round(head),
        timestamp: new Date().toISOString(),
        accuracy: Math.floor(3 + Math.random() * 8),
        // Custom variables for background sync replay:
        eta,
        etaMinutes,
        remainingDistance: parseFloat(remaining.toFixed(2)),
        waypointIndex: nextIndex
      } as any);

      // 2. Update trackingStore locally (so the driver's screen updates)
      trackingStore.updatePosition(
        deliveryId,
        nextPoint.lat,
        nextPoint.lng,
        Math.round(speed),
        Math.round(head),
        eta,
        etaMinutes,
        parseFloat(remaining.toFixed(2)),
        nextIndex
      );

      // 3. Queue status and milestone adjustments
      const milestone = getMilestoneFromProgress(nextIndex, totalWaypoints);
      if (milestone !== previousMilestone) {
        trackingStore.setMilestone(deliveryId, milestone);
        previousMilestone = milestone;

        const deliveryStatus = milestoneToDeliveryStatus(milestone);
        if (deliveryStatus) {
          offlineStore.queueStatus({
            deliveryId,
            status: deliveryStatus,
            timestamp: new Date().toISOString()
          });
        }
        offlineStore.queueTimeline({
          deliveryId,
          milestone,
          timestamp: new Date().toISOString()
        });

        if (milestone === "delivered") {
          trackingStore.completeSession(deliveryId);
          clearInterval(interval);
          delete activeIntervals[deliveryId];
        }
      }
    } else {
      // Normal online flow
      trackingStore.updatePosition(
        deliveryId,
        nextPoint.lat,
        nextPoint.lng,
        Math.round(speed),
        Math.round(head),
        eta,
        etaMinutes,
        parseFloat(remaining.toFixed(2)),
        nextIndex
      );

      const milestone = getMilestoneFromProgress(nextIndex, totalWaypoints);
      if (milestone !== previousMilestone) {
        trackingStore.setMilestone(deliveryId, milestone);
        previousMilestone = milestone;

        const deliveryStatus = milestoneToDeliveryStatus(milestone);
        if (deliveryStatus) {
          const delivery = appStore.deliveries.find((d) => d.id === deliveryId);
          if (delivery && delivery.status !== deliveryStatus && delivery.status !== "delivered" && delivery.status !== "completed") {
            appStore.updateDeliveryStatus(deliveryId, deliveryStatus);
          }
        }

        if (milestone === "delivered") {
          trackingStore.completeSession(deliveryId);
          clearInterval(interval);
          delete activeIntervals[deliveryId];
        }
      }
    }
  }, TICK_MS);

  activeIntervals[deliveryId] = interval;
}

/** Stop the engine for a delivery */
export function stopEngine(deliveryId: string): void {
  if (activeIntervals[deliveryId]) {
    clearInterval(activeIntervals[deliveryId]);
    delete activeIntervals[deliveryId];
  }
}

/** Check if an engine is running for a delivery */
export function isEngineRunning(deliveryId: string): boolean {
  return !!activeIntervals[deliveryId];
}

/** Stop all active engines (cleanup) */
export function stopAllEngines(): void {
  Object.keys(activeIntervals).forEach(stopEngine);
}

export const mockLocationEngine = {
  startEngine,
  stopEngine,
  stopAllEngines,
  isEngineRunning,
  deriveCoordinates,
  generateWaypoints,
};
