"use client";

/**
 * components/maps/LiveMap.tsx
 * Primary map component — Google Maps with SVGFallbackMap fallback
 * Sprint 8 — DriveLink AI
 *
 * If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set → loads real Google Maps.
 * Otherwise → renders SVGFallbackMap with full feature parity.
 * Supports offline simulation: freezes marker coordinates and displays glass overlays.
 */

import * as React from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { TrackingSession } from "@/types/tracking";
import { SVGFallbackMap } from "@/components/maps/SVGFallbackMap";
import { OfflineMapOverlay } from "@/components/offline/OfflineMapOverlay";
import { cn } from "@/lib/cn";

interface LiveMapProps {
  session: TrackingSession;
  showControls?: boolean;
  className?: string;
}

// ─── Google Maps Sub-components (rendered only when API is available) ─────────

function GoogleMapsView({ session }: { session: TrackingSession }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const polylineRef = React.useRef<google.maps.Polyline | null>(null);
  const pickupMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const dropMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Initialize Google Maps
  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    setOptions({
      key: apiKey,
      v: "weekly",
    });

    Promise.all([
      importLibrary("maps"),
      importLibrary("marker"),
    ]).then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: session.currentLat, lng: session.currentLng },
        zoom: 13,
        mapTypeId: "roadmap",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });

      mapInstanceRef.current = map;

      // Pickup marker (green)
      pickupMarkerRef.current = new google.maps.Marker({
        position: { lat: session.pickupLat, lng: session.pickupLng },
        map,
        title: "Pickup Location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
              <ellipse cx="18" cy="41" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
              <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#16A34A"/>
              <circle cx="18" cy="18" r="8" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 44),
          anchor: new google.maps.Point(18, 44),
        },
      });

      // Drop marker (purple)
      dropMarkerRef.current = new google.maps.Marker({
        position: { lat: session.dropLat, lng: session.dropLng },
        map,
        title: "Destination",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
              <ellipse cx="18" cy="41" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
              <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#7C3AED"/>
              <circle cx="18" cy="18" r="8" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 44),
          anchor: new google.maps.Point(18, 44),
        },
      });

      // Driver marker (blue truck)
      markerRef.current = new google.maps.Marker({
        position: { lat: session.currentLat, lng: session.currentLng },
        map,
        title: session.driverName,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#2563EB" opacity="0.15"/>
              <circle cx="20" cy="20" r="14" fill="#2563EB"/>
              <text x="20" y="25" text-anchor="middle" font-size="14" fill="white">🚛</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        },
        animation: google.maps.Animation.DROP,
      });

      // Route polyline
      polylineRef.current = new google.maps.Polyline({
        path: [{ lat: session.currentLat, lng: session.currentLng }],
        geodesic: true,
        strokeColor: "#2563EB",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map,
      });

      setIsLoaded(true);
    }).catch(console.error);

    return () => {
      markerRef.current?.setMap(null);
      pickupMarkerRef.current?.setMap(null);
      dropMarkerRef.current?.setMap(null);
      polylineRef.current?.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker and polyline on every position change (freeze if offline)
  React.useEffect(() => {
    if (!isLoaded || !markerRef.current || !polylineRef.current || !mapInstanceRef.current) return;

    // Use last synced coordinates if driver went offline to freeze position representation
    const lat = session.isOffline ? (session.lastSyncedLat ?? session.currentLat) : session.currentLat;
    const lng = session.isOffline ? (session.lastSyncedLng ?? session.currentLng) : session.currentLng;

    const newPos = new google.maps.LatLng(lat, lng);
    markerRef.current.setPosition(newPos);

    if (!session.isOffline) {
      const path = polylineRef.current.getPath();
      path.push(newPos);
    }

    // Pan to keep driver centered
    mapInstanceRef.current.panTo(newPos);
  }, [session.currentLat, session.currentLng, session.isOffline, session.lastSyncedLat, session.lastSyncedLng, isLoaded]);

  return (
    <div ref={mapRef} className="absolute inset-0 w-full h-full" />
  );
}

// ─── LiveMap ──────────────────────────────────────────────────────────────────

export function LiveMap({ session, showControls = true, className }: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasApiKey = !!apiKey && apiKey.trim() !== "" && apiKey !== "your_key_here";

  if (hasApiKey) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl", className)} style={{ aspectRatio: "16/9" }}>
        <GoogleMapsView session={session} />

        {/* Overlay stats */}
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

        {/* GPS Live badge / Offline indicator */}
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

  // Fallback to animated SVG map
  return <SVGFallbackMap session={session} showControls={showControls} className={className} />;
}
