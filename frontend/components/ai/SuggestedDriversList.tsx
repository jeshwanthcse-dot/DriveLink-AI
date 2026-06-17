"use client";

/**
 * components/ai/SuggestedDriversList.tsx
 * Staggered animated list of top-ranked driver recommendations
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Users, Cpu, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { MatchResult, MatchingStatus } from "@/types/matching";
import { DriverRankingCard } from "@/components/ai/DriverRankingCard";

interface SuggestedDriversListProps {
  results: MatchResult[];
  status: MatchingStatus;
  assignedDriverId?: string | null;
  scannedCount?: number;
  eligibleCount?: number;
  className?: string;
}

/** Skeleton loading rows during the scanning phase */
function SkeletonRow({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: [0, 0.6, 0], x: 0 }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        delay: index * 0.15,
        ease: "easeInOut",
      }}
      className="h-[72px] rounded-xl bg-slate-100 dark:bg-slate-800/50"
    />
  );
}

/** Scanning pulse animation */
function ScanningIndicator({ scannedCount }: { scannedCount: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center"
        >
          <Cpu className="h-8 w-8 text-blue-500" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="absolute inset-0 rounded-full border-2 border-blue-400/40"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          AI Engine Scanning...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Evaluating {scannedCount} registered drivers
        </p>
      </div>
      <div className="space-y-2 w-full max-w-xs">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export function SuggestedDriversList({
  results,
  status,
  assignedDriverId,
  scannedCount = 0,
  eligibleCount = 0,
  className,
}: SuggestedDriversListProps) {
  const isScanning = status === "scanning" || status === "ranking";
  const isNoMatch = status === "no_match";
  const isAssigned = status === "assigned";

  // Show top 5 results
  const topResults = results.slice(0, 5);

  if (isScanning) {
    return <ScanningIndicator scannedCount={scannedCount} />;
  }

  if (isNoMatch) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="p-3 rounded-full bg-amber-500/10">
          <AlertCircle className="h-7 w-7 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            No Eligible Drivers Found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            No available drivers match the vehicle type and requirements. Try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Meta row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {eligibleCount} eligible · Showing top {Math.min(topResults.length, 5)}
          </span>
        </div>
        {scannedCount > 0 && (
          <span className="text-[10px] text-slate-400">
            from {scannedCount} scanned
          </span>
        )}
      </div>

      {/* Ranked cards — staggered entrance */}
      {topResults.map((result, index) => (
        <DriverRankingCard
          key={result.driver.id}
          result={result}
          animationDelay={index * 0.12}
          isAssigned={isAssigned}
          assignedDriverId={assignedDriverId}
        />
      ))}

      {/* Assignment summary */}
      {isAssigned && assignedDriverId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Top-ranked driver accepted and has been auto-assigned.
          </p>
        </motion.div>
      )}
    </div>
  );
}
