"use client";

import * as React from "react";
import "maplibre-gl/dist/maplibre-gl.css";

// Declare style URLs for light/dark premium open-source tiles
const STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const STYLE_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export interface MapViewProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  theme?: "light" | "dark";
  className?: string;
  onMapLoad?: (map: any) => void;
  children?: React.ReactNode;
}

export const MapContext = React.createContext<{ map: any | null }>({ map: null });

export default function MapView({
  center,
  zoom = 13,
  theme = "dark",
  className = "w-full h-full min-h-[400px]",
  onMapLoad,
  children,
}: MapViewProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let mapInstance: any = null;

    // Load maplibre-gl dynamically to avoid server-side execution errors
    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (!mapContainerRef.current) return;

      const styleUrl = theme === "dark" ? STYLE_DARK : STYLE_LIGHT;

      mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center: center,
        zoom: zoom,
        attributionControl: false,
      });

      // Add zoom and rotation controls
      mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

      mapInstance.on("load", () => {
        setMap(mapInstance);
        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
      });
    }).catch(console.error);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Update center when props change
  React.useEffect(() => {
    if (map) {
      map.easeTo({ center, duration: 800 });
    }
  }, [center, map]);

  return (
    <div className="relative w-full h-full min-h-0">
      <div ref={mapContainerRef} className={className} style={{ width: "100%", height: "100%" }} />
      {map && (
        <MapContext.Provider value={{ map }}>
          {children}
        </MapContext.Provider>
      )}
    </div>
  );
}
