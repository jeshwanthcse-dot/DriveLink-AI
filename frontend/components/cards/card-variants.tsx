"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ArrowUpRight, ArrowDownRight, Sparkles, MapPin, Calendar, Clock, DollarSign } from "lucide-react";

// 1. Base Card Wrapper
interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ children, className, animate = false, ...props }, ref) => {
    const Component = animate ? motion.div : "div";
    const motionProps = animate ? { whileHover: { y: -4 }, transition: { duration: 0.2 } } : {};

    return (
      <Component
        ref={ref as any}
        className={cn(
          "rounded-2xl border border-border bg-card text-card-foreground shadow-card transition-all duration-200 overflow-hidden",
          className
        )}
        {...(motionProps as any)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BaseCard.displayName = "BaseCard";

// 2. Feature Card
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export function FeatureCard({ icon, title, description, badge, className, ...props }: FeatureCardProps) {
  return (
    <BaseCard
      animate
      className={cn(
        "p-6 flex flex-col items-start gap-4 hover:shadow-elevated dark:hover:border-primary/50 group",
        className
      )}
      {...props}
    >
      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
    </BaseCard>
  );
}

// 3. Stats Card
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

export function StatsCard({ title, value, icon, trend, className, ...props }: StatsCardProps) {
  return (
    <BaseCard className={cn("p-6 flex flex-col gap-4 bg-card", className)} {...props}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {icon && (
          <div className="p-2.5 rounded-lg bg-muted text-slate-600 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</span>
        {trend && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}%
            </span>
            <span className="text-slate-400 dark:text-slate-500">{trend.label || "vs last month"}</span>
          </div>
        )}
      </div>
    </BaseCard>
  );
}

// 4. Profile Card
interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  avatarUrl?: string;
  details: { label: string; value: string }[];
  actionButton?: React.ReactNode;
}

export function ProfileCard({ name, role, avatarUrl, details, actionButton, className, ...props }: ProfileCardProps) {
  return (
    <BaseCard className={cn("p-6 flex flex-col gap-5 items-center text-center", className)} {...props}>
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-300 border-2 border-primary">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{name}</h4>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary inline-block self-center">
          {role}
        </span>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-border py-4 my-1">
        {details.map((detail, idx) => (
          <div key={idx} className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
              {detail.label}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      {actionButton && <div className="w-full">{actionButton}</div>}
    </BaseCard>
  );
}

// 5. Delivery Card
interface DeliveryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  pickup: string;
  dropoff: string;
  status: "pending" | "matched" | "transit" | "delivered";
  payout: string;
  eta?: string;
}

const statusThemes = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  matched: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  transit: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

export function DeliveryCard({ id, pickup, dropoff, status, payout, eta, className, ...props }: DeliveryCardProps) {
  return (
    <BaseCard className={cn("p-5 flex flex-col gap-4 border-l-4 border-l-primary hover:shadow-elevated transition-shadow", className)} {...props}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-semibold text-slate-400">ID: {id}</span>
        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", statusThemes[status])}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col gap-3 relative pl-4 border-l border-dashed border-slate-300 dark:border-slate-700 ml-1.5 my-1">
        <div className="relative">
          <MapPin className="absolute -left-[22px] top-0.5 h-4 w-4 text-primary bg-card" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase leading-none">Pickup</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{pickup}</span>
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute -left-[22px] top-0.5 h-4 w-4 text-secondary bg-card" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase leading-none">Dropoff</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{dropoff}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <DollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{payout}</span>
        </div>
        {eta && (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 justify-end">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{eta}</span>
          </div>
        )}
      </div>
    </BaseCard>
  );
}

// 6. Glass Card
export const GlassCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ children, className, animate = false, ...props }, ref) => {
    const Component = animate ? motion.div : "div";
    const motionProps = animate ? { whileHover: { y: -4 }, transition: { duration: 0.2 } } : {};

    return (
      <Component
        ref={ref as any}
        className={cn(
          "rounded-2xl border border-white/20 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-card transition-all duration-200 overflow-hidden",
          className
        )}
        {...(motionProps as any)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
GlassCard.displayName = "GlassCard";

// 7. AI Card
interface AICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  onGenerate?: () => void;
}

export function AICard({ title, description, onGenerate, className, ...props }: AICardProps) {
  return (
    <GlassCard
      animate
      className={cn(
        "p-6 relative overflow-hidden border border-blue-500/20 dark:border-blue-400/10 hover:border-blue-500/40 dark:hover:border-blue-400/30",
        className
      )}
      {...props}
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Sparkles className="h-5 w-5 fill-current" />
          <h4 className="font-bold text-lg">{title}</h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        {onGenerate && (
          <button
            onClick={onGenerate}
            className="self-start text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-soft transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Optimization</span>
          </button>
        )}
      </div>
    </GlassCard>
  );
}

// 8. Interactive Card (Pressable & Active state)
interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  onClick?: () => void;
}

export function InteractiveCard({ active, onClick, children, className, ...props }: InteractiveCardProps) {
  return (
    <BaseCard
      onClick={onClick}
      className={cn(
        "cursor-pointer hover:border-primary active:scale-[0.99] select-none hover:shadow-soft transition-all duration-150",
        active && "border-primary ring-2 ring-primary/10 bg-primary/5 dark:bg-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </BaseCard>
  );
}
