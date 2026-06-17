"use client";

/**
 * PageHeader — Animated page title + subtitle + optional CTA
 * Used at the top of every dashboard and marketing page
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode; // optional CTA slot
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export function PageHeader({ badge, title, subtitle, className, children }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {badge && (
        <motion.span
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
        >
          {badge}
        </motion.span>
      )}

      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {subtitle}
        </motion.p>
      )}

      {children && (
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
