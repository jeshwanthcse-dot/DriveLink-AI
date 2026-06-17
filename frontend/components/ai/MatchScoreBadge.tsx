"use client";

/**
 * components/ai/MatchScoreBadge.tsx
 * Circular animated score badge (0–100) with color gradient
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/cn";

interface MatchScoreBadgeProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
  showLabel?: boolean;
}

/** Returns a Tailwind-compatible color class based on score */
function getScoreColor(score: number): {
  text: string;
  ring: string;
  bg: string;
  stroke: string;
} {
  if (score >= 85)
    return {
      text: "text-emerald-600 dark:text-emerald-400",
      ring: "ring-emerald-500/20",
      bg: "bg-emerald-500/10",
      stroke: "#10b981",
    };
  if (score >= 70)
    return {
      text: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-500/20",
      bg: "bg-blue-500/10",
      stroke: "#3b82f6",
    };
  if (score >= 55)
    return {
      text: "text-amber-600 dark:text-amber-400",
      ring: "ring-amber-500/20",
      bg: "bg-amber-500/10",
      stroke: "#f59e0b",
    };
  return {
    text: "text-red-600 dark:text-red-400",
    ring: "ring-red-500/20",
    bg: "bg-red-500/10",
    stroke: "#ef4444",
  };
}

const sizeMap = {
  xs: { outer: 36, stroke: 3, fontSize: "text-[9px]" },
  sm: { outer: 48, stroke: 3.5, fontSize: "text-[10px]" },
  md: { outer: 64, stroke: 4, fontSize: "text-xs" },
  lg: { outer: 88, stroke: 5, fontSize: "text-sm" },
};

export function MatchScoreBadge({
  score,
  size = "md",
  animated = true,
  className,
  showLabel = true,
}: MatchScoreBadgeProps) {
  const { outer, stroke, fontSize } = sizeMap[size];
  const colors = getScoreColor(score);

  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated count-up
  const motionScore = useMotionValue(0);
  const displayScore = useTransform(motionScore, (v) => Math.round(v).toString());

  React.useEffect(() => {
    if (animated) {
      const controls = animate(motionScore, score, {
        duration: 1.2,
        ease: "easeOut",
      });
      return controls.stop;
    } else {
      motionScore.set(score);
    }
  }, [score, animated, motionScore]);

  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: outer, height: outer }}
      title={`AI Match Score: ${score}/100`}
    >
      {/* SVG Ring */}
      <svg
        width={outer}
        height={outer}
        className="absolute inset-0 -rotate-90"
        style={{ overflow: "visible" }}
      >
        {/* Track */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Fill */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>

      {/* Score value */}
      <div className="flex flex-col items-center justify-center z-10">
        <motion.span className={cn("font-black leading-none", fontSize, colors.text)}>
          {displayScore}
        </motion.span>
        {showLabel && size !== "xs" && (
          <span className="text-[7px] font-semibold text-slate-400 uppercase leading-none mt-0.5">
            Score
          </span>
        )}
      </div>
    </div>
  );
}
