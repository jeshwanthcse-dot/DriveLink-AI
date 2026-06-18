"use client";

/**
 * components/maps/LiveMap.tsx
 * Primary map component — migrated completely from Google Maps to MapLibre GL JS (OSM / OSRM)
 * Sprint 16 — DriveLink AI
 *
 * Wraps LiveTrackingMap for absolute backward compatibility.
 */

import * as React from "react";
import { TrackingSession } from "@/types/tracking";
import LiveTrackingMap from "./LiveTrackingMap";

interface LiveMapProps {
  session: TrackingSession;
  showControls?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export function LiveMap({
  session,
  showControls = true,
  className,
  theme = "dark",
}: LiveMapProps) {
  return (
    <LiveTrackingMap
      session={session}
      showControls={showControls}
      className={className}
      theme={theme}
    />
  );
}
