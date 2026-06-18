"use client";

/**
 * components/maps/SVGFallbackMap.tsx
 * Animated SVG map — primary fallback map when mapping services are unconfigured.
 * Shows driver marker moving smoothly, route polyline, pickup/drop pins.
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { motion } from "framer-motion";
import { TrackingSession } from "@/types/tracking";

interface SVGFallbackMapProps {
  session: TrackingSession;
  showControls?: boolean;
  className?: string;
}

/** Map the 0–20 waypoint index to SVG x/y coordinates along a bezier curve */
function waypointToSVG(index: number, total: number): { x: number; y: number } {
  const t = index / Math.max(total, 1);
  // Bezier control points matching the path below
  const p0 = { x: 80, y: 380 };
  const p1 = { x: 220, y: 280 };
  const p2 = { x: 540, y: 180 };
  const p3 = { x: 700, y: 90 };

  const x =
    (1 - t) ** 3 * p0.x +
    3 * (1 - t) ** 2 * t * p1.x +
    3 * (1 - t) * t ** 2 * p2.x +
    t ** 3 * p3.x;
  const y =
    (1 - t) ** 3 * p0.y +
    3 * (1 - t) ** 2 * t * p1.y +
    3 * (1 - t) * t ** 2 * p2.y +
    t ** 3 * p3.y;

  return { x, y };
}

/** Status to label map */
const MILESTONE_LABELS: Record<string, string> = {
  moving_to_pickup: "En Route to Pickup",
  at_pickup: "At Pickup Point",
  in_transit: "In Transit",
  near_destination: "Near Destination",
  delivered: "Delivered",
  waiting: "Waiting",
  assigned: "Assigned",
  completed: "Completed",
};

import { OfflineMapOverlay } from "@/components/offline/OfflineMapOverlay";

export function SVGFallbackMap({ session, showControls = true, className }: SVGFallbackMapProps) {
  const TOTAL_WAYPOINTS = 20;

  // Calculate synced index to freeze marker if offline
  const syncedIndex = session.isOffline
    ? Math.max(0, session.waypointIndex - (session.pendingSyncCount ?? 0))
    : session.waypointIndex;

  const driverPos = waypointToSVG(syncedIndex, TOTAL_WAYPOINTS);
  const progressPct = syncedIndex / TOTAL_WAYPOINTS;

  // Build completed-path points for the "driven" segment
  const drivenPoints: string[] = [];
  for (let i = 0; i <= syncedIndex; i++) {
    const p = waypointToSVG(i, TOTAL_WAYPOINTS);
    drivenPoints.push(`${p.x},${p.y}`);
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 ${className ?? ""}`} style={{ aspectRatio: "16/9" }}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 780 440"
        fill="none"
        aria-label="Simulated route tracking map"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 49} x2="780" y2={i * 49} stroke="#e2e8f0" strokeWidth="1" opacity="0.6" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="440" stroke="#e2e8f0" strokeWidth="1" opacity="0.6" />
        ))}

        {/* Full route — dashed track */}
        <path
          d="M80 380 C220 280 540 180 700 90"
          stroke="#CBD5E1"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 6"
          fill="none"
        />

        {/* Driven segment polyline (animated extension) */}
        {drivenPoints.length > 1 && (
          <polyline
            points={drivenPoints.join(" ")}
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        )}

        {/* Pickup marker */}
        <g>
          <circle cx="80" cy="380" r="11" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <text x="80" y="407" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">
            Pickup
          </text>
          <text x="95" y="379" fill="#166534" fontSize="9" fontWeight="600">
            {session.deliveryNumber}
          </text>
        </g>

        {/* Destination marker */}
        <g>
          <circle cx="700" cy="90" r="11" fill="#7C3AED" stroke="#fff" strokeWidth="2.5" />
          <text x="700" y="117" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">
            Drop-off
          </text>
        </g>

        {/* Driver marker — animated position */}
        <motion.g
          animate={{ x: driverPos.x, y: driverPos.y }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
          initial={{ x: 80, y: 380 }}
        >
          {/* Pulse ring */}
          <motion.circle
            cx="0" cy="0" r="20"
            fill="#2563EB"
            opacity="0.15"
            animate={{ r: [16, 24, 16] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Outer ring */}
          <circle cx="0" cy="0" r="12" fill="#2563EB" opacity="0.25" />
          {/* Main dot */}
          <circle cx="0" cy="0" r="8" fill="#2563EB" stroke="#fff" strokeWidth="2.5" />
          {/* Driver label */}
          <text x="14" y="-10" fill="#1e40af" fontSize="10" fontWeight="800">
            {session.driverName.split(" ")[0]}
          </text>
          {/* Speed */}
          <text x="14" y="1" fill="#64748b" fontSize="9">
            {session.isOffline ? 0 : session.speed} km/h
          </text>
        </motion.g>

        {/* Route history dots */}
        {session.routeHistory.slice(-6).map((_, i) => {
          const idx = Math.max(0, syncedIndex - 6 + i);
          const p = waypointToSVG(idx, TOTAL_WAYPOINTS);
          return (
            <circle
              key={`hist-${i}`}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#93C5FD"
              opacity={0.4 + i * 0.1}
            />
          );
        })}
      </svg>

      {/* Bottom stats overlay */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 shadow-elevated backdrop-blur-sm border border-border/40">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">ETA</span>
            <span className="text-sm font-black text-slate-800 dark:text-white">
              {session.isOffline ? "Suspended" : session.eta}
            </span>
          </div>
          <div className="h-7 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Remaining</span>
            <span className="text-sm font-black text-slate-800 dark:text-white">
              {(session.isOffline && session.lastSyncedLat) 
                ? (session.remainingDistance + (session.pendingSyncCount ?? 0) * 0.05).toFixed(1)
                : session.remainingDistance.toFixed(1)} km
            </span>
          </div>
          <div className="h-7 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Speed</span>
            <span className="text-sm font-black text-slate-800 dark:text-white">
              {session.isOffline ? 0 : session.speed} km/h
            </span>
          </div>
          <div className="h-7 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Status</span>
            <span className="text-xs font-bold text-blue-600">
              {session.isOffline ? "Offline Caching" : (MILESTONE_LABELS[session.currentMilestone] ?? session.currentMilestone)}
            </span>
          </div>
        </div>
      )}

      {/* GPS Live badge / Offline indicator */}
      {!session.isOffline ? (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-2.5 py-1 backdrop-blur-sm">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-white"
          />
          <span className="text-[10px] font-bold text-white">GPS LIVE</span>
        </div>
      ) : (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-red-600/90 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white">GPS CACHED</span>
        </div>
      )}

      {/* Simulated label */}
      <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
        Simulated Tracking
      </div>

      {/* Offline glass overlay */}
      {session.isOffline && (
        <OfflineMapOverlay
          lastUpdated={session.lastSyncedTime}
          pendingSyncCount={session.pendingSyncCount}
        />
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          animate={{ width: `${progressPct * 100}%` }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
