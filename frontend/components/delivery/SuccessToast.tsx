"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number; // ms
}

export function SuccessToast({ isOpen, onClose, title, message, duration = 3000 }: SuccessToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-full pointer-events-none">
          <motion.div
            className="pointer-events-auto rounded-2xl border border-secondary/20 bg-background/95 p-4 shadow-elevated backdrop-blur-sm flex items-start gap-3 border-l-4 border-l-secondary"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-foreground leading-tight">{title}</h4>
              <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
