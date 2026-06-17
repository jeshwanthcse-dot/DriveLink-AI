"use client";

/**
 * components/ai/MatchingStatusCard.tsx
 * Organization-side step tracker: Scanning → Ranking → Notifying → Assigned
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Cpu, BarChart2, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { MatchingStatus } from "@/types/matching";

interface MatchingStatusCardProps {
  status: MatchingStatus;
  deliveryNumber: string;
  eligibleCount?: number;
  assignedDriverName?: string | null;
  className?: string;
}

const STEPS: {
  key: MatchingStatus[];
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    key: ["scanning", "ranking"],
    label: "Scanning Drivers",
    icon: <Cpu className="h-4 w-4" />,
    description: "AI evaluating all registered drivers",
  },
  {
    key: ["ranking"],
    label: "Ranking Results",
    icon: <BarChart2 className="h-4 w-4" />,
    description: "Calculating composite match scores",
  },
  {
    key: ["notifying"],
    label: "Notifying Top Drivers",
    icon: <Bell className="h-4 w-4" />,
    description: "Sending match alerts to top 3 drivers",
  },
  {
    key: ["assigned"],
    label: "Driver Assigned",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "First qualified driver accepted",
  },
];

function getStepState(
  stepKeys: MatchingStatus[],
  stepIndex: number,
  currentStatus: MatchingStatus
): "done" | "active" | "upcoming" {
  const statusOrder: MatchingStatus[] = [
    "scanning",
    "ranking",
    "notifying",
    "assigned",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  // Treat "no_match" and "expired" as "notifying" step for display
  const effectiveCurrent =
    currentStatus === "no_match" || currentStatus === "expired"
      ? "notifying"
      : currentStatus;
  const effectiveIndex = statusOrder.indexOf(effectiveCurrent);

  if (effectiveIndex > stepIndex) return "done";
  if (stepKeys.includes(effectiveCurrent) || stepIndex === effectiveIndex)
    return "active";
  return "upcoming";
}

export function MatchingStatusCard({
  status,
  deliveryNumber,
  eligibleCount,
  assignedDriverName,
  className,
}: MatchingStatusCardProps) {
  const isCompleted = status === "assigned";
  const isNoMatch = status === "no_match";
  const isExpired = status === "expired";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        isCompleted && "border-emerald-400/30 bg-emerald-50/20 dark:bg-emerald-950/10",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {!isCompleted && !isNoMatch && !isExpired && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-blue-500 shrink-0"
              />
            )}
            {isCompleted && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            )}
            {(isNoMatch || isExpired) && (
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            )}
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isCompleted
                ? "Matching Complete"
                : isNoMatch
                ? "No Match Found"
                : isExpired
                ? "Session Expired"
                : "AI Matching In Progress"}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Delivery {deliveryNumber}
            {eligibleCount !== undefined && ` · ${eligibleCount} eligible drivers`}
          </p>
        </div>
      </div>

      {/* Step dots */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border dark:bg-slate-700" />

        <div className="space-y-3 relative">
          {STEPS.map((step, index) => {
            const state = getStepState(step.key, index, status);

            return (
              <div key={index} className="flex items-start gap-3 pl-1">
                {/* Step indicator */}
                <div
                  className={cn(
                    "relative z-10 h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                    state === "done" &&
                      "bg-emerald-500 text-white",
                    state === "active" &&
                      "bg-blue-500 text-white ring-4 ring-blue-500/20",
                    state === "upcoming" &&
                      "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}
                >
                  {state === "active" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Labels */}
                <div className="flex flex-col pt-0.5">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      state === "done" && "text-emerald-600 dark:text-emerald-400",
                      state === "active" && "text-blue-600 dark:text-blue-300",
                      state === "upcoming" && "text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                  {state === "active" && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-slate-400"
                    >
                      {step.description}
                    </motion.span>
                  )}
                  {state === "done" && index === 3 && assignedDriverName && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {assignedDriverName} accepted the delivery
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
