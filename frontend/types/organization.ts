/**
 * Organization domain types
 * Used across organization portal pages and mock data
 */

export type OrgDeliveryStatus =
  | "draft"
  | "posted"
  | "matched"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  industry: string;
  address: string;
  totalRequests: number;
  activeRequests: number;
  joinedAt: string;
}

export interface DeliveryRequest {
  id: string;
  deliveryNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  cargoDescription: string;
  weight: number; // kg
  scheduledAt: string;
  status: OrgDeliveryStatus;
  assignedDriverName?: string;
  assignedDriverRating?: number;
  estimatedCost: number;
  distance: number; // km
  createdAt: string;
}

export interface OrgStats {
  totalDeliveries: number;
  activeDeliveries: number;
  completedThisMonth: number;
  totalSpend: number;
  averageDriverRating: number;
  onTimeDeliveryRate: number;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number; // km/h
  eta: string;
  distanceRemaining: number; // km
}
