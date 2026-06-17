"use client";

/**
 * components/tracking/TrackingCard.tsx
 * Combined quick-stats panel for tracking overview
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Truck, Star, Phone, Package } from "lucide-react";
import { cn } from "@/lib/cn";
import { TrackingSession } from "@/types/tracking";
import { StatusIndicator } from "@/components/tracking/StatusIndicator";

interface TrackingCardProps {
  session: TrackingSession;
  driverRating?: number;
  deliveryNumber?: string;
  className?: string;
}

export function TrackingCard({
  session,
  driverRating,
  deliveryNumber,
  className,
}: TrackingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-4 space-y-4",
        className
      )}
    >
      {/* Driver row */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 border border-primary/20">
          {session.driverName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground truncate">{session.driverName}</p>
            {driverRating && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
                <Star className="h-3 w-3 fill-amber-400" />
                {driverRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {deliveryNumber ?? session.deliveryId} · Active Driver
          </p>
        </div>
        <Truck className="h-5 w-5 text-primary shrink-0" />
      </div>

      {/* GPS Status */}
      <StatusIndicator
        status={session.status}
        lastUpdated={session.lastUpdated}
        accuracy={session.routeHistory[session.routeHistory.length - 1]?.accuracy}
      />

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "ETA", value: session.eta },
          { label: "Remaining", value: `${session.remainingDistance.toFixed(1)} km` },
          { label: "Speed", value: `${session.speed} km/h` },
        ].map((item) => (
          <motion.div
            key={item.label}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl bg-muted/40 border border-border/50 p-2.5 text-center"
          >
            <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.label}</p>
            <p className="text-xs font-black text-foreground mt-0.5">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Emergency button placeholder */}
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/30 px-3 py-2.5 text-xs font-bold text-red-400 cursor-not-allowed opacity-70"
        title="Emergency contact — available in production"
      >
        <Phone className="h-3.5 w-3.5" />
        Emergency Contact (Production Feature)
      </button>
    </motion.div>
  );
}
