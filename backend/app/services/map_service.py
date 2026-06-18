import math
import structlog
import httpx
from app.config.settings import settings

logger = structlog.get_logger("app.services.map_service")


class MapService:
    """Service class handling routing, geocoding, and optimization using OpenRouteService, OSRM, and Nominatim."""

    def __init__(self) -> None:
        self.user_agent = "DriveLink-AI/1.0"

    def get_route(
        self, start_coords: tuple[float, float], end_coords: tuple[float, float]
    ) -> dict:
        """
        Calculates routing geometry (encoded polyline), distance in km, and duration in minutes.
        Priority: OpenRouteService (if key configured) -> OSRM Public API -> Fallback straight-line
        """
        start_lat, start_lng = start_coords
        end_lat, end_lng = end_coords

        # 1. Attempt OpenRouteService if API Key exists
        api_key = settings.OPENROUTE_API_KEY
        if api_key and api_key.strip():
            try:
                url = "https://api.openrouteservice.org/v2/directions/driving-car"
                headers = {
                    "Authorization": api_key,
                    "Content-Type": "application/json",
                    "User-Agent": self.user_agent,
                }
                body = {
                    "coordinates": [[start_lng, start_lat], [end_lng, end_lat]]
                }
                logger.info("requesting_ors_route", start=start_coords, end=end_coords)
                with httpx.Client(timeout=5.0) as client:
                    response = client.post(url, json=body, headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        route = data["routes"][0]
                        distance_km = route["summary"]["distance"] / 1000.0
                        duration_min = route["summary"]["duration"] / 60.0
                        polyline = route["geometry"]
                        return {
                            "polyline": polyline,
                            "distance_km": round(distance_km, 2),
                            "duration_min": round(duration_min, 1),
                        }
                    else:
                        logger.warning(
                            "ors_route_failed_status",
                            status=response.status_code,
                            content=response.text,
                        )
            except Exception as e:
                logger.error("ors_route_exception", error=str(e))

        # 2. Fallback to OSRM Public API (Requires no key)
        try:
            url = f"https://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
            params = {
                "overview": "full",
                "geometries": "polyline",  # returns encoded polyline
            }
            logger.info("requesting_osrm_route", start=start_coords, end=end_coords)
            headers = {"User-Agent": self.user_agent}
            with httpx.Client(timeout=5.0) as client:
                response = client.get(url, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("routes"):
                        route = data["routes"][0]
                        distance_km = route["distance"] / 1000.0
                        duration_min = route["duration"] / 60.0
                        polyline = route["geometry"]
                        return {
                            "polyline": polyline,
                            "distance_km": round(distance_km, 2),
                            "duration_min": round(duration_min, 1),
                        }
                    else:
                        logger.warning("osrm_route_empty", content=response.text)
                else:
                    logger.warning("osrm_route_failed_status", status=response.status_code)
        except Exception as e:
            logger.error("osrm_route_exception", error=str(e))

        # 3. Offline/Extreme Fallback: Geodesic straight-line route
        logger.warning("map_service_falling_back_to_haversine", start=start_coords, end=end_coords)
        dist_km = self.calculate_distance(start_coords, end_coords)
        # Mock average speed of 45 km/h
        duration_min = (dist_km / 45.0) * 60.0
        
        # Build simple fake polyline string (mock encoded polyline or raw path coordinates representation)
        # For simplicity, returning coordinates path or simple encoded placeholder
        # An encoded polyline for straight line:
        polyline = "_ibE_ibE_ibE_ibE" # small mock placeholder
        return {
            "polyline": polyline,
            "distance_km": round(dist_km, 2),
            "duration_min": round(duration_min, 1),
        }

    def calculate_eta(
        self, start_coords: tuple[float, float], end_coords: tuple[float, float], avg_speed_kmh: float | None = None
    ) -> float:
        """Calculates estimated travel time in minutes between two coordinates."""
        route = self.get_route(start_coords, end_coords)
        if avg_speed_kmh and avg_speed_kmh > 5.0:
            distance_km = route["distance_km"]
            return round((distance_km / avg_speed_kmh) * 60.0, 1)
        return route["duration_min"]

    def calculate_distance(
        self, start_coords: tuple[float, float], end_coords: tuple[float, float]
    ) -> float:
        """Calculates distance in kilometers between two coordinates using Haversine formula."""
        lat1, lon1 = start_coords
        lat2, lon2 = end_coords

        R = 6371.0  # Earth's radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def reverse_geocode(self, lat: float, lng: float) -> str:
        """Resolves latitude/longitude coordinates into a human-readable address using OSM Nominatim."""
        url = "https://nominatim.openstreetmap.org/reverse"
        params = {
            "format": "json",
            "lat": lat,
            "lon": lng,
            "addressdetails": 1,
        }
        headers = {"User-Agent": self.user_agent}
        logger.info("requesting_reverse_geocode", lat=lat, lng=lng)
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(url, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    display_name = data.get("display_name")
                    if display_name:
                        return display_name
        except Exception as e:
            logger.error("reverse_geocode_failed", error=str(e))

        return f"Lat: {lat:.6f}, Lng: {lng:.6f}"

    def geocode(self, address: str) -> dict | None:
        """Resolves a text address to latitude/longitude using OSM Nominatim geocoding."""
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "format": "json",
            "q": address,
            "limit": 1,
        }
        headers = {"User-Agent": self.user_agent}
        logger.info("requesting_forward_geocode", address=address)
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(url, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if data:
                        return {
                            "lat": float(data[0]["lat"]),
                            "lon": float(data[0]["lon"]),
                            "display_name": data[0]["display_name"],
                        }
        except Exception as e:
            logger.error("forward_geocode_failed", error=str(e))
        return None

    def optimize_multi_stop_route(
        self, start: tuple[float, float], stops: list[tuple[float, float]]
    ) -> list[int]:
        """
        Sorts the stops in an optimized sequence order.
        Uses a nearest-neighbor TSP solver to avoid network-sensitive routing delays.
        Returns a list of original stop indices in the optimized order.
        """
        if not stops:
            return []

        remaining = list(enumerate(stops))  # list of (original_index, coords)
        optimized_indices = []
        current_coords = start

        while remaining:
            closest_idx = 0
            closest_dist = float("inf")
            for i, (orig_idx, coords) in enumerate(remaining):
                dist = self.calculate_distance(current_coords, coords)
                if dist < closest_dist:
                    closest_dist = dist
                    closest_idx = i
            
            orig_idx, coords = remaining.pop(closest_idx)
            optimized_indices.append(orig_idx)
            current_coords = coords

        return optimized_indices


# Global instanced map service
map_service = MapService()
