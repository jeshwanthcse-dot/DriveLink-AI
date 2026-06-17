"use client";

import * as React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

// 1. Back Button
interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}
export function BackButton({ label = "Back", className, ...props }: BackButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none select-none",
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

// 2. Step Indicator
interface Step {
  id: number;
  label: string;
}
interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center w-full select-none", className)}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                  isCompleted && "bg-emerald-500 border-emerald-500 text-white",
                  isActive && "bg-primary border-primary text-white ring-4 ring-primary/15",
                  !isActive && !isCompleted && "bg-background border-border text-slate-400"
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden md:inline-block",
                  isActive && "text-slate-900 dark:text-white",
                  !isActive && "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Bar */}
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-4 h-0.5 bg-slate-100 dark:bg-slate-800 min-w-[30px]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 3. Tab Navigation (Segment Tabs)
interface Tab {
  id: string;
  label: string;
}
interface TabProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export function TabNavigator({ tabs, activeTab, onChange, className }: TabProps) {
  return (
    <div className={cn("flex border-b border-border select-none", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-3 text-sm font-semibold transition-all hover:text-slate-800 dark:hover:text-slate-200 border-b-2 border-transparent -mb-[2px] focus:outline-none",
              isActive
                ? "border-primary text-primary dark:text-blue-400"
                : "text-slate-400"
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-blue-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// 4. Breadcrumbs
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
}
export function Breadcrumbs({ items, onItemClick, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-xs text-slate-400 select-none font-medium", className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <span
              onClick={() => !isLast && onItemClick && onItemClick(item)}
              className={cn(
                "hover:text-slate-600 dark:hover:text-slate-200 transition-colors",
                !isLast && onItemClick && "cursor-pointer",
                isLast && "text-slate-800 dark:text-slate-200 font-semibold"
              )}
            >
              {item.label}
            </span>
            {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
