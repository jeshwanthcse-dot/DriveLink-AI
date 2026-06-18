"use client";

import * as React from "react";
import { MapContext } from "./MapView";

interface RoutePolylineProps {
  encodedPath?: string;
  coordinates?: [number, number][]; // [lng, lat][]
  color?: string;
  width?: number;
  id?: string;
}

// Built-in decoder for standard encoded polylines (Google format used by OSRM/ORS)
function decodePolyline(str: string): [number, number][] {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates: [number, number][] = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change;

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += latitude_change;

    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += longitude_change;

    coordinates.push([lng / 100000.0, lat / 100000.0]); // [lng, lat]
  }

  return coordinates;
}

export default function RoutePolyline({
  encodedPath,
  coordinates,
  color = "#2563EB",
  width = 5,
  id = "route-line",
}: RoutePolylineProps) {
  const { map } = React.useContext(MapContext);

  React.useEffect(() => {
    if (!map) return;

    // Determine coordinate set
    let pathCoords: [number, number][] = [];
    if (coordinates && coordinates.length > 0) {
      pathCoords = coordinates;
    } else if (encodedPath) {
      try {
        pathCoords = decodePolyline(encodedPath);
      } catch (e) {
        console.error("Failed to decode polyline path", e);
      }
    }

    if (pathCoords.length === 0) return;

    const sourceId = `source-${id}`;
    const layerId = `layer-${id}`;

    // Add source and layer to MapLibre
    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as any;
      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: pathCoords,
        },
      });
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: pathCoords,
          },
        },
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
          "line-opacity": 0.8,
        },
      });
    }

    return () => {
      // Safely cleanup layers and sources on unmount
      if (map) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      }
    };
  }, [map, encodedPath, coordinates, color, width, id]);

  return null;
}
