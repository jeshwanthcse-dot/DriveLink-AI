"use client";

/**
 * components/tracking/TrackingHistoryCard.tsx
 * Scrollable GPS breadcrumb log
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { LocationPoint } from "@/types/tracking";

interface TrackingHistoryCardProps {
  history: LocationPoint[];
  maxItems?: number;
  className?: string;
}

export function TrackingHistoryCard({
  history,
  maxItems = 8,
  className,
}: TrackingHistoryCardProps) {
  const recent = [...history].reverse().slice(0, maxItems);

  if (recent.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Location Trace Log
        </p>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <MapPin className="h-6 w-6 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">No location history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card", className)}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Location Trace Log
        </p>
        <span className="text-[9px] text-muted-foreground">{history.length} points</span>
      </div>

      <div className="overflow-y-auto max-h-52 px-4 pb-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {recent.map((point, index) => (
            <motion.div
              key={point.timestamp}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3"
            >
              {/* Dot */}
              <div
                className={cn(
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-background",
                  index === 0 ? "bg-primary ring-2 ring-primary/20" : "bg-muted-foreground/30"
                )}
              />

              {/* Data */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground font-mono">
                  {point.lat.toFixed(4)}° N, {point.lng.toFixed(4)}° E
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground" suppressHydrationWarning>
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(point.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {point.speed} km/h
                  </span>
                  {point.accuracy && (
                    <span className="text-[10px] text-muted-foreground">±{point.accuracy}m</span>
                  )}
                </div>
              </div>

              {/* Current badge */}
              {index === 0 && (
                <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  NOW
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
