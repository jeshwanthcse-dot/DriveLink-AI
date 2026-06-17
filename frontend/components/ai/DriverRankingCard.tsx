"use client";

/**
 * components/ai/DriverRankingCard.tsx
 * Ranked driver card for the organization's recommendation list
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  Star,
  MapPin,
  Trophy,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { MatchResult } from "@/types/matching";
import { MatchScoreBadge } from "@/components/ai/MatchScoreBadge";
import { AIExplanationCard } from "@/components/ai/AIExplanationCard";

interface DriverRankingCardProps {
  result: MatchResult;
  /** Stagger delay index for entrance animation */
  animationDelay?: number;
  /** Called if org manually triggers notification */
  onNotify?: (driverId: string) => void;
  /** Whether this delivery has already been assigned */
  isAssigned?: boolean;
  assignedDriverId?: string | null;
}

const rankBadgeStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-amber-200",
  2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3: "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
};

const vehicleTypeLabels: Record<string, string> = {
  motorcycle: "Motorcycle",
  van: "Van",
  truck: "Truck",
  heavy_truck: "Heavy Truck",
};

export function DriverRankingCard({
  result,
  animationDelay = 0,
  onNotify,
  isAssigned = false,
  assignedDriverId,
}: DriverRankingCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const { driver, score, rank, distanceToPickup, explanation, notified } = result;

  const isTopMatch = rank === 1;
  const isThisDriverAssigned = isAssigned && assignedDriverId === driver.id;
  const rankStyle = rankBadgeStyles[rank] || "bg-slate-100 text-slate-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-xl border transition-all duration-200",
        isTopMatch && !isAssigned
          ? "border-amber-300/50 bg-gradient-to-r from-amber-50/50 to-slate-50/30 dark:from-amber-950/10 dark:border-amber-500/20"
          : "border-border bg-card",
        isThisDriverAssigned && "border-emerald-400/50 bg-emerald-50/30 dark:bg-emerald-950/10 ring-1 ring-emerald-400/20"
      )}
    >
      {/* Top match ribbon */}
      {isTopMatch && !isAssigned && (
        <div className="px-3 py-1 bg-amber-400/10 border-b border-amber-300/30 flex items-center gap-1.5">
          <Trophy className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            Top AI Recommendation
          </span>
        </div>
      )}
      {isThisDriverAssigned && (
        <div className="px-3 py-1 bg-emerald-500/10 border-b border-emerald-400/30 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Assigned Driver
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Rank badge */}
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm",
              rankStyle
            )}
          >
            #{rank}
          </div>

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
            {driver.avatarInitials}
          </div>

          {/* Driver info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {driver.name}
              </span>
              {notified && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Bell className="h-2.5 w-2.5" />
                  Notified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Truck className="h-3 w-3" />
                {vehicleTypeLabels[driver.vehicleType] || driver.vehicleType}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {driver.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <MapPin className="h-3 w-3 text-blue-400" />
                {distanceToPickup.toFixed(1)} km away
              </span>
            </div>
          </div>

          {/* Score badge */}
          <div className="shrink-0">
            <MatchScoreBadge score={score} size="sm" animated />
          </div>
        </div>

        {/* Expandable explanation */}
        <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            {driver.experience} yr exp · {driver.completedDeliveries} deliveries
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                Hide AI Reasoning <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                View AI Reasoning <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                <AIExplanationCard
                  explanation={explanation}
                  driverName={driver.name}
                  rank={rank}
                  compact
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
