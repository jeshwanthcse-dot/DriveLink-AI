"use client";

/**
 * components/offline/ConnectionStatusCard.tsx
 * Network connectivity widget + manual simulation controls
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Wifi, WifiOff, Power, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export function ConnectionStatusCard() {
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const setOnline = useOfflineStore((state) => state.setOnline);
  const setDeviceOn = useOfflineStore((state) => state.setDeviceSwitchedOn);

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Wifi className={cn("h-4 w-4", isOnline ? "text-emerald-500" : "text-slate-400")} />
          Connectivity Simulation
        </CardTitle>
        <CardDescription className="text-[11px]">
          Simulate offline and device state transitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {/* Status indicator pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <span className="font-semibold text-muted-foreground">Network Status:</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                !isDeviceOn 
                  ? "bg-red-500" 
                  : isOnline 
                  ? "bg-emerald-500 animate-pulse" 
                  : "bg-amber-500 animate-pulse"
              )}
            />
            <span
              className={cn(
                !isDeviceOn 
                  ? "text-red-500" 
                  : isOnline 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-amber-600 dark:text-amber-400"
              )}
            >
              {!isDeviceOn ? "DEVICE OFF" : isOnline ? "CONNECTED" : "OFFLINE CACHE"}
            </span>
          </div>
        </div>

        {/* Action controls */}
        <div className="grid grid-cols-2 gap-2">
          {/* Simulate Network Outage */}
          <ReusableButton
            variant={isOnline ? "outline" : "success"}
            className={cn(
              "h-9 text-xs rounded-xl flex items-center justify-center gap-1.5",
              isOnline ? "border-amber-400/30 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-amber-600" : ""
            )}
            onClick={() => setOnline(!isOnline)}
            disabled={!isDeviceOn}
          >
            {isOnline ? (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                Disconnect
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5" />
                Reconnect
              </>
            )}
          </ReusableButton>

          {/* Simulate Device Power Switch */}
          <ReusableButton
            variant={isDeviceOn ? "outline" : "primary"}
            className={cn(
              "h-9 text-xs rounded-xl flex items-center justify-center gap-1.5",
              isDeviceOn ? "border-slate-300 text-slate-700 hover:bg-slate-50" : ""
            )}
            onClick={() => setDeviceOn(!isDeviceOn)}
          >
            <Power className="h-3.5 w-3.5" />
            {isDeviceOn ? "Power Off" : "Power On"}
          </ReusableButton>
        </div>
      </CardContent>
    </Card>
  );
}
