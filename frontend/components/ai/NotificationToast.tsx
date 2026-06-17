"use client";

/**
 * components/ai/NotificationToast.tsx
 * Animated slide-in toast for AI matching events
 * Sprint 6 — DriveLink AI
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Bell, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastType = "ai_started" | "new_match" | "driver_accepted" | "assignment_confirmed" | "warning";

interface NotificationToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  /** Auto-dismiss duration in ms. Default 4500 */
  duration?: number;
}

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; barClass: string; iconBg: string; border: string }
> = {
  ai_started: {
    icon: <Sparkles className="h-5 w-5 text-blue-500" />,
    barClass: "from-blue-500 to-blue-400",
    iconBg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  new_match: {
    icon: <Bell className="h-5 w-5 text-violet-500" />,
    barClass: "from-violet-500 to-violet-400",
    iconBg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  driver_accepted: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    barClass: "from-emerald-500 to-emerald-400",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  assignment_confirmed: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    barClass: "from-emerald-500 to-emerald-400",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  warning: {
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    barClass: "from-amber-500 to-amber-400",
    iconBg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

export function NotificationToast({
  visible,
  type,
  title,
  message,
  onClose,
  duration = 4500,
}: NotificationToastProps) {
  const config = toastConfig[type];

  React.useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 280 }}
          className={cn(
            "fixed bottom-6 right-6 z-[100] w-80 rounded-2xl border bg-white dark:bg-slate-900 shadow-elevated overflow-hidden",
            config.border
          )}
        >
          {/* Progress bar */}
          <motion.div
            className={cn("h-1 w-full bg-gradient-to-r", config.barClass)}
            initial={{ scaleX: 1, transformOrigin: "left" }}
            animate={{ scaleX: 0, transformOrigin: "left" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />

          <div className="flex items-start gap-3 p-4">
            <div className={cn("p-2 rounded-xl shrink-0", config.iconBg)}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Toast manager hook — manages a queue of toasts
 */
interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

export function useToastQueue() {
  const [queue, setQueue] = React.useState<ToastItem[]>([]);

  const push = React.useCallback(
    (type: ToastType, title: string, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setQueue((prev) => [...prev, { id, type, title, message }]);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const current = queue[0] ?? null;

  return { current, push, dismiss };
}
