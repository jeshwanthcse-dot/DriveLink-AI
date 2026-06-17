"use client";

/**
 * components/offline/DeviceHealthCard.tsx
 * Diagnostics card showing device metrics and health
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Battery, Signal, Compass, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

export function DeviceHealthCard() {
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const isOnline = useOfflineStore((state) => state.isOnline);
  const health = useOfflineStore((state) => state.health);
  const queueLength = useOfflineStore((state) => state.offlineQueue.length);
  const offlineStartTime = useOfflineStore((state) => state.offlineStartTime);
  const tickBattery = useOfflineStore((state) => state.tickBattery);

  // Tick battery Level on component interval
  React.useEffect(() => {
    const t = setInterval(() => {
      tickBattery();
    }, 12000);
    return () => clearInterval(t);
  }, [tickBattery]);

  // Compute offline duration
  const [offlineDuration, setOfflineDuration] = React.useState("0s");

  React.useEffect(() => {
    if (!offlineStartTime) {
      setOfflineDuration("—");
      return;
    }
    const update = () => {
      const elapsedMs = Date.now() - new Date(offlineStartTime).getTime();
      const s = Math.floor(elapsedMs / 1000) % 60;
      const m = Math.floor(elapsedMs / 60000) % 60;
      setOfflineDuration(m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [offlineStartTime]);

  const signalQuality = (strength: number) => {
    if (!isDeviceOn) return "Power Off";
    if (strength > -70) return "Excellent (Mock)";
    if (strength > -90) return "Fair (Mock)";
    if (strength > -110) return "Poor (Mock)";
    return "Disconnected";
  };

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Activity className="h-4 w-4 text-emerald-500" />
          Device Health Panel
        </CardTitle>
        <CardDescription className="text-[11px]">
          Simulated hardware diagnostics & telemetry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-1 text-xs">
        {/* Battery */}
        <div className="flex items-center justify-between py-2 border-b border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Battery className="h-3.5 w-3.5" />
            <span>Battery Level:</span>
          </div>
          <span className="font-bold text-foreground">
            {isDeviceOn ? `${health.batteryLevel}%` : "—"}
          </span>
        </div>

        {/* GPS Accuracy */}
        <div className="flex items-center justify-between py-2 border-b border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Compass className="h-3.5 w-3.5" />
            <span>GPS Accuracy:</span>
          </div>
          <span className="font-bold text-foreground">
            {isDeviceOn ? `± ${health.accuracy}m` : "Searching GPS..."}
          </span>
        </div>

        {/* Network Signal Strength */}
        <div className="flex items-center justify-between py-2 border-b border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Signal className="h-3.5 w-3.5" />
            <span>Signal Strength:</span>
          </div>
          <span className="font-bold text-foreground">
            {isDeviceOn ? `${health.signalStrength} dBm (${signalQuality(health.signalStrength)})` : "—"}
          </span>
        </div>

        {/* Offline duration */}
        {!isOnline && isDeviceOn && (
          <div className="flex items-center justify-between py-2 border-b border-border/40 text-amber-600 dark:text-amber-400 font-semibold">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Offline Duration:</span>
            </div>
            <span>{offlineDuration}</span>
          </div>
        )}

        {/* Total sync queues */}
        <div className="flex items-center justify-between py-2 last:border-b-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span>Pending Queues:</span>
          </div>
          <span className={cn("font-bold", queueLength > 0 ? "text-amber-500 font-extrabold animate-pulse" : "text-foreground")}>
            {queueLength} items
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
