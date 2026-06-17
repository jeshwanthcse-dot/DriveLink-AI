/**
 * Shared delivery types
 * Used across both driver and organization portals
 */

export type DeliveryPriority = "standard" | "express" | "overnight";
export type VehicleType = "motorcycle" | "van" | "truck" | "heavy_truck";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface CargoDetails {
  description: string;
  weight: number; // kg
  dimensions?: { length: number; width: number; height: number }; // cm
  fragile: boolean;
  requiresRefrigeration: boolean;
}

export interface DeliverySummary {
  id: string;
  deliveryNumber: string;
  status: string;
  pickup: DeliveryAddress;
  dropoff: DeliveryAddress;
  cargo: CargoDetails;
  priority: DeliveryPriority;
  distance: number; // km
  scheduledAt: string;
  completedAt?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  badge?: number;
}
