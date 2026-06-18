"use client";

import * as React from "react";
import { MapContext } from "./MapView";

interface DeliveryMarkerProps {
  lat: number;
  lng: number;
  type: "pickup" | "drop";
  label?: string;
}

export default function DeliveryMarker({
  lat,
  lng,
  type,
  label,
}: DeliveryMarkerProps) {
  const { map } = React.useContext(MapContext);
  const markerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!map) return;

    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (!map) return;

      const el = document.createElement("div");
      el.className = "delivery-marker-container flex flex-col items-center justify-center";

      const pinColor = type === "pickup" ? "#16A34A" : "#7C3AED";
      const icon = type === "pickup" ? "📥" : "🏁";
      const markerText = label || (type === "pickup" ? "Pickup" : "Destination");

      el.innerHTML = `
        <div class="relative flex flex-col items-center justify-center" style="width: 36px; height: 44px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
            <ellipse cx="18" cy="41" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${pinColor}"/>
            <circle cx="18" cy="18" r="8" fill="white"/>
          </svg>
          <div class="absolute" style="top: 9px; font-size: 11px;">${icon}</div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20">
            ${markerText}
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "bottom",
      })
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
  }, [map, lat, lng, type, label]);

  return null;
}
