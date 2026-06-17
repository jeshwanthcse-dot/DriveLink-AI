"use client";

/**
 * components/tracking/ETAWidget.tsx
 * Animated ETA countdown display
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/cn";
import { TrackingMilestone } from "@/types/tracking";

interface ETAWidgetProps {
  eta: string;
  etaMinutes: number;
  milestone: TrackingMilestone;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const milestoneColors: Record<string, string> = {
  waiting: "text-slate-400",
  assigned: "text-blue-500",
  moving_to_pickup: "text-blue-600",
  at_pickup: "text-amber-600",
  in_transit: "text-blue-600",
  near_destination: "text-emerald-600",
  delivered: "text-emerald-600",
  completed: "text-emerald-600",
};

export function ETAWidget({ eta, etaMinutes, milestone, className, size = "md" }: ETAWidgetProps) {
  const isArrived = milestone === "delivered" || milestone === "completed";
  const isNear = milestone === "near_destination";
  const colorClass = milestoneColors[milestone] ?? "text-blue-600";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border bg-card p-4 text-center",
        isArrived && "border-emerald-400/30 bg-emerald-50/30 dark:bg-emerald-950/10",
        isNear && "border-amber-400/30 bg-amber-50/20",
        !isArrived && !isNear && "border-border",
        className
      )}
    >
      <div className={cn("p-2 rounded-xl mb-2", isArrived ? "bg-emerald-500/10" : "bg-primary/10")}>
        {isArrived ? (
          <Navigation className="h-5 w-5 text-emerald-500" />
        ) : (
          <Clock className={cn("h-5 w-5", colorClass)} />
        )}
      </div>

      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
        {isArrived ? "Arrived" : "Estimated ETA"}
      </span>

      <motion.span
        key={eta}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "font-black leading-none",
          size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl",
          colorClass
        )}
      >
        {isArrived ? "Delivered" : eta}
      </motion.span>

      {!isArrived && etaMinutes > 0 && (
        <span className="text-[10px] text-muted-foreground mt-1.5">
          ~{Math.round(etaMinutes)} min remaining
        </span>
      )}

      {isNear && (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[10px] font-bold text-amber-600 mt-1"
        >
          Approaching destination
        </motion.span>
      )}
    </div>
  );
}
