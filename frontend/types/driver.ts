/**
 * Driver domain types
 * Used across driver portal pages and mock data
 */

export type DriverStatus = "available" | "on_delivery" | "offline";
export type DeliveryStatus = "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  status: DriverStatus;
  location?: { lat: number; lng: number };
  joinedAt: string;
  experience: number; // years
}

export interface DriverDelivery {
  id: string;
  deliveryNumber: string;
  organizationName: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number; // km
  estimatedEarnings: number;
  status: DeliveryStatus;
  acceptedAt?: string;
  completedAt?: string;
  cargoDescription: string;
  weight: number; // kg
}

export interface DriverRating {
  id: string;
  deliveryId: string;
  organizationName: string;
  rating: RatingValue;
  comment?: string;
  createdAt: string;
}

export interface DriverStats {
  totalDeliveries: number;
  completedThisMonth: number;
  totalEarnings: number;
  averageRating: number;
  acceptanceRate: number;
  onTimeRate: number;
}
