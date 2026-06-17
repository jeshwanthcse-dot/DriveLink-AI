"use client";

/**
 * components/tracking/SpeedCard.tsx
 * Animated SVG speedometer gauge
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/cn";

interface SpeedCardProps {
  speed: number;
  heading?: number;
  maxSpeed?: number;
  className?: string;
}

function speedToColor(speed: number): string {
  if (speed === 0) return "#94a3b8";
  if (speed < 30) return "#10b981";
  if (speed < 60) return "#2563eb";
  if (speed < 80) return "#f59e0b";
  return "#ef4444";
}

export function SpeedCard({ speed, heading, maxSpeed = 100, className }: SpeedCardProps) {
  const pct = Math.min(speed / maxSpeed, 1);
  const color = speedToColor(speed);

  // Arc parameters for SVG gauge
  const cx = 60, cy = 60, r = 46;
  const startAngle = -220; // degrees
  const sweepAngle = 260;  // degrees of arc
  const angle = startAngle + sweepAngle * pct;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  const trackPath = describeArc(cx, cy, r, startAngle, startAngle + sweepAngle);
  const activePath = pct > 0 ? describeArc(cx, cy, r, startAngle, angle) : "";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Active arc */}
          {activePath && (
            <motion.path
              d={activePath}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
          {/* Gauge icon */}
          <foreignObject x="40" y="34" width="40" height="40">
            <div className="flex items-center justify-center w-full h-full">
              <Gauge className="h-5 w-5 text-muted-foreground" />
            </div>
          </foreignObject>
          {/* Speed text */}
          <text
            x="60" y="90"
            textAnchor="middle"
            fontSize="22"
            fontWeight="900"
            fill={color}
          >
            {speed}
          </text>
          <text x="60" y="103" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
            km/h
          </text>
        </svg>
      </div>

      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide -mt-1">
        Current Speed
      </span>

      {heading !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <motion.div
            animate={{ rotate: heading }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary"
          >
            ➤
          </motion.div>
          <span className="text-[10px] text-muted-foreground">{Math.round(heading)}° heading</span>
        </div>
      )}
    </div>
  );
}
