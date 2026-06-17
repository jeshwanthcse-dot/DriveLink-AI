"use client";

import { cn } from "@/lib/cn";
import { MockDelivery } from "@/mock/deliveries";

const STATUS_STYLE: Record<MockDelivery["status"], string> = {
  draft: "bg-muted text-muted-foreground border-slate-200 dark:border-slate-800",
  published: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  available: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  accepted: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
  assigned: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
  pickup_started: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
  in_transit: "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
  near_destination: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
  delivered: "bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/30",
  completed: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30",
  rated: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/40",
  cancelled: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
  pending: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-900/30",
};

const STATUS_LABELS: Record<MockDelivery["status"], string> = {
  draft: "Draft",
  published: "Published",
  available: "Awaiting Driver",
  accepted: "Accepted",
  assigned: "Assigned",
  pickup_started: "Pickup Started",
  in_transit: "In Transit",
  near_destination: "Near Dropoff",
  delivered: "Delivered",
  completed: "Completed",
  rated: "Completed & Rated",
  cancelled: "Cancelled",
  pending: "Awaiting Match",
};

interface DeliveryStatusBadgeProps {
  status: MockDelivery["status"];
  className?: string;
}

export function DeliveryStatusBadge({ status, className }: DeliveryStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border",
        STATUS_STYLE[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
