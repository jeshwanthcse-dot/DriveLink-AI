"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "success";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
}: ConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-elevated border border-border text-center"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Warning icon overlay */}
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 mb-4">
              <AlertTriangle className="h-5.5 w-5.5" />
            </div>

            {/* Typography */}
            <h3 className="text-base font-bold text-foreground mb-1.5">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">{message}</p>

            {/* Actions */}
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl text-xs h-9">
                {cancelLabel}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "flex-1 rounded-xl text-xs h-9 font-bold text-primary-foreground",
                  variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/95"
                )}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
