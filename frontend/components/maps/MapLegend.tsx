"use client";

import * as React from "react";

export default function MapLegend() {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 rounded-xl bg-white/95 dark:bg-slate-900/95 px-3 py-2.5 shadow-elevated backdrop-blur-sm border border-border/40 z-10 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        Map Legend
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">📥</span>
        <span>Pickup Location</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">🏁</span>
        <span>Destination Drop</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">🚛</span>
        <span>Active Driver (Online)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">⚠️</span>
        <span>Offline / Emergency</span>
      </div>
      <div className="h-px bg-slate-200 dark:bg-slate-800 my-0.5" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
        <span>Active Polyline Route</span>
      </div>
    </div>
  );
}
