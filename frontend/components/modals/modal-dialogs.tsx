"use client";

import * as React from "react";
import { X, AlertTriangle, Check, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ReusableButton } from "@/components/buttons/button-variants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
  variant?: "default" | "danger" | "success" | "info";
  isBottomSheetOnMobile?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footerButtons,
  variant = "default",
  isBottomSheetOnMobile = true,
}: ModalProps) {
  // Avoid background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const headerColors = {
    default: "text-slate-900 dark:text-white",
    danger: "text-red-600 dark:text-red-400",
    success: "text-emerald-600 dark:text-emerald-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{
              opacity: 0,
              y: isBottomSheetOnMobile ? 100 : 20,
              scale: isBottomSheetOnMobile ? 1 : 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: isBottomSheetOnMobile ? 150 : 20,
              scale: isBottomSheetOnMobile ? 1 : 0.95,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "relative z-10 w-full bg-card border border-border shadow-elevated flex flex-col overflow-hidden",
              // Mobile layout vs Desktop layout
              isBottomSheetOnMobile
                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh] sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:rounded-2xl sm:max-w-md sm:max-h-[90vh]"
                : "rounded-2xl max-w-md max-h-[90vh]"
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border shrink-0 select-none">
              <h3 className={cn("font-bold text-lg", headerColors[variant])}>{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-muted hover:text-slate-600 dark:hover:text-slate-200 transition-all focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 py-5 overflow-y-auto text-sm text-slate-600 dark:text-slate-400 leading-relaxed shrink">
              {children}
            </div>

            {/* Footer Buttons */}
            {footerButtons && (
              <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-end gap-3 shrink-0">
                {footerButtons}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 1. Confirmation Modal
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
}: ActionModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="default"
      footerButtons={
        <>
          <ReusableButton variant="outline" onClick={onClose} disabled={isLoading} size="sm">
            Cancel
          </ReusableButton>
          <ReusableButton variant="primary" onClick={onConfirm} isLoading={isLoading} size="sm">
            {confirmLabel}
          </ReusableButton>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary self-start shrink-0">
          <Info className="h-6 w-6" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{message}</p>
      </div>
    </BaseModal>
  );
}

// 2. Delete Modal (Danger Variant)
export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this record? This action is permanent and cannot be undone.",
  confirmLabel = "Delete",
  isLoading = false,
}: ActionModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="danger"
      footerButtons={
        <>
          <ReusableButton variant="outline" onClick={onClose} disabled={isLoading} size="sm">
            Cancel
          </ReusableButton>
          <ReusableButton variant="danger" onClick={onConfirm} isLoading={isLoading} size="sm">
            {confirmLabel}
          </ReusableButton>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-600 self-start shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{message}</p>
      </div>
    </BaseModal>
  );
}

// 3. Success Modal
export function SuccessModal({
  isOpen,
  onClose,
  title = "Action Successful",
  message,
  confirmLabel = "Close",
}: Omit<ActionModalProps, "onConfirm">) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="success"
      footerButtons={
        <ReusableButton variant="success" onClick={onClose} size="sm">
          {confirmLabel}
        </ReusableButton>
      }
    >
      <div className="flex gap-4 items-center">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
          <Check className="h-6 w-6" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{message}</p>
      </div>
    </BaseModal>
  );
}

// 4. Loading Modal Overlay (Locks screen during background operations)
export function LoadingModal({ isOpen, message = "Processing operation..." }: { isOpen: boolean; message?: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="z-10 px-8 py-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-4 text-center max-w-xs shadow-elevated"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{message}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
