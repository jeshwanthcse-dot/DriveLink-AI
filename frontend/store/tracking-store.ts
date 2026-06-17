/**
 * store/tracking-store.ts
 * Zustand store for Live Tracking Engine state
 * Sprint 7 — DriveLink AI
 *
 * Completely separate from app-store and matching-store.
 * Each delivery gets its own TrackingSession keyed by deliveryId.
 */

"use client";

import { create } from "zustand";
import {
  TrackingSession,
  TrackingStatus,
  TrackingMilestone,
  LocationPoint,
} from "@/types/tracking";
import { useOfflineStore } from "@/store/offline-store";

interface TrackingState {
  /** All active tracking sessions, keyed by deliveryId */
  sessions: Record<string, TrackingSession>;

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Initialize a new session for a delivery */
  initSession: (session: TrackingSession) => void;

  /** Update the live GPS position and telemetry for a delivery */
  updatePosition: (
    deliveryId: string,
    lat: number,
    lng: number,
    speed: number,
    heading: number,
    eta: string,
    etaMinutes: number,
    remainingDistance: number,
    waypointIndex: number
  ) => void;

  /** Advance the current milestone */
  setMilestone: (deliveryId: string, milestone: TrackingMilestone) => void;

  /** Update session status */
  setSessionStatus: (deliveryId: string, status: TrackingStatus) => void;

  /** Stop tracking and mark session complete */
  completeSession: (deliveryId: string) => void;

  /** Remove a session entirely */
  removeSession: (deliveryId: string) => void;

  // ─── Selectors ────────────────────────────────────────────────────────────

  getSession: (deliveryId: string) => TrackingSession | undefined;
  getActiveSessions: () => TrackingSession[];
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  sessions: {},

  // ─── Mutations ─────────────────────────────────────────────────────────────

  initSession: (session) =>
    set((state) => ({
      sessions: { ...state.sessions, [session.deliveryId]: session },
    })),

  updatePosition: (
    deliveryId,
    lat,
    lng,
    speed,
    heading,
    eta,
    etaMinutes,
    remainingDistance,
    waypointIndex
  ) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};

      const newPoint: LocationPoint = {
        lat,
        lng,
        speed,
        heading,
        timestamp: new Date().toISOString(),
        accuracy: Math.floor(3 + Math.random() * 8),
      };

      // Query offline store state
      const offlineStore = useOfflineStore.getState();
      const isOnline = offlineStore.isOnline && offlineStore.isDeviceSwitchedOn;

      const lastSyncedLat = isOnline ? lat : (existing.lastSyncedLat ?? lat);
      const lastSyncedLng = isOnline ? lng : (existing.lastSyncedLng ?? lng);
      const lastSyncedTime = isOnline ? new Date().toISOString() : (existing.lastSyncedTime ?? new Date().toISOString());

      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: {
            ...existing,
            currentLat: lat,
            currentLng: lng,
            speed,
            heading,
            eta,
            etaMinutes,
            remainingDistance,
            waypointIndex,
            lastUpdated: new Date().toISOString(),
            routeHistory: [...existing.routeHistory, newPoint],
            // Sprint 8: Offline metadata fields
            isOffline: !isOnline,
            lastSyncedLat,
            lastSyncedLng,
            lastSyncedTime,
            estimatedReconnectTime: offlineStore.estimatedReconnectTime,
            pendingSyncCount: offlineStore.offlineQueue.length,
          },
        },
      };
    }),

  setMilestone: (deliveryId, milestone) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: { ...existing, currentMilestone: milestone },
        },
      };
    }),

  setSessionStatus: (deliveryId, status) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: { ...existing, status },
        },
      };
    }),

  completeSession: (deliveryId) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: {
            ...existing,
            status: "completed",
            currentMilestone: "completed",
            completedAt: new Date().toISOString(),
          },
        },
      };
    }),

  removeSession: (deliveryId) =>
    set((state) => {
      const next = { ...state.sessions };
      delete next[deliveryId];
      return { sessions: next };
    }),

  // ─── Selectors ─────────────────────────────────────────────────────────────

  getSession: (deliveryId) => get().sessions[deliveryId],

  getActiveSessions: () =>
    Object.values(get().sessions).filter((s) => s.status === "active"),
}));
