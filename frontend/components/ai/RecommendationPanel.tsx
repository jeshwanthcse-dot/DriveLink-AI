"use client";

/**
 * components/ai/RecommendationPanel.tsx
 * Organization-side full AI recommendation panel
 * Combines MatchingStatusCard + SuggestedDriversList
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { MatchingSession } from "@/types/matching";
import { MatchingStatusCard } from "@/components/ai/MatchingStatusCard";
import { SuggestedDriversList } from "@/components/ai/SuggestedDriversList";

interface RecommendationPanelProps {
  session: MatchingSession;
  onClose?: () => void;
  className?: string;
}

export function RecommendationPanel({
  session,
  onClose,
  className,
}: RecommendationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("overflow-hidden", className)}
    >
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-50/80 to-blue-50/40 dark:from-slate-900/80 dark:to-blue-950/20 overflow-hidden">
        {/* Panel header */}
        <div className="px-5 py-3.5 border-b border-blue-500/15 flex items-center justify-between bg-blue-500/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                AI Matching Engine
              </p>
              <p className="text-[10px] text-slate-400">
                {session.deliveryNumber} · Smart driver recommendations
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Close recommendation panel"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Two-column layout */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5">
          {/* Left — Status stepper */}
          <MatchingStatusCard
            status={session.status}
            deliveryNumber={session.deliveryNumber}
            eligibleCount={session.eligibleCount}
            assignedDriverName={session.assignedDriverName}
          />

          {/* Right — Ranked drivers list */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Recommended Drivers
            </p>
            <SuggestedDriversList
              results={session.rankedResults}
              status={session.status}
              assignedDriverId={session.assignedDriverId}
              scannedCount={session.scannedCount}
              eligibleCount={session.eligibleCount}
            />
          </div>
        </div>

        {/* Assignment summary footer */}
        {session.status === "assigned" && session.assignedDriverName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-5 py-4 bg-emerald-500/10 border-t border-emerald-400/20"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Assignment Confirmed
                </p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {session.assignedDriverName}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5" suppressHydrationWarning>
                <p>Matching started: {new Date(session.startedAt).toLocaleTimeString()}</p>
                {session.assignedAt && (
                  <p>Assigned at: {new Date(session.assignedAt).toLocaleTimeString()}</p>
                )}
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Delivery Lifecycle Active
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
