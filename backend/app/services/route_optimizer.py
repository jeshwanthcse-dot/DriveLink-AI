import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.delivery import Delivery
from app.schemas.ai import OptimizedDelivery
from app.services.map_service import map_service


class RouteOptimizationEngine:
    """Modular optimization engine sorting multiple delivery stops using the open-source map service (Sprint 16)."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def optimize_route(
        self,
        pickup: str,
        drop: str,
        delivery_ids: list[uuid.UUID],
        priority: str | None = "medium",
    ) -> dict:
        """Geocodes and optimizes route stops sequence using the map service."""
        deliveries = self.db.scalars(
            select(Delivery).where(Delivery.id.in_(delivery_ids))
        ).all()

        # Geocode pickup and drop coordinates
        start_coords = (12.9716, 77.5946)  # Default fallback
        geo_pickup = map_service.geocode(pickup)
        if geo_pickup:
            start_coords = (geo_pickup["lat"], geo_pickup["lon"])

        # Geocode each delivery destination coordinate
        stop_coords_list = []
        delivery_map = {}
        for d in deliveries:
            coords = (12.9279, 77.6271)  # Default fallback
            geo_d_drop = map_service.geocode(d.drop_location)
            if geo_d_drop:
                coords = (geo_d_drop["lat"], geo_d_drop["lon"])
            stop_coords_list.append(coords)
            delivery_map[coords] = d

        # Call nearest-neighbor route optimizer
        sorted_indices = map_service.optimize_multi_stop_route(start_coords, stop_coords_list)

        optimized_order = []
        total_dist = 0.0
        total_duration = 0.0
        current_loc = start_coords

        for seq, idx in enumerate(sorted_indices, start=1):
            coords = stop_coords_list[idx]
            d = delivery_map[coords]

            # Get actual driving route
            route = map_service.get_route(current_loc, coords)
            dist = route["distance_km"]
            duration = route["duration_min"]

            total_dist += dist
            total_duration += duration
            current_loc = coords

            optimized_order.append(
                OptimizedDelivery(
                    delivery_id=d.id,
                    sequence=seq,
                    pickup_location=d.pickup_location,
                    drop_location=d.drop_location,
                    estimated_distance_km=dist,
                    estimated_duration_min=duration,
                )
            )

        # Geocode final drop
        final_coords = start_coords
        geo_drop = map_service.geocode(drop)
        if geo_drop:
            final_coords = (geo_drop["lat"], geo_drop["lon"])

        # Add routing distance back to the final terminal drop location
        final_route = map_service.get_route(current_loc, final_coords)
        total_dist += final_route["distance_km"]
        total_duration += final_route["duration_min"]

        return {
            "optimized_delivery_order": optimized_order,
            "total_estimated_distance_km": round(total_dist, 2),
            "total_estimated_duration_min": round(total_duration, 2),
        }
