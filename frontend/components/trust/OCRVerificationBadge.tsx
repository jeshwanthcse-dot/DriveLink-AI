/**
 * components/trust/OCRVerificationBadge.tsx
 * Status badge with variations mapping verification stages and showing OCR confidence.
 * Sprint 9 — DriveLink AI
 */

"use client";

import * as React from "react";
import { VerificationStatus } from "@/types/trust";
import { CheckCircle2, AlertTriangle, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface OCRVerificationBadgeProps {
  status: VerificationStatus;
  confidenceScore?: number | null;
  className?: string;
}

export function OCRVerificationBadge({
  status,
  confidenceScore,
  className,
}: OCRVerificationBadgeProps) {
  let label = "";
  let icon = null;
  let bgClass = "";
  let textClass = "";
  let borderClass = "";

  switch (status) {
    case "verified":
      label = "Verified";
      icon = <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />;
      bgClass = "bg-emerald-50 dark:bg-emerald-950/30";
      textClass = "text-emerald-700 dark:text-emerald-400";
      borderClass = "border-emerald-200 dark:border-emerald-900/50";
      break;
    case "expires_soon":
      label = "Expires Soon";
      icon = <Clock className="h-3.5 w-3.5 mr-1 text-orange-600 dark:text-orange-400" />;
      bgClass = "bg-orange-50 dark:bg-orange-950/30";
      textClass = "text-orange-700 dark:text-orange-400";
      borderClass = "border-orange-200 dark:border-orange-900/50";
      break;
    case "pending":
      label = "Processing OCR";
      icon = <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600 dark:text-amber-400 animate-bounce" />;
      bgClass = "bg-amber-50 dark:bg-amber-950/30 animate-pulse";
      textClass = "text-amber-700 dark:text-amber-455";
      borderClass = "border-amber-200 dark:border-amber-900/50";
      break;
    case "rejected":
      label = "Rejected";
      icon = <XCircle className="h-3.5 w-3.5 mr-1 text-red-600 dark:text-red-400" />;
      bgClass = "bg-red-50 dark:bg-red-950/30";
      textClass = "text-red-700 dark:text-red-400";
      borderClass = "border-red-200 dark:border-red-900/50";
      break;
    case "missing":
    default:
      label = "Missing";
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" />;
      bgClass = "bg-slate-50 dark:bg-slate-900/30";
      textClass = "text-slate-600 dark:text-slate-400";
      borderClass = "border-slate-200 dark:border-slate-800/80";
      break;
  }

  const confidencePct = confidenceScore != null ? Math.round(confidenceScore * 100) : null;

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all duration-300",
        bgClass,
        textClass,
        borderClass,
        className
      )}
    >
      {icon}
      <span>{label}</span>
      {status === "verified" && confidencePct !== null && (
        <span className="ml-1.5 px-1 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono font-medium">
          {confidencePct}% conf
        </span>
      )}
    </div>
  );
}
