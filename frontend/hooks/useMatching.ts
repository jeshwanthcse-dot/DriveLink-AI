"use client";

/**
 * hooks/useMatching.ts
 * Unified hook for AI Matching Engine state and actions
 * Sprint 6 — DriveLink AI
 *
 * Bridges matchingStore + appStore to provide a clean API for components.
 */

import * as React from "react";
import { useAppStore } from "@/store/app-store";
import { useMatchingStore } from "@/store/matching-store";
import { aiMatchingService } from "@/services/ai-matching-service";
import { MatchingSession, MatchResult } from "@/types/matching";
import { MockDelivery } from "@/mock/deliveries";

export function useMatching() {
  const drivers = useAppStore((state) => state.drivers);
  const deliveries = useAppStore((state) => state.deliveries);
  const acceptDelivery = useAppStore((state) => state.acceptDelivery);
  const addNotification = useAppStore((state) => state.addNotification);

  const sessions = useMatchingStore((state) => state.sessions);
  const setSession = useMatchingStore((state) => state.setSession);
  const updateSessionStatus = useMatchingStore((state) => state.updateSessionStatus);
  const assignFromMatch = useMatchingStore((state) => state.assignFromMatch);
  const expireSession = useMatchingStore((state) => state.expireSession);

  // -------------------------------------------------------------------------
  // Start the matching engine for a delivery
  // -------------------------------------------------------------------------

  /**
   * Runs the AI engine for a delivery and stores the session.
   * Uses an animated multi-phase progression:
   *   scanning (instant) → ranking (300ms delay) → notifying (600ms delay)
   */
  const startMatchingForDelivery = React.useCallback(
    (delivery: MockDelivery) => {
      // Phase 1: Scanning
      const scanSession: MatchingSession = {
        deliveryId: delivery.id,
        deliveryNumber: delivery.deliveryNumber,
        status: "scanning",
        rankedResults: [],
        scannedCount: drivers.length,
        eligibleCount: 0,
        assignedDriverId: null,
        assignedDriverName: null,
        startedAt: new Date().toISOString(),
        completedAt: null,
        assignedAt: null,
      };
      setSession(scanSession);

      // Phase 2: Ranking (with delay for visual effect)
      setTimeout(() => {
        updateSessionStatus(delivery.id, "ranking");
      }, 600);

      // Phase 3: Run engine + store results
      setTimeout(() => {
        const completedSession = aiMatchingService.runMatchingEngine(
          delivery,
          drivers
        );
        setSession(completedSession);

        // Notify top 3 drivers
        const topDrivers = completedSession.rankedResults.slice(0, 3);
        topDrivers.forEach((result, index) => {
          addNotification(
            "New Delivery Match",
            `You are rank #${result.rank} match for ${delivery.deliveryNumber} (${delivery.organizationName}). Score: ${result.score}/100. Accept now!`,
            "driver",
            "info"
          );
        });

        // Notify org
        addNotification(
          "AI Matching Complete",
          `${completedSession.eligibleCount} eligible drivers ranked for ${delivery.deliveryNumber}. Top match score: ${completedSession.rankedResults[0]?.score ?? 0}/100.`,
          "org",
          "success"
        );
      }, 1400);
    },
    [drivers, setSession, updateSessionStatus, addNotification]
  );

  // -------------------------------------------------------------------------
  // Driver accepts a matched delivery
  // -------------------------------------------------------------------------

  /**
   * Called when a driver accepts a delivery via the AI match card.
   * Updates both the matching session and the core delivery state.
   */
  const acceptMatchedDelivery = React.useCallback(
    (deliveryId: string, driverId: string, driverName: string) => {
      // Update delivery in app store
      acceptDelivery(deliveryId, driverId, driverName);

      // Update matching session
      assignFromMatch(deliveryId, driverId, driverName);
    },
    [acceptDelivery, assignFromMatch]
  );

  // -------------------------------------------------------------------------
  // Expire a session (mock countdown ended)
  // -------------------------------------------------------------------------

  const expireMatchSession = React.useCallback(
    (deliveryId: string) => {
      expireSession(deliveryId);
      addNotification(
        "Match Session Expired",
        `No driver accepted delivery ${deliveryId} within the window. Re-publishing to available queue.`,
        "org",
        "warning"
      );
    },
    [expireSession, addNotification]
  );

  // -------------------------------------------------------------------------
  // Selectors
  // -------------------------------------------------------------------------

  const getMatchSession = React.useCallback(
    (deliveryId: string): MatchingSession | undefined => sessions[deliveryId],
    [sessions]
  );

  const getTopMatch = React.useCallback(
    (deliveryId: string): MatchResult | null => {
      const session = sessions[deliveryId];
      return session?.rankedResults[0] ?? null;
    },
    [sessions]
  );

  /**
   * Returns the match result for a specific driver within a delivery's session.
   * Used by driver-side cards to show the driver's own rank and score.
   */
  const getDriverMatchResult = React.useCallback(
    (deliveryId: string, driverId: string): MatchResult | null => {
      const session = sessions[deliveryId];
      if (!session) return null;
      return (
        session.rankedResults.find((r) => r.driver.id === driverId) ?? null
      );
    },
    [sessions]
  );

  const getAllSessions = React.useCallback(
    (): MatchingSession[] => Object.values(sessions),
    [sessions]
  );

  const getActiveMatchingCount = React.useCallback((): number => {
    return Object.values(sessions).filter(
      (s) =>
        s.status === "scanning" ||
        s.status === "ranking" ||
        s.status === "notifying"
    ).length;
  }, [sessions]);

  return {
    sessions,
    startMatchingForDelivery,
    acceptMatchedDelivery,
    expireMatchSession,
    getMatchSession,
    getTopMatch,
    getDriverMatchResult,
    getAllSessions,
    getActiveMatchingCount,
  };
}
