import * as React from "react";
import { cn } from "@/lib/cn";

type TypographyVariant =
  | "hero"
  | "display"
  | "heading"
  | "subheading"
  | "title"
  | "body"
  | "caption"
  | "label"
  | "muted"
  | "gradient";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  hero: "text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]",
  display: "text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
  heading: "text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  subheading: "text-xl font-medium text-slate-700 dark:text-slate-300",
  title: "text-lg font-semibold text-slate-900 dark:text-slate-100",
  body: "text-base text-slate-600 dark:text-slate-400 leading-relaxed",
  caption: "text-xs font-normal text-slate-500 dark:text-slate-500",
  label: "text-sm font-semibold tracking-wide uppercase text-primary dark:text-blue-400",
  muted: "text-sm text-slate-500 dark:text-slate-500 leading-normal",
  gradient: "text-gradient font-extrabold tracking-tight",
};

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  hero: "h1",
  display: "h1",
  heading: "h2",
  subheading: "h3",
  title: "h4",
  body: "p",
  caption: "span",
  label: "span",
  muted: "p",
  gradient: "span",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, variant = "body", className, children, ...props }, ref) => {
    const Component = as || defaultElements[variant];

    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";
