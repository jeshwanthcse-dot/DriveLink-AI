/**
 * store/offline-store.ts
 * Zustand store for Offline Resilience Engine
 * Sprint 8 — DriveLink AI
 */

"use client";

import { create } from "zustand";
import {
  OfflineAction,
  QueuedPhoto,
  QueuedStatus,
  QueuedTimeline,
  QueuedNote,
  DeviceHealth,
  SyncHistoryEntry,
} from "@/types/offline";
import { LocationPoint } from "@/types/tracking";

interface OfflineState {
  isOnline: boolean;
  isDeviceSwitchedOn: boolean;
  offlineQueue: OfflineAction[];
  
  // Specific queues
  gpsQueue: { deliveryId: string; point: LocationPoint }[];
  photoQueue: QueuedPhoto[];
  statusQueue: QueuedStatus[];
  timelineQueue: QueuedTimeline[];
  notesQueue: QueuedNote[];
  
  // Device & Stats
  health: DeviceHealth;
  syncHistory: SyncHistoryEntry[];
  offlineStartTime: string | null;
  estimatedReconnectTime: string | null;

  // ─── Actions ──────────────────────────────────────────────────────────────
  setOnline: (online: boolean) => void;
  setDeviceSwitchedOn: (on: boolean) => void;
  
  queueGps: (deliveryId: string, point: LocationPoint) => void;
  queuePhoto: (photo: QueuedPhoto) => void;
  queueStatus: (status: QueuedStatus) => void;
  queueTimeline: (timeline: QueuedTimeline) => void;
  queueNote: (note: QueuedNote) => void;
  
  clearQueues: () => void;
  updateHealth: (updates: Partial<DeviceHealth>) => void;
  addSyncHistory: (entry: Omit<SyncHistoryEntry, "id">) => void;
  
  // Telemetry updates
  tickBattery: () => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = "drivelink_offline_resilience";

// Helper to save to localStorage
const saveToLocalStorage = (state: Partial<OfflineState>) => {
  if (typeof window === "undefined") return;
  try {
    const dataToSave = {
      offlineQueue: state.offlineQueue,
      gpsQueue: state.gpsQueue,
      photoQueue: state.photoQueue,
      statusQueue: state.statusQueue,
      timelineQueue: state.timelineQueue,
      notesQueue: state.notesQueue,
      syncHistory: state.syncHistory,
      offlineStartTime: state.offlineStartTime,
      health: state.health,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Failed to save offline state to localStorage", e);
  }
};

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  isDeviceSwitchedOn: true,
  offlineQueue: [],
  gpsQueue: [],
  photoQueue: [],
  statusQueue: [],
  timelineQueue: [],
  notesQueue: [],
  offlineStartTime: null,
  estimatedReconnectTime: null,
  health: {
    gpsStatus: "excellent",
    batteryLevel: 92,
    accuracy: 4, // 4 meters
    signalStrength: -68, // dBm
  },
  syncHistory: [],

  // ─── Mutations ─────────────────────────────────────────────────────────────

  setOnline: (online) => {
    const isCurrentlyOnline = get().isOnline;
    if (isCurrentlyOnline === online) return;

    const offlineStartTime = !online ? new Date().toISOString() : null;
    const estimatedReconnectTime = !online 
      ? new Date(Date.now() + 45000).toISOString() // Simulated reconnect in 45s
      : null;

    set((state) => {
      const updated = {
        ...state,
        isOnline: online,
        offlineStartTime,
        estimatedReconnectTime,
        health: {
          ...state.health,
          signalStrength: online ? -65 : -115, // Poor signal strength when offline
          gpsStatus: online ? ("excellent" as const) : ("poor" as const),
        }
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  setDeviceSwitchedOn: (on) => {
    set((state) => {
      const updated = {
        ...state,
        isDeviceSwitchedOn: on,
        health: {
          ...state.health,
          signalStrength: on ? (state.isOnline ? -65 : -115) : -140, // Offline signal strength
          gpsStatus: on ? (state.isOnline ? ("excellent" as const) : ("poor" as const)) : ("searching" as const),
        }
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  queueGps: (deliveryId, point) => {
    set((state) => {
      const action: OfflineAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "gps",
        payload: { deliveryId, point },
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...state,
        offlineQueue: [...state.offlineQueue, action],
        gpsQueue: [...state.gpsQueue, { deliveryId, point }],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  queuePhoto: (photo) => {
    set((state) => {
      const action: OfflineAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "photo",
        payload: photo,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...state,
        offlineQueue: [...state.offlineQueue, action],
        photoQueue: [...state.photoQueue, photo],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  queueStatus: (status) => {
    set((state) => {
      const action: OfflineAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "status",
        payload: status,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...state,
        offlineQueue: [...state.offlineQueue, action],
        statusQueue: [...state.statusQueue, status],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  queueTimeline: (timeline) => {
    set((state) => {
      const action: OfflineAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "timeline",
        payload: timeline,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...state,
        offlineQueue: [...state.offlineQueue, action],
        timelineQueue: [...state.timelineQueue, timeline],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  queueNote: (note) => {
    set((state) => {
      const action: OfflineAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: "note",
        payload: note,
        timestamp: new Date().toISOString(),
      };
      const updated = {
        ...state,
        offlineQueue: [...state.offlineQueue, action],
        notesQueue: [...state.notesQueue, note],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  clearQueues: () => {
    set((state) => {
      const updated = {
        ...state,
        offlineQueue: [],
        gpsQueue: [],
        photoQueue: [],
        statusQueue: [],
        timelineQueue: [],
        notesQueue: [],
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  updateHealth: (updates) => {
    set((state) => {
      const updated = {
        ...state,
        health: { ...state.health, ...updates },
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  addSyncHistory: (entry) => {
    set((state) => {
      const newEntry: SyncHistoryEntry = {
        ...entry,
        id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      const updated = {
        ...state,
        syncHistory: [newEntry, ...state.syncHistory].slice(0, 20), // Keep last 20 entries
      };
      saveToLocalStorage(updated);
      return updated;
    });
  },

  tickBattery: () => {
    set((state) => {
      if (!state.isDeviceSwitchedOn) return {};
      // Battery drops slowly over time
      const nextBattery = Math.max(5, state.health.batteryLevel - (Math.random() > 0.8 ? 1 : 0));
      return {
        health: {
          ...state.health,
          batteryLevel: nextBattery,
        },
      };
    });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        set({
          offlineQueue: parsed.offlineQueue || [],
          gpsQueue: parsed.gpsQueue || [],
          photoQueue: parsed.photoQueue || [],
          statusQueue: parsed.statusQueue || [],
          timelineQueue: parsed.timelineQueue || [],
          notesQueue: parsed.notesQueue || [],
          syncHistory: parsed.syncHistory || [],
          offlineStartTime: parsed.offlineStartTime || null,
          health: parsed.health || {
            gpsStatus: "excellent",
            batteryLevel: 92,
            accuracy: 4,
            signalStrength: -68,
          },
        });
      }
    } catch (e) {
      console.error("Failed to load offline state from localStorage", e);
    }
  },
}));
