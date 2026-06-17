"use client";

/**
 * components/offline/OfflineMapOverlay.tsx
 * Overlaid banner freezing live map updates on the organization dispatcher screen
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { WifiOff, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface OfflineMapOverlayProps {
  lastUpdated?: string;
  pendingSyncCount?: number;
}

export function OfflineMapOverlay({ lastUpdated, pendingSyncCount = 0 }: OfflineMapOverlayProps) {
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);

  const showOverlay = !isOnline || !isDeviceOn;

  if (!showOverlay) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-20 select-none"
    >
      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-sm w-full bg-white/95 dark:bg-slate-900/95 border border-amber-500/30 rounded-2xl p-5 shadow-elevated text-center flex flex-col items-center gap-3 backdrop-blur-md"
      >
        <div className="p-3 bg-amber-500/10 rounded-full text-amber-600 animate-pulse">
          <WifiOff className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            {!isDeviceOn ? "Device Offline" : "Driver Connection Lost"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {!isDeviceOn 
              ? "The driver's mobile device is switched off or restarted. Signal telemetry is inactive." 
              : "Live coordinate broadcast paused. Local GPS history caching is running on driver device."}
          </p>
        </div>

        {/* Diagnostic Metadata */}
        <div className="w-full mt-1.5 space-y-1.5 text-[11px] bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-border/40 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-amber-600 uppercase">
              {!isDeviceOn ? "DEVICE OFF" : "CACHING LOCALLY"}
            </span>
          </div>
          {lastUpdated && (
            <div className="flex justify-between">
              <span className="text-slate-400">Last Synced:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350" suppressHydrationWarning>
                {new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          )}
          {pendingSyncCount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Pending Sync:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">
                ~{pendingSyncCount} action logs
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
