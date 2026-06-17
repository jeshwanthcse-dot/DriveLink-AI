"use client";

/**
 * components/offline/OfflineTimeline.tsx
 * Horizontal indicator of offline actions overlaying the main timeline
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { Check, Clock, Radio, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export function OfflineTimeline() {
  const offlineQueue = useOfflineStore((state) => state.offlineQueue);
  const statusQueue = useOfflineStore((state) => state.statusQueue);
  const notesQueue = useOfflineStore((state) => state.notesQueue);

  const statusActions = offlineQueue.filter((x) => x.type === "status" || x.type === "note");

  if (statusActions.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 dark:bg-amber-950/10 p-3.5 space-y-2.5">
      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold">
        <Radio className="h-4.5 w-4.5 animate-pulse" />
        <span>Simulated Offline Timeline Logs ({statusActions.length})</span>
      </div>

      <div className="relative pl-4 border-l border-amber-300/40 space-y-3 text-[11px]">
        {statusActions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline bullet node */}
            <span className="absolute -left-[20.5px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {action.type === "status" ? `Status Changed to: ${action.payload.status}` : "Driver Check-In Note"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
                  {action.type === "status" 
                    ? `Queue Sync scheduled for waypoint progress transition.` 
                    : `"${action.payload.note}"`}
                </p>
              </div>
              <span className="text-[9px] text-amber-600 dark:text-amber-500 font-semibold shrink-0 ml-2" suppressHydrationWarning>
                {new Date(action.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
