"use client";

import * as React from "react";
import { Check, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { MockDelivery } from "@/mock/deliveries";

const MILESTONES = [
  { key: "created", label: "Posted", statuses: ["draft", "published", "available"] },
  { key: "assigned", label: "Matched", statuses: ["accepted", "assigned"] },
  { key: "pickup", label: "Pickup", statuses: ["pickup_started"] },
  { key: "transit", label: "In Transit", statuses: ["in_transit", "near_destination"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
  { key: "completed", label: "Completed", statuses: ["completed", "rated"] }
];

interface DeliveryStatusTimelineProps {
  status: MockDelivery["status"];
  className?: string;
}

export function DeliveryStatusTimeline({ status, className }: DeliveryStatusTimelineProps) {
  const currentStepIndex = React.useMemo(() => {
    const idx = MILESTONES.findIndex((m) => m.statuses.includes(status));
    // Fallback if not found or cancelled
    if (idx === -1) {
      if (status === "cancelled") return 0;
      return 0;
    }
    return idx;
  }, [status]);

  return (
    <div className={cn("w-full py-4 px-2 select-none", className)}>
      <div className="relative flex items-center justify-between w-full">
        {/* Connection Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full" />

        {/* Animated Active Connection Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStepIndex / (MILESTONES.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Milestone Steps */}
        {MILESTONES.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-sm",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && "bg-background border-primary text-primary ring-4 ring-primary/20",
                  isFuture && "bg-background border-muted text-muted-foreground"
                )}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3px]" />
                ) : step.key === "transit" && isActive ? (
                  <Truck className="h-4.5 w-4.5 animate-pulse" />
                ) : step.key === "delivered" && isActive ? (
                  <MapPin className="h-4.5 w-4.5 text-secondary" />
                ) : step.key === "completed" && isActive ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <span
                className={cn(
                  "absolute top-11 mt-1 text-[10px] font-bold tracking-tight whitespace-nowrap hidden sm:block",
                  isActive ? "text-primary font-black scale-105" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Spacer for bottom labels on mobile */}
      <div className="h-7 sm:hidden" />
      <div className="flex sm:hidden justify-between mt-2 px-1">
        <span className="text-[10px] font-bold text-primary">Current: {MILESTONES[currentStepIndex]?.label || status}</span>
        {status === "cancelled" && <span className="text-[10px] font-bold text-red-500">Cancelled</span>}
      </div>
    </div>
  );
}
