"use client";

/**
 * hooks/useTracking.ts
 * Unified tracking hook — engine management + state access
 * Sprint 7 — DriveLink AI
 *
 * Bridges tracking-store, app-store, and the mock-location-engine.
 */

import * as React from "react";
import { useTrackingStore } from "@/store/tracking-store";
import { useAppStore } from "@/store/app-store";
import {
  mockLocationEngine,
  deriveCoordinates,
  generateWaypoints,
} from "@/services/mock-location-engine";
import { useOfflineStore } from "@/store/offline-store";
import { bindConnectionListeners } from "@/services/offline-sync-engine";
import { TrackingSession } from "@/types/tracking";
import { MockDelivery } from "@/mock/deliveries";

const TOTAL_WAYPOINTS = 20;

export function useTracking() {
  const sessions = useTrackingStore((state) => state.sessions);
  const initSession = useTrackingStore((state) => state.initSession);
  const setSessionStatus = useTrackingStore((state) => state.setSessionStatus);
  const completeSession = useTrackingStore((state) => state.completeSession);
  const removeSession = useTrackingStore((state) => state.removeSession);

  const drivers = useAppStore((state) => state.drivers);
  const deliveries = useAppStore((state) => state.deliveries);

  // Initialize offline detectors & load storage logs on client mount
  React.useEffect(() => {
    bindConnectionListeners();
    useOfflineStore.getState().loadFromStorage();
  }, []);

  // ─── Start tracking ─────────────────────────────────────────────────────────

  /**
   * Initialize a tracking session for a delivery and start the GPS engine.
   * Safe to call multiple times — idempotent.
   */
  const startTracking = React.useCallback(
    (delivery: MockDelivery) => {
      // Already tracking
      if (sessions[delivery.id]?.status === "active") return;

      const driver = drivers.find((d) => d.id === delivery.driverId);
      const driverName = delivery.driverName ?? driver?.name ?? "Driver";

      const { pickupLat, pickupLng, dropLat, dropLng } = deriveCoordinates(delivery);
      const waypoints = generateWaypoints(pickupLat, pickupLng, dropLat, dropLng);

      const session: TrackingSession = {
        deliveryId: delivery.id,
        deliveryNumber: delivery.deliveryNumber,
        driverId: delivery.driverId ?? "",
        driverName,

        status: "active",

        currentLat: pickupLat,
        currentLng: pickupLng,

        pickupLat,
        pickupLng,
        dropLat,
        dropLng,

        speed: 0,
        heading: 0,
        eta: "Calculating...",
        etaMinutes: 0,
        remainingDistance: delivery.distance,

        routeHistory: [
          {
            lat: pickupLat,
            lng: pickupLng,
            speed: 0,
            heading: 0,
            timestamp: new Date().toISOString(),
            accuracy: 5,
          },
        ],

        waypointIndex: 0,
        currentMilestone: "moving_to_pickup",

        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        completedAt: null,
      };

      initSession(session);
      mockLocationEngine.startEngine(delivery.id, TOTAL_WAYPOINTS);
    },
    [sessions, drivers, initSession]
  );

  // ─── Stop tracking ───────────────────────────────────────────────────────────

  const stopTracking = React.useCallback(
    (deliveryId: string) => {
      mockLocationEngine.stopEngine(deliveryId);
      completeSession(deliveryId);
    },
    [completeSession]
  );

  // ─── Pause / Resume ──────────────────────────────────────────────────────────

  const pauseTracking = React.useCallback(
    (deliveryId: string) => {
      mockLocationEngine.stopEngine(deliveryId);
      setSessionStatus(deliveryId, "paused");
    },
    [setSessionStatus]
  );

  const resumeTracking = React.useCallback(
    (deliveryId: string) => {
      setSessionStatus(deliveryId, "active");
      mockLocationEngine.startEngine(deliveryId, TOTAL_WAYPOINTS);
    },
    [setSessionStatus]
  );

  // ─── Auto-start for active deliveries ────────────────────────────────────────

  /**
   * Automatically starts tracking for any delivery that is in an active
   * in-progress status but doesn't have a session yet.
   * Call this in page-level useEffect.
   */
  const autoStartForActiveDeliveries = React.useCallback(() => {
    const activeStatuses = ["pickup_started", "in_transit", "near_destination", "accepted", "assigned"] as const;

    deliveries.forEach((delivery) => {
      if (
        activeStatuses.includes(delivery.status as typeof activeStatuses[number]) &&
        !sessions[delivery.id]
      ) {
        startTracking(delivery);
      }
    });
  }, [deliveries, sessions, startTracking]);

  // ─── Selectors ───────────────────────────────────────────────────────────────

  const getSession = React.useCallback(
    (deliveryId: string): TrackingSession | undefined => sessions[deliveryId],
    [sessions]
  );

  const getAllSessions = React.useCallback(
    (): TrackingSession[] => Object.values(sessions),
    [sessions]
  );

  return {
    sessions,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    autoStartForActiveDeliveries,
    getSession,
    getAllSessions,
  };
}
