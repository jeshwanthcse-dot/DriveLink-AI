/**
 * services/offline-sync-engine.ts
 * Background Sync Engine — Sprint 8 DriveLink AI
 *
 * Listens to connection status changes and processes offline queues sequentially
 * to ensure that deferred GPS points, photos, notes, and milestones are successfully replayed.
 */

import { useOfflineStore } from "@/store/offline-store";
import { useTrackingStore } from "@/store/tracking-store";
import { useAppStore } from "@/store/app-store";

// Global listener flag to avoid double binding
let listenersBound = false;

interface SyncProgress {
  total: number;
  current: number;
  itemType: string;
  status: "idle" | "syncing" | "completed" | "failed";
}

let onProgressCallback: ((progress: SyncProgress) => void) | null = null;

export const setSyncProgressCallback = (callback: ((progress: SyncProgress) => void) | null) => {
  onProgressCallback = callback;
};

/**
 * Replays all offline queues sequentially to local stores.
 * Simulates a delay for each record so progress animations are visible to the user.
 */
export async function syncAllQueues(): Promise<boolean> {
  const offlineStore = useOfflineStore.getState();
  const trackingStore = useTrackingStore.getState();
  const appStore = useAppStore.getState();

  const totalItems = offlineStore.offlineQueue.length;
  if (totalItems === 0) {
    return true;
  }

  offlineStore.addSyncHistory({
    timestamp: new Date().toISOString(),
    success: false,
    recordsSynced: 0,
    retryCount: 1,
  });

  if (onProgressCallback) {
    onProgressCallback({ total: totalItems, current: 0, itemType: "Initializing", status: "syncing" });
  }

  // Run sequential replay
  const actions = [...offlineStore.offlineQueue];
  let successCount = 0;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];

    if (onProgressCallback) {
      onProgressCallback({
        total: totalItems,
        current: i + 1,
        itemType: action.type.toUpperCase(),
        status: "syncing",
      });
    }

    // Simulate 350ms network delay per sync action
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      switch (action.type) {
        case "gps": {
          const { deliveryId, point } = action.payload;
          
          // Access trackingSession from store to get index updates
          const session = trackingStore.sessions[deliveryId];
          if (session) {
            trackingStore.updatePosition(
              deliveryId,
              point.lat,
              point.lng,
              point.speed,
              point.heading,
              point.eta || session.eta,
              point.etaMinutes || session.etaMinutes,
              point.remainingDistance || session.remainingDistance,
              point.waypointIndex || session.waypointIndex
            );
          }
          break;
        }

        case "status": {
          const { deliveryId, status } = action.payload;
          appStore.updateDeliveryStatus(deliveryId, status);
          break;
        }

        case "timeline": {
          const { deliveryId, milestone } = action.payload;
          trackingStore.setMilestone(deliveryId, milestone);
          break;
        }

        case "note": {
          const { deliveryId, note } = action.payload;
          // Trigger mock alert to show note synced
          console.log(`Synced check-in note for delivery ${deliveryId}: "${note}"`);
          break;
        }

        case "photo": {
          const { deliveryId, photoUrl, lat, lng, timestamp } = action.payload;
          // Complete delivery sequence with photo proof in appStore
          appStore.updateDeliveryStatus(deliveryId, "delivered");
          console.log(`Synced delivery photo for ${deliveryId}: ${photoUrl} at (${lat}, ${lng})`);
          break;
        }
      }
      successCount++;
    } catch (err) {
      console.error(`Offline Replay error for action ${action.id}:`, err);
    }
  }

  // Update sync history status
  const success = successCount === totalItems;
  const history = [...offlineStore.syncHistory];
  if (history.length > 0) {
    history[0] = {
      ...history[0],
      success,
      recordsSynced: successCount,
      timestamp: new Date().toISOString(),
    };
    useOfflineStore.setState({ syncHistory: history });
  }

  // Clear queues after successful synchronization
  if (success) {
    offlineStore.clearQueues();
  }

  if (onProgressCallback) {
    onProgressCallback({
      total: totalItems,
      current: successCount,
      itemType: "Done",
      status: success ? "completed" : "failed",
    });
  }

  return success;
}

/**
 * Binds network listeners to toggle store state.
 * Safe to call inside useEffect in parent layout.
 */
export function bindConnectionListeners(): void {
  if (typeof window === "undefined" || listenersBound) return;

  const handleOnline = async () => {
    useOfflineStore.getState().setOnline(true);
    // Sync automatically on reconnect
    await syncAllQueues();
  };

  const handleOffline = () => {
    useOfflineStore.getState().setOnline(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Set initial status
  useOfflineStore.getState().setOnline(navigator.onLine);

  listenersBound = true;
}

export const offlineSyncEngine = {
  syncAllQueues,
  bindConnectionListeners,
  setSyncProgressCallback,
};
