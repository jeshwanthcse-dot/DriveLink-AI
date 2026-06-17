"use client";

/**
 * components/tracking/DistanceCard.tsx
 * Distance remaining with animated progress arc
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

interface DistanceCardProps {
  remainingDistance: number;
  totalDistance: number;
  className?: string;
}

export function DistanceCard({ remainingDistance, totalDistance, className }: DistanceCardProps) {
  const completed = Math.max(0, totalDistance - remainingDistance);
  const pct = totalDistance > 0 ? Math.min(completed / totalDistance, 1) : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Distance Remaining</span>
        </div>
        <motion.span
          key={remainingDistance}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-black text-primary"
        >
          {remainingDistance.toFixed(1)} km
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{completed.toFixed(1)} km driven</span>
          <span>{totalDistance.toFixed(1)} km total</span>
        </div>
      </div>

      {/* Completion indicator */}
      {pct >= 0.9 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
          />
          Approaching destination
        </motion.div>
      )}
    </div>
  );
}
