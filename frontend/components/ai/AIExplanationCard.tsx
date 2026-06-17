"use client";

/**
 * components/ai/AIExplanationCard.tsx
 * "Matched because..." panel with animated per-factor progress bars
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { AIExplanation, AIScoreFactor } from "@/types/matching";

interface AIExplanationCardProps {
  explanation: AIExplanation;
  driverName: string;
  rank?: number;
  className?: string;
  compact?: boolean;
}

const factorIcons: Record<string, React.ReactNode> = {
  "Driver Rating": <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />,
  "Distance to Pickup": <MapPin className="h-3.5 w-3.5 text-blue-500" />,
  "Experience": <Briefcase className="h-3.5 w-3.5 text-violet-500" />,
  "Completed Deliveries": <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
};

function FactorBar({ factor, index }: { factor: AIScoreFactor; index: number }) {
  const pct = (factor.contribution / factor.maxContribution) * 100;

  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {factorIcons[factor.label] || <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />}
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {factor.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {factor.displayValue}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            +{factor.contribution.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.1 + 0.15, duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-[8px] text-slate-400">
        <span>0</span>
        <span className="font-medium text-blue-500">{factor.weightLabel} weight</span>
        <span>{factor.maxContribution}</span>
      </div>
    </motion.div>
  );
}

export function AIExplanationCard({
  explanation,
  driverName,
  rank,
  className,
  compact = false,
}: AIExplanationCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-50/60 to-slate-50/40 dark:from-blue-950/20 dark:to-slate-900/40 p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-blue-500/10">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
            AI Reasoning
          </p>
          {rank && (
            <p className="text-[9px] text-slate-400">
              Rank #{rank} match for {driverName}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {!compact && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3 italic">
          &ldquo;{explanation.summary}&rdquo;
        </p>
      )}

      {/* Factor Breakdown */}
      <div className="space-y-3">
        {explanation.factors.map((factor, i) => (
          <FactorBar key={factor.label} factor={factor} index={i} />
        ))}
      </div>

      {/* Total */}
      <div className="mt-3 pt-3 border-t border-blue-500/10 flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-400 uppercase">
          Composite AI Score
        </span>
        <span className="text-sm font-black text-blue-600 dark:text-blue-400">
          {explanation.factors.reduce((sum, f) => sum + f.contribution, 0).toFixed(1)} / 100
        </span>
      </div>
    </div>
  );
}
