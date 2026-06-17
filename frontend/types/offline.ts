/**
 * types/offline.ts
 * Offline Resilience Engine — domain types
 * Sprint 8 — DriveLink AI
 */

import { LocationPoint, TrackingMilestone } from "./tracking";

export interface QueuedPhoto {
  deliveryId: string;
  photoUrl: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface QueuedStatus {
  deliveryId: string;
  status: "pickup_started" | "in_transit" | "near_destination" | "delivered";
  timestamp: string;
}

export interface QueuedTimeline {
  deliveryId: string;
  milestone: TrackingMilestone;
  timestamp: string;
}

export interface QueuedNote {
  deliveryId: string;
  note: string;
  timestamp: string;
}

export interface OfflineAction {
  id: string;
  type: "gps" | "photo" | "status" | "timeline" | "note";
  payload: any;
  timestamp: string;
}

export interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  success: boolean;
  recordsSynced: number;
  retryCount: number;
  error?: string;
}

export interface DeviceHealth {
  gpsStatus: "excellent" | "poor" | "searching";
  batteryLevel: number; // Percentage
  accuracy: number;     // meters
  signalStrength: number; // dBm
}
