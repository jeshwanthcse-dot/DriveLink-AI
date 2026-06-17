import * as React from "react";
import { cn } from "@/lib/cn";

// 1. Container / Max Width Wrapper
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  clean?: boolean;
}
export function Container({ className, clean = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        !clean && "max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
}

// 2. Section (Vertical spacer)
export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "none";
}
export function Section({ className, size = "md", ...props }: SectionProps) {
  const sizeClasses = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-20",
    lg: "py-20 md:py-32",
    none: "",
  };

  return (
    <section
      className={cn(
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

// 3. Flex Stack (Vertical alignment helper)
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg" | "xl" | "none";
  align?: "start" | "center" | "end" | "stretch";
}
export function Stack({ className, gap = "md", align = "stretch", ...props }: StackProps) {
  const gapClasses = {
    sm: "gap-2.5",
    md: "gap-5",
    lg: "gap-8",
    xl: "gap-12",
    none: "",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        gapClasses[gap],
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
}

// 4. Responsive Grid
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6;
  colsTablet?: 1 | 2 | 3 | 4;
  colsMobile?: 1 | 2;
  gap?: "sm" | "md" | "lg";
}
export function Grid({ className, cols = 3, colsTablet = 2, colsMobile = 1, gap = "md", ...props }: GridProps) {
  const colClasses = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    6: "lg:grid-cols-6",
  };

  const tabletClasses = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const mobileClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid",
        colClasses[cols],
        tabletClasses[colsTablet],
        mobileClasses[colsMobile],
        gapClasses[gap],
        className
      )}
      {...props}
    />
  );
}

// 5. Page Layout Shell (Standard header and footer layout helper)
export function PageLayout({ header, footer, children, className }: { header?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background text-foreground", className)}>
      {header && <header className="shrink-0">{header}</header>}
      <main className="flex-grow flex flex-col">{children}</main>
      {footer && <footer className="shrink-0">{footer}</footer>}
    </div>
  );
}
