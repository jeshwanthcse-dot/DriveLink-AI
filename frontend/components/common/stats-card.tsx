/**
 * StatsCard — Metric display card with icon, value, label, and optional trend
 * Server component — no client-side interactivity needed
 */

import { cn } from "@/lib/cn";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: TrendDirection;
  };
  iconColor?: string;
  iconBg?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const trendConfig: Record<TrendDirection, { icon: LucideIcon; className: string }> = {
  up: { icon: TrendingUp, className: "text-secondary" },
  down: { icon: TrendingDown, className: "text-red-500" },
  neutral: { icon: Minus, className: "text-muted-foreground" },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  className,
  prefix,
  suffix,
}: StatsCardProps) {
  const TrendIcon = trend ? trendConfig[trend.direction].icon : null;
  const trendClass = trend ? trendConfig[trend.direction].className : "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-soft",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {prefix && <span className="text-lg font-semibold text-muted-foreground">{prefix}</span>}
            {value}
            {suffix && <span className="ml-1 text-lg font-semibold text-muted-foreground">{suffix}</span>}
          </p>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} aria-hidden />
        </div>
      </div>

      {trend && TrendIcon && (
        <div className="mt-4 flex items-center gap-1.5">
          <TrendIcon className={cn("h-3.5 w-3.5", trendClass)} aria-hidden />
          <span className={cn("text-xs font-medium", trendClass)}>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
