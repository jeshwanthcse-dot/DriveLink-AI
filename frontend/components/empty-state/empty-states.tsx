"use client";

import * as React from "react";
import { Truck, Users, Search, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ReusableButton } from "@/components/buttons/button-variants";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-card/50 select-none",
        className
      )}
    >
      {/* Visual Icon Container */}
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shrink-0">
        {icon}
      </div>

      {/* Text Context */}
      <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      {actionLabel && onAction && (
        <ReusableButton variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </ReusableButton>
      )}
    </div>
  );
}

// 1. No Deliveries
export function NoDeliveriesState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Truck className="h-8 w-8" />}
      title="No active deliveries"
      description="You don't have any cargo shipments registered or active right now. Post your first job request to get matched."
      actionLabel="Create Delivery"
      onAction={onAction}
    />
  );
}

// 2. No Drivers
export function NoDriversState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8" />}
      title="No drivers available"
      description="There are currently no matching freight operators connected in your immediate vicinity. Expand your route parameters."
      actionLabel="Refresh Roster"
      onAction={onAction}
    />
  );
}

// 3. No Results
export function NoResultsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title="No matching results"
      description="We couldn't find any items matching those filters. Try modifying your search keywords or clear current variables."
      actionLabel="Clear Filters"
      onAction={onAction}
    />
  );
}

// 4. No AI History
export function NoAIHistoryState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Sparkles className="h-8 w-8" />}
      title="No query insights"
      description="Your optimization assistant is ready. Prompt the AI planner to analyze routes, estimate pricing, and recommend drivers."
      actionLabel="Ask Assistant"
      onAction={onAction}
    />
  );
}
