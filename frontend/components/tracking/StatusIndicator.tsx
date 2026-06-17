"use client";

/**
 * components/tracking/StatusIndicator.tsx
 * GPS connection status badge with animated pulse
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Signal } from "lucide-react";
import { cn } from "@/lib/cn";
import { TrackingStatus } from "@/types/tracking";

interface StatusIndicatorProps {
  status: TrackingStatus;
  lastUpdated: string;
  accuracy?: number;
  className?: string;
}

const STATUS_CONFIG: Record<TrackingStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  idle:      { label: "Offline",   color: "text-slate-400",   bg: "bg-slate-100 dark:bg-slate-800",   border: "border-slate-200", icon: <WifiOff className="h-3.5 w-3.5" /> },
  waiting:   { label: "Standby",   color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300/40", icon: <Signal className="h-3.5 w-3.5" /> },
  active:    { label: "GPS Live",  color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-400/30", icon: <Wifi className="h-3.5 w-3.5" /> },
  paused:    { label: "Paused",    color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300/40", icon: <Signal className="h-3.5 w-3.5" /> },
  completed: { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-400/30", icon: <Wifi className="h-3.5 w-3.5" /> },
};

export function StatusIndicator({ status, lastUpdated, accuracy, className }: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  const isLive = status === "active";

  const timeAgo = React.useMemo(() => {
    const diff = (Date.now() - new Date(lastUpdated).getTime()) / 1000;
    if (diff < 10) return "Just now";
    if (diff < 60) return `${Math.round(diff)}s ago`;
    return `${Math.round(diff / 60)}m ago`;
  }, [lastUpdated]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3.5 py-2.5",
        config.bg,
        config.border,
        className
      )}
    >
      <div className="relative shrink-0">
        {isLive && (
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500/40"
          />
        )}
        <div className={cn("relative", config.color)}>{config.icon}</div>
      </div>

      <div className="flex flex-col">
        <span className={cn("text-xs font-bold leading-none", config.color)}>
          {config.label}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {isLive ? `Updated ${timeAgo}` : "Tracking inactive"}
          {accuracy && isLive && ` · ±${accuracy}m`}
        </span>
      </div>
    </div>
  );
}
