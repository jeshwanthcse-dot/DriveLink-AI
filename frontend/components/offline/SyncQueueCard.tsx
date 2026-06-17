"use client";

/**
 * components/offline/SyncQueueCard.tsx
 * Driver-side indicator of local storage cached sync queues
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { syncAllQueues } from "@/services/offline-sync-engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Database, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function SyncQueueCard() {
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const queueLength = useOfflineStore((state) => state.offlineQueue.length);
  const gpsCount = useOfflineStore((state) => state.gpsQueue.length);
  const photoCount = useOfflineStore((state) => state.photoQueue.length);
  const notesCount = useOfflineStore((state) => state.notesQueue.length);
  const statusCount = useOfflineStore((state) => state.statusQueue.length);
  const timelineCount = useOfflineStore((state) => state.timelineQueue.length);

  const [syncing, setSyncing] = React.useState(false);

  const handleManualSync = async () => {
    if (queueLength === 0 || syncing || !isOnline || !isDeviceOn) return;
    setSyncing(true);
    try {
      await syncAllQueues();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const isSyncDisabled = queueLength === 0 || !isOnline || !isDeviceOn || syncing;

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Database className="h-4 w-4 text-primary" />
          Offline Cache Queue
        </CardTitle>
        <CardDescription className="text-[11px]">
          Pending uploads stored locally in localstorage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {/* Sync queue counts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "Queued Locations", value: gpsCount, color: "text-blue-500" },
            { label: "Queued Images", value: photoCount, color: "text-emerald-500" },
            { label: "Queued Notes", value: notesCount, color: "text-violet-500" },
            { label: "Queued Events", value: statusCount + timelineCount, color: "text-amber-500" },
          ].map((item) => (
            <div key={item.label} className="p-2.5 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-[10px] text-muted-foreground block font-semibold mb-0.5">{item.label}</span>
              <span className={cn("font-black text-sm", item.color)}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Sync Status Info */}
        <div className="text-[11px] text-muted-foreground bg-muted/40 border border-border/40 p-2.5 rounded-xl leading-relaxed">
          {queueLength === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>All caches clear. Telemetry synchronized.</span>
            </div>
          ) : !isOnline ? (
            <span>Auto-upload will begin once connection is established.</span>
          ) : (
            <span>Internet connection restored. Ready to upload.</span>
          )}
        </div>

        {/* Sync now trigger button */}
        <ReusableButton
          variant="primary"
          className="w-full text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
          onClick={handleManualSync}
          disabled={isSyncDisabled}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          {syncing ? "Synchronizing..." : `Manual Sync (${queueLength} items)`}
        </ReusableButton>
      </CardContent>
    </Card>
  );
}
