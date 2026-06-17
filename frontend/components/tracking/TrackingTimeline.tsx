"use client";

/**
 * components/tracking/TrackingTimeline.tsx
 * 8-step vertical tracking timeline with animated active step
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  UserCheck,
  Navigation,
  Package,
  Truck,
  Crosshair,
  CheckCircle2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { TrackingMilestone } from "@/types/tracking";

interface TrackingTimelineProps {
  currentMilestone: TrackingMilestone;
  startedAt?: string | null;
  className?: string;
  compact?: boolean;
}

const STEPS: {
  key: TrackingMilestone;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  { key: "waiting",           label: "Waiting",           description: "Delivery posted", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "assigned",          label: "Assigned",          description: "Driver matched",   icon: <UserCheck className="h-3.5 w-3.5" /> },
  { key: "moving_to_pickup",  label: "Moving to Pickup",  description: "En route",         icon: <Navigation className="h-3.5 w-3.5" /> },
  { key: "at_pickup",         label: "At Pickup",         description: "Collecting cargo",  icon: <Package className="h-3.5 w-3.5" /> },
  { key: "in_transit",        label: "In Transit",        description: "Cargo en route",   icon: <Truck className="h-3.5 w-3.5" /> },
  { key: "near_destination",  label: "Near Destination",  description: "Approaching drop", icon: <Crosshair className="h-3.5 w-3.5" /> },
  { key: "delivered",         label: "Delivered",         description: "Arrived at drop",  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "completed",         label: "Completed",         description: "All done",         icon: <Star className="h-3.5 w-3.5" /> },
];

const ORDER = STEPS.map((s) => s.key);

export function TrackingTimeline({
  currentMilestone,
  startedAt,
  className,
  compact = false,
}: TrackingTimelineProps) {
  const currentIndex = ORDER.indexOf(currentMilestone);

  return (
    <div className={cn("relative", className)}>
      {/* Connector line */}
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

      <div className="space-y-0">
        {STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn(
                "flex items-start gap-3 py-2 relative",
                compact ? "py-1.5" : "py-2.5"
              )}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isDone && "bg-emerald-500 border-emerald-500 text-white",
                  isActive && "bg-primary border-primary text-white ring-4 ring-primary/20",
                  isUpcoming && "bg-background border-muted text-muted-foreground"
                )}
              >
                {isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {step.icon}
                  </motion.div>
                ) : (
                  step.icon
                )}
              </div>

              {/* Labels */}
              <div className={cn("flex flex-col pt-0.5", compact ? "gap-0" : "gap-0.5")}>
                <span
                  className={cn(
                    "text-xs font-bold leading-none",
                    isDone && "text-emerald-600 dark:text-emerald-400",
                    isActive && "text-primary",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {!compact && (
                  <span className="text-[10px] text-muted-foreground">{step.description}</span>
                )}
                {isActive && startedAt && index >= 2 && (
                  <span className="text-[9px] text-primary/70 font-medium" suppressHydrationWarning>
                    Since {new Date(startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>

              {/* Active pulse indicator */}
              {isActive && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="ml-auto shrink-0 h-2 w-2 rounded-full bg-primary mt-2"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
