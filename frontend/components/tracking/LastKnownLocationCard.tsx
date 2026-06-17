"use client";

/**
 * components/tracking/LastKnownLocationCard.tsx
 * Last known GPS position with coordinates, accuracy, and timestamp
 * Sprint 7 — DriveLink AI
 */

import * as React from "react";
import { MapPin, Crosshair } from "lucide-react";
import { cn } from "@/lib/cn";
import { TrackingSession } from "@/types/tracking";

interface LastKnownLocationCardProps {
  session: TrackingSession;
  className?: string;
}

export function LastKnownLocationCard({ session, className }: LastKnownLocationCardProps) {
  const lastPoint = session.routeHistory[session.routeHistory.length - 1];
  const accuracy = lastPoint?.accuracy ?? 5;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Crosshair className="h-4 w-4 text-primary" />
        </div>
        <span className="text-xs font-bold text-foreground">Last Known Position</span>
      </div>

      <div className="rounded-xl bg-muted/40 border border-border/50 p-3 font-mono text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-foreground">
              {session.currentLat.toFixed(5)}° N
            </p>
            <p className="font-bold text-foreground">
              {session.currentLng.toFixed(5)}° E
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-muted/30 p-2.5">
          <p className="text-[9px] text-muted-foreground uppercase font-bold">Accuracy</p>
          <p className="font-bold text-foreground mt-0.5">±{accuracy}m</p>
        </div>
        <div className="rounded-xl bg-muted/30 p-2.5">
          <p className="text-[9px] text-muted-foreground uppercase font-bold">Heading</p>
          <p className="font-bold text-foreground mt-0.5">{Math.round(session.heading)}°</p>
        </div>
        <div className="rounded-xl bg-muted/30 p-2.5">
          <p className="text-[9px] text-muted-foreground uppercase font-bold">Updated</p>
          <p className="font-bold text-foreground mt-0.5" suppressHydrationWarning>
            {new Date(session.lastUpdated).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <div className="rounded-xl bg-muted/30 p-2.5">
          <p className="text-[9px] text-muted-foreground uppercase font-bold">Points</p>
          <p className="font-bold text-foreground mt-0.5">{session.routeHistory.length}</p>
        </div>
      </div>
    </div>
  );
}
