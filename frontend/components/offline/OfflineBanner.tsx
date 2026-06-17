"use client";

/**
 * components/offline/OfflineBanner.tsx
 * Premium animated slide-down warning banner when driver is offline
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { useOfflineStore } from "@/store/offline-store";
import { cn } from "@/lib/cn";

export function OfflineBanner() {
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const queueLength = useOfflineStore((state) => state.offlineQueue.length);

  const showBanner = !isOnline || !isDeviceOn;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "w-full bg-gradient-to-r text-white text-xs font-semibold px-4 py-2.5 flex items-center justify-between shadow-md overflow-hidden",
            !isDeviceOn 
              ? "from-slate-900 via-slate-800 to-slate-950" 
              : "from-amber-600 via-amber-500 to-orange-600"
          )}
        >
          <div className="flex items-center gap-2.5">
            {!isDeviceOn ? (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            ) : (
              <WifiOff className="h-4 w-4 animate-bounce shrink-0" />
            )}
            <p className="leading-tight">
              {!isDeviceOn ? (
                <>
                  <span className="font-bold uppercase mr-1">[DEVICE RESTART SIMULATION]</span> 
                  Phone is switched off. GPS tracking paused. Turn device back on to resume.
                </>
              ) : (
                <>
                  <span className="font-bold uppercase mr-1">[OFFLINE MODE ACTIVE]</span> 
                  Network connection lost. Telemetry is being cached locally ({queueLength} pending actions).
                </>
              )}
            </p>
          </div>
          {isDeviceOn && queueLength > 0 && (
            <div className="flex items-center gap-1.5 bg-white/20 border border-white/20 rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Pending Sync</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
