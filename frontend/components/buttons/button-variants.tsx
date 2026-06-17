"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

// We omit standard HTML button props that clash with motion props and redefine them
type CombinedProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> &
  HTMLMotionProps<"button">;

export interface ReusableButtonProps extends CombinedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-soft hover:bg-blue-700 focus-visible:ring-primary/50",
  secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-green-700 focus-visible:ring-secondary/50",
  outline: "border border-border bg-background hover:bg-muted text-foreground focus-visible:ring-primary/30",
  ghost: "hover:bg-muted text-foreground focus-visible:ring-primary/20",
  danger: "bg-red-600 text-white shadow-soft hover:bg-red-700 focus-visible:ring-red-500/50",
  success: "bg-emerald-600 text-white shadow-soft hover:bg-emerald-700 focus-visible:ring-emerald-500/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
  md: "h-11 px-6 text-sm rounded-xl gap-2",
  lg: "h-12 px-8 text-base rounded-xl gap-2.5",
  icon: "h-10 w-10 rounded-xl p-0 justify-center",
};

export const ReusableButton = React.forwardRef<HTMLButtonElement, ReusableButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={{ y: isDisabled ? 0 : -1 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {size === "icon" ? children : <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

ReusableButton.displayName = "ReusableButton";
