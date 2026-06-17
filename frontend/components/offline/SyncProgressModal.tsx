"use client";

/**
 * components/offline/SyncProgressModal.tsx
 * Staged loader modal showing progress as background sync processes offline queues
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle2, Wifi, Database } from "lucide-react";
import { setSyncProgressCallback } from "@/services/offline-sync-engine";
import { useOfflineStore } from "@/store/offline-store";
import { cn } from "@/lib/cn";

export function SyncProgressModal() {
  const [progress, setProgress] = React.useState<{
    total: number;
    current: number;
    itemType: string;
    status: "idle" | "syncing" | "completed" | "failed";
  }>({
    total: 0,
    current: 0,
    itemType: "",
    status: "idle",
  });

  const queueLength = useOfflineStore((state) => state.offlineQueue.length);

  // Bind callback to sync engine
  React.useEffect(() => {
    setSyncProgressCallback((prog) => {
      setProgress(prog);
    });
    return () => setSyncProgressCallback(null);
  }, []);

  const isOpen = progress.status === "syncing" || (progress.status === "completed" && progress.total > 0);

  // Auto-dismiss after sync complete
  React.useEffect(() => {
    if (progress.status === "completed") {
      const t = setTimeout(() => {
        setProgress({ total: 0, current: 0, itemType: "", status: "idle" });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [progress.status]);

  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="max-w-sm w-full bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 shadow-elevated text-center flex flex-col items-center gap-4"
          >
            {progress.status === "completed" ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
                className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
            ) : (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-14 w-14 rounded-full border-2 border-primary/20 border-t-primary flex items-center justify-center"
                />
                <Database className="h-5 w-5 text-primary absolute" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {progress.status === "completed"
                  ? "Synchronization Complete!"
                  : "Background Sync Active"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {progress.status === "completed"
                  ? `Successfully uploaded ${progress.total} pending action records.`
                  : `Uploading cached local transactions (${progress.current}/${progress.total})`}
              </p>
            </div>

            {/* Sync Progress Bar */}
            {progress.status === "syncing" && (
              <div className="w-full space-y-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  <span>Replaying: {progress.itemType}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
              </div>
            )}

            {progress.status === "completed" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-400/20"
              >
                Auto-Resuming Telemetry
              </motion.span>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
