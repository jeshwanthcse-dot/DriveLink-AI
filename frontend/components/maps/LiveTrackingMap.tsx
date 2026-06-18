"use client";

import * as React from "react";
import { TrackingSession } from "@/types/tracking";
import MapView from "./MapView";
import DriverMarker from "./DriverMarker";
import DeliveryMarker from "./DeliveryMarker";
import RoutePolyline from "./RoutePolyline";
import MapLegend from "./MapLegend";
import { OfflineMapOverlay } from "@/components/offline/OfflineMapOverlay";
import { cn } from "@/lib/cn";

interface LiveTrackingMapProps {
  session: TrackingSession;
  showControls?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export default function LiveTrackingMap({
  session,
  showControls = true,
  className,
  theme = "dark",
}: LiveTrackingMapProps) {
  // Use last synced coordinates if driver went offline to freeze representation
  const lat = session.isOffline ? (session.lastSyncedLat ?? session.currentLat) : session.currentLat;
  const lng = session.isOffline ? (session.lastSyncedLng ?? session.currentLng) : session.currentLng;

  // Build the breadcrumb line coordinates list
  const historyCoords: [number, number][] = React.useMemo(() => {
    const coords: [number, number][] = [[session.pickupLng, session.pickupLat]];
    
    // Add breadcrumb trail
    if (session.routeHistory && session.routeHistory.length > 0) {
      session.routeHistory.forEach((pt) => {
        coords.push([pt.lng, pt.lat]);
      });
    }

    // Add current location
    coords.push([lng, lat]);
    return coords;
  }, [session.pickupLat, session.pickupLng, session.routeHistory, lat, lng]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950", className)} style={{ aspectRatio: "16/9" }}>
      {/* Dynamic MapLibre Map Container */}
      <MapView center={[lng, lat]} zoom={13} theme={theme}>
        {/* Render Pickup location Pin */}
        <DeliveryMarker lat={session.pickupLat} lng={session.pickupLng} type="pickup" label="Pickup Location" />
        
        {/* Render Drop destination Pin */}
        <DeliveryMarker lat={session.dropLat} lng={session.dropLng} type="drop" label="Destination" />
        
        {/* Render Live Driver Truck Pin */}
        <DriverMarker 
          lat={lat} 
          lng={lng} 
          driverName={session.driverName} 
          heading={session.heading} 
          isOffline={session.isOffline} 
        />
        
        {/* Render Routing Polyline Path */}
        <RoutePolyline coordinates={historyCoords} color={session.isOffline ? "#64748B" : "#2563EB"} width={4} id="live-route" />
        
        {/* Map UI Legend Overlay */}
        <MapLegend />
      </MapView>

      {/* Dynamic Bottom Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 shadow-elevated backdrop-blur-sm border border-border/40 z-10">
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
        </div>
      )}

      {/* GPS Status Badges */}
      {!session.isOffline ? (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-2.5 py-1 backdrop-blur-sm z-10">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white">GPS LIVE</span>
        </div>
      ) : (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-red-600/90 px-2.5 py-1 backdrop-blur-sm z-10">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white">GPS CACHED</span>
        </div>
      )}

      {/* Offline Glass overlay screen */}
      {session.isOffline && (
        <OfflineMapOverlay
          lastUpdated={session.lastSyncedTime}
          pendingSyncCount={session.pendingSyncCount}
        />
      )}
    </div>
  );
}
