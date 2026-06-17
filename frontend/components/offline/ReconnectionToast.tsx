"use client";

/**
 * components/offline/ReconnectionToast.tsx
 * Slide-in warning/success toast alerts for connection status updates
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOfflineStore } from "@/store/offline-store";
import { Wifi, WifiOff, X, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function ReconnectionToast() {
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const syncHistory = useOfflineStore((state) => state.syncHistory);

  const [toast, setToast] = React.useState<{
    show: boolean;
    type: "online" | "offline" | "sync";
    title: string;
    message: string;
  } | null>(null);

  // Monitor status changes to trigger toasts
  const lastOnline = React.useRef(true);
  const lastSyncLength = React.useRef(0);

  React.useEffect(() => {
    // If device is off, hide any toast
    if (!isDeviceOn) {
      setToast(null);
      return;
    }

    if (isOnline !== lastOnline.current) {
      if (isOnline) {
        setToast({
          show: true,
          type: "online",
          title: "Connection Restored",
          message: "Back online. Syncing offline records to dispatch...",
        });
      } else {
        setToast({
          show: true,
          type: "offline",
          title: "Connection Lost",
          message: "Offline mode active. GPS tracking is running locally.",
        });
      }
      lastOnline.current = isOnline;
    }
  }, [isOnline, isDeviceOn]);

  // Track sync history to notify on sync completes
  React.useEffect(() => {
    if (syncHistory.length > lastSyncLength.current) {
      const latest = syncHistory[0];
      if (latest && latest.success) {
        setToast({
          show: true,
          type: "sync",
          title: "Data Synchronized",
          message: `Successfully uploaded ${latest.recordsSynced} cached action records.`,
        });
      }
      lastSyncLength.current = syncHistory.length;
    }
  }, [syncHistory]);

  // Auto-dismiss after 4.5 seconds
  React.useEffect(() => {
    if (toast?.show) {
      const t = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast?.show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 280 }}
        className={cn(
          "fixed bottom-6 right-6 z-[100] w-80 rounded-2xl border bg-white dark:bg-slate-900 shadow-elevated p-4 flex gap-3 border-l-4",
          toast.type === "offline"
            ? "border-l-amber-500 border-amber-500/20"
            : "border-l-emerald-500 border-emerald-500/20"
        )}
      >
        <div
          className={cn(
            "p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center",
            toast.type === "offline" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
          )}
        >
          {toast.type === "offline" ? (
            <WifiOff className="h-5 w-5" />
          ) : toast.type === "online" ? (
            <Wifi className="h-5 w-5" />
          ) : (
            <Check className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
            {toast.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all self-start"
          aria-label="Dismiss toast"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
