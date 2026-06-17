"use client";

import * as React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, Bell, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

// 1. Alert Banner
export type AlertVariant = "success" | "warning" | "error" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description: string;
  className?: string;
}

const alertThemes: Record<AlertVariant, { container: string; title: string; iconClass: string; icon: React.ReactNode }> = {
  success: {
    container: "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300",
    title: "text-emerald-950 dark:text-emerald-200",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    icon: <CheckCircle className="h-5 w-5 shrink-0" />,
  },
  warning: {
    container: "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300",
    title: "text-amber-950 dark:text-amber-200",
    iconClass: "text-amber-600 dark:text-amber-400",
    icon: <AlertTriangle className="h-5 w-5 shrink-0" />,
  },
  error: {
    container: "bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-300",
    title: "text-red-950 dark:text-red-200",
    iconClass: "text-red-600 dark:text-red-400",
    icon: <XCircle className="h-5 w-5 shrink-0" />,
  },
  info: {
    container: "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300",
    title: "text-blue-950 dark:text-blue-200",
    iconClass: "text-blue-600 dark:text-blue-400",
    icon: <Info className="h-5 w-5 shrink-0" />,
  },
};

export function Alert({ variant = "info", title, description, className }: AlertProps) {
  const theme = alertThemes[variant];
  return (
    <div className={cn("p-4 border rounded-2xl flex gap-3 items-start", theme.container, className)}>
      <span className={theme.iconClass}>{theme.icon}</span>
      <div className="flex flex-col gap-0.5">
        {title && <span className={cn("font-bold text-sm", theme.title)}>{title}</span>}
        <span className="text-sm leading-relaxed">{description}</span>
      </div>
    </div>
  );
}

// 2. Toast System (Dynamic Notifications context/hook mockup for preview)
export interface ToastItem {
  id: string;
  title?: string;
  description: string;
  variant?: AlertVariant;
}

export function ToastMessage({ id, title, description, variant = "info", onClose }: ToastItem & { onClose: (id: string) => void }) {
  const theme = alertThemes[variant];

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border bg-card shadow-elevated p-4 flex gap-3 items-start justify-between pointer-events-auto",
        variant === "success" && "border-l-4 border-l-emerald-500",
        variant === "warning" && "border-l-4 border-l-amber-500",
        variant === "error" && "border-l-4 border-l-red-500",
        variant === "info" && "border-l-4 border-l-blue-500"
      )}
    >
      <div className="flex gap-3 items-start">
        <span className={theme.iconClass}>{theme.icon}</span>
        <div className="flex flex-col gap-0.5">
          {title && <h5 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h5>}
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// 3. Progress Bar
interface ProgressBarProps {
  value: number; // percentage
  className?: string;
}
export function ProgressBar({ value, className }: ProgressBarProps) {
  const percent = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full bg-primary rounded-full"
      />
    </div>
  );
}

// 4. Skeleton Loader Primitives
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg", className)} />
  );
}

// Combined Skeleton for rows
export function CardSkeleton() {
  return (
    <div className="border border-border p-6 rounded-2xl flex flex-col gap-4 bg-card">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

// 5. Spinner Loader
export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-primary dark:border-t-blue-500",
        sizeClasses[size],
        className
      )}
    />
  );
}
