"use client";

/**
 * components/ai/AIMatchCard.tsx
 * Driver-side delivery card enhanced with AI score, explanation, and accept/reject
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Weight,
  Clock,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { MockDelivery } from "@/mock/deliveries";
import { MatchResult } from "@/types/matching";
import { MatchScoreBadge } from "@/components/ai/MatchScoreBadge";
import { AIExplanationCard } from "@/components/ai/AIExplanationCard";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";

interface AIMatchCardProps {
  delivery: MockDelivery;
  matchResult?: MatchResult | null;
  onAccept: () => void;
  onReject?: () => void;
  /** Expire countdown in seconds — mock only */
  expireInSeconds?: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  express: "bg-orange-500/10 text-orange-600 border-orange-400/30",
  overnight: "bg-red-500/10 text-red-600 border-red-400/30",
  standard: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
};

const VEHICLE_LABELS: Record<string, string> = {
  motorcycle: "🏍 Motorcycle",
  van: "🚐 Van",
  truck: "🚛 Truck",
  heavy_truck: "🚚 Heavy Truck",
};

/** Mock countdown hook */
function useCountdown(startSeconds: number, active: boolean) {
  const [remaining, setRemaining] = React.useState(startSeconds);

  React.useEffect(() => {
    if (!active) return;
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [active, remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return {
    remaining,
    display: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    isExpiring: remaining < 60,
    isExpired: remaining <= 0,
  };
}

export function AIMatchCard({
  delivery,
  matchResult,
  onAccept,
  onReject,
  expireInSeconds = 300,
}: AIMatchCardProps) {
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [isAccepting, setIsAccepting] = React.useState(false);

  const countdown = useCountdown(expireInSeconds, !!matchResult);
  const isTopMatch = matchResult?.rank === 1;
  const score = matchResult?.score ?? 0;

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept();
      setIsAccepting(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border bg-card overflow-hidden transition-all duration-200 shadow-card hover:shadow-elevated group",
        isTopMatch
          ? "border-amber-300/40 ring-1 ring-amber-300/20"
          : "border-border hover:border-primary/30"
      )}
    >
      {/* AI Top Match Banner */}
      {isTopMatch && (
        <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400/20 to-yellow-400/10 border-b border-amber-300/30 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            AI Top Recommendation — Best match for your profile
          </span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-400">
            {delivery.deliveryNumber}
          </span>
          <span
            className={cn(
              "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
              PRIORITY_STYLES[delivery.priority]
            )}
          >
            {delivery.priority}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown */}
          {matchResult && !countdown.isExpired && (
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] font-mono font-semibold",
                countdown.isExpiring
                  ? "text-red-500 animate-pulse"
                  : "text-slate-400"
              )}
            >
              <Timer className="h-3 w-3" />
              {countdown.display}
            </div>
          )}

          {/* Score badge */}
          {matchResult && (
            <MatchScoreBadge score={score} size="xs" animated showLabel={false} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Organization */}
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">
            {delivery.organizationName}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            Client Organization
          </span>
        </div>

        {/* Route */}
        <div className="space-y-3 relative pl-4 border-l border-dashed border-slate-300 dark:border-slate-700 ml-1.5">
          <div className="relative">
            <MapPin className="absolute -left-[22px] top-0.5 h-4 w-4 text-primary bg-card" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                Pickup
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                {delivery.pickup}
              </span>
            </div>
          </div>
          <div className="relative">
            <MapPin className="absolute -left-[22px] top-0.5 h-4 w-4 text-emerald-500 bg-card" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                Destination
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                {delivery.drop}
              </span>
            </div>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-3 gap-3 text-xs border-t border-border pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 font-semibold uppercase">
              Distance
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {formatDistance(delivery.distance)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 font-semibold uppercase">
              Weight
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {formatWeight(delivery.weight)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 font-semibold uppercase">
              ETA
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {delivery.estimatedTime}
            </span>
          </div>
        </div>

        {/* Vehicle type */}
        <div className="text-[10px] text-slate-500 dark:text-slate-400">
          {VEHICLE_LABELS[delivery.vehicleType] || delivery.vehicleType}
        </div>

        {/* AI Score info row */}
        {matchResult && (
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowExplanation((v) => !v)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              aria-expanded={showExplanation}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  AI Match Score: <strong>{score}/100</strong>{" "}
                  {matchResult.rank === 1 && "· Top Pick"}
                </span>
              </div>
              {showExplanation ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  key="exp"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    <AIExplanationCard
                      explanation={matchResult.explanation}
                      driverName="You"
                      rank={matchResult.rank}
                      compact
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CTA Row */}
        <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">
              Payout
            </span>
            <span className="text-xl font-black text-emerald-600">
              {formatCurrency(delivery.payment)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onReject && (
              <button
                onClick={onReject}
                className="h-9 px-3 rounded-xl border border-border text-xs font-semibold text-slate-500 hover:text-red-500 hover:border-red-300 transition-all flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Skip
              </button>
            )}
            <motion.button
              onClick={handleAccept}
              disabled={isAccepting || countdown.isExpired}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                isAccepting || countdown.isExpired
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              )}
            >
              {isAccepting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                    className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"
                  />
                  Accepting...
                </>
              ) : countdown.isExpired ? (
                "Expired"
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Accept Job
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
