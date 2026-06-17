/**
 * store/matching-store.ts
 * Dedicated Zustand slice for AI Matching Engine state
 * Sprint 6 — DriveLink AI
 *
 * Keeps matching sessions completely separate from core app-store.
 * Each session is keyed by deliveryId.
 */

"use client";

import { create } from "zustand";
import { MatchingSession, MatchingStatus } from "@/types/matching";

interface MatchingState {
  /** All matching sessions, keyed by deliveryId */
  sessions: Record<string, MatchingSession>;

  /** The deliveryId currently being actively viewed/tracked */
  activeSessionDeliveryId: string | null;

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /** Store a fully-computed session from the matching engine */
  setSession: (session: MatchingSession) => void;

  /** Update the status of an existing session */
  updateSessionStatus: (deliveryId: string, status: MatchingStatus) => void;

  /** Mark a session as assigned once a driver accepts */
  assignFromMatch: (
    deliveryId: string,
    driverId: string,
    driverName: string
  ) => void;

  /** Mark a session as expired (countdown ended without acceptance) */
  expireSession: (deliveryId: string) => void;

  /** Set the active session being displayed */
  setActiveSession: (deliveryId: string | null) => void;

  /** Remove a session from state */
  removeSession: (deliveryId: string) => void;

  // -------------------------------------------------------------------------
  // Selectors
  // -------------------------------------------------------------------------

  /** Get the session for a specific delivery */
  getSession: (deliveryId: string) => MatchingSession | undefined;

  /** Get all sessions as an array */
  getAllSessions: () => MatchingSession[];

  /** Get count of active matching sessions */
  getActiveMatchingCount: () => number;
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  sessions: {},
  activeSessionDeliveryId: null,

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  setSession: (session) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [session.deliveryId]: session,
      },
    })),

  updateSessionStatus: (deliveryId, status) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: {
            ...existing,
            status,
          },
        },
      };
    }),

  assignFromMatch: (deliveryId, driverId, driverName) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: {
            ...existing,
            status: "assigned" as const,
            assignedDriverId: driverId,
            assignedDriverName: driverName,
            assignedAt: new Date().toISOString(),
          },
        },
      };
    }),

  expireSession: (deliveryId) =>
    set((state) => {
      const existing = state.sessions[deliveryId];
      if (!existing) return {};
      return {
        sessions: {
          ...state.sessions,
          [deliveryId]: {
            ...existing,
            status: "expired" as const,
          },
        },
      };
    }),

  setActiveSession: (deliveryId) =>
    set({ activeSessionDeliveryId: deliveryId }),

  removeSession: (deliveryId) =>
    set((state) => {
      const next = { ...state.sessions };
      delete next[deliveryId];
      return { sessions: next };
    }),

  // -------------------------------------------------------------------------
  // Selectors (derived from state — not reactive, call inside components)
  // -------------------------------------------------------------------------

  getSession: (deliveryId) => get().sessions[deliveryId],

  getAllSessions: () => Object.values(get().sessions),

  getActiveMatchingCount: () =>
    Object.values(get().sessions).filter(
      (s) => s.status === "scanning" || s.status === "ranking" || s.status === "notifying"
    ).length,
}));
