"use client";

import * as React from "react";
import { MapContext } from "./MapView";

interface DriverMarkerProps {
  lat: number;
  lng: number;
  driverName: string;
  heading?: number;
  isOffline?: boolean;
}

export default function DriverMarker({
  lat,
  lng,
  driverName,
  heading = 0,
  isOffline = false,
}: DriverMarkerProps) {
  const { map } = React.useContext(MapContext);
  const markerRef = React.useRef<any>(null);
  const elRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!map) return;

    // Load maplibre dynamically to get Marker class
    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (!map) return;

      // Create DOM element for custom styling
      const el = document.createElement("div");
      el.className = "driver-marker-container flex flex-col items-center justify-center";
      elRef.current = el;

      // Custom marker design (Blue vehicle pulse for online, gray for offline)
      const color = isOffline ? "#64748B" : "#2563EB";
      const badge = isOffline ? "⚠️" : "🚛";
      
      el.innerHTML = `
        <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
          <div class="absolute inset-0 rounded-full" style="background-color: ${color}; opacity: 0.2; transform: scale(1.4);"></div>
          <div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${color}; opacity: 0.15; animation-duration: 3s;"></div>
          <div class="relative flex items-center justify-center rounded-full shadow-md text-base" 
               style="width: 28px; height: 28px; background-color: ${color}; transform: rotate(${heading}deg); transition: transform 0.2s ease-out; border: 2px solid white; z-index: 10;">
            ${badge}
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
            ${driverName}
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markerRef.current = marker;
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Update marker properties on changes
  React.useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [lat, lng]);

  React.useEffect(() => {
    if (elRef.current) {
      const color = isOffline ? "#64748B" : "#2563EB";
      const badge = isOffline ? "⚠️" : "🚛";
      const innerMarker = elRef.current.querySelector(".relative.flex.items-center.justify-center.rounded-full");
      if (innerMarker) {
        (innerMarker as HTMLElement).style.transform = `rotate(${heading}deg)`;
        (innerMarker as HTMLElement).style.backgroundColor = color;
        (innerMarker as HTMLElement).innerHTML = badge;
      }
    }
  }, [heading, isOffline]);

  return null;
}
