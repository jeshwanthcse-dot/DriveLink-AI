"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

// 1. Avatar
export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy";
  className?: string;
}
export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs font-semibold",
    md: "h-11 w-11 text-sm font-bold",
    lg: "h-16 w-16 text-lg font-bold",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-red-500",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative shrink-0 select-none", className)}>
      <div
        className={cn(
          "rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border flex items-center justify-center overflow-hidden",
          sizeClasses[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white dark:border-slate-950",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

// 2. Chip / Tag / Badge
export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";
export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  outline?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

export function Badge({ variant = "default", children, className, outline = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border",
        outline ? "bg-transparent" : "",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// 3. Timeline Item & Timeline Track
export interface TimelineItemProps {
  title: string;
  time: string;
  description?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isLast?: boolean;
}
export function TimelineItem({ title, time, description, icon, isActive = false, isLast = false }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      {/* Icon & Connection Stem */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0",
            isActive
              ? "bg-primary border-primary text-white"
              : "bg-background border-border text-slate-400"
          )}
        >
          {icon || <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-white" : "bg-slate-400")} />}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1 min-h-[30px]" />}
      </div>

      {/* Text Context */}
      <div className="flex flex-col pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">{time}</span>
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-md">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// 4. Rating Stars
export interface RatingStarsProps {
  rating: number; // 0 to 5
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  className?: string;
}
export function RatingStars({ rating, max = 5, interactive = false, onChange, className }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, idx) => {
        const starNum = idx + 1;
        const isFilled = starNum <= currentVal;

        return (
          <Star
            key={idx}
            onClick={() => interactive && onChange && onChange(starNum)}
            onMouseEnter={() => interactive && setHoverRating(starNum)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              "h-4.5 w-4.5 select-none",
              interactive ? "cursor-pointer" : "",
              isFilled
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 dark:text-slate-700"
            )}
          />
        );
      })}
    </div>
  );
}
