/**
 * Driver portal navigation items and mock data
 */

import type { DriverStats, DriverDelivery, DriverRating, Driver } from "@/types/driver";

// ─── Sidebar Navigation ───────────────────────────────────────────────────────

export interface SidebarNavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: number;
}

export const DRIVER_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "/driver/dashboard", iconName: "LayoutDashboard" },
  { label: "Available Deliveries", href: "/driver/deliveries", iconName: "Package", badge: 3 },
  { label: "Active Delivery", href: "/driver/active", iconName: "Activity" },
  { label: "Completed Deliveries", href: "/driver/completed", iconName: "CheckSquare" },
  { label: "Ratings", href: "/driver/ratings", iconName: "Star" },
  { label: "AI Assistant", href: "/driver/ai", iconName: "Sparkles" },
  { label: "Profile", href: "/driver/profile", iconName: "User" },
  { label: "Settings", href: "/driver/settings", iconName: "Settings" },
  { label: "Support", href: "#support", iconName: "HelpCircle" },
];

// ─── Mock Driver ──────────────────────────────────────────────────────────────

export const MOCK_DRIVER: Driver = {
  id: "drv_001",
  name: "James Okafor",
  email: "james.okafor@email.com",
  phone: "+1 (555) 234-5678",
  avatarInitials: "JO",
  licenseNumber: "DL-2024-88291",
  vehicleType: "Van",
  vehiclePlate: "KA 05 MJ 2234",
  rating: 4.9,
  totalDeliveries: 312,
  completedDeliveries: 304,
  status: "available",
  joinedAt: "2023-03-15",
  experience: 4,
};

// ─── Mock Stats ───────────────────────────────────────────────────────────────

export const MOCK_DRIVER_STATS: DriverStats = {
  totalDeliveries: 312,
  completedThisMonth: 28,
  totalEarnings: 18640,
  averageRating: 4.9,
  acceptanceRate: 94,
  onTimeRate: 97,
};

// ─── Mock Deliveries ──────────────────────────────────────────────────────────

export const MOCK_AVAILABLE_DELIVERIES: DriverDelivery[] = [
  {
    id: "del_101",
    deliveryNumber: "DLV-7823",
    organizationName: "FreshMart Retail",
    pickupAddress: "12 Warehouse Lane, Bengaluru 560001",
    dropoffAddress: "88 Koramangala 5th Block, Bengaluru 560034",
    distance: 12.4,
    estimatedEarnings: 380,
    status: "pending",
    cargoDescription: "Grocery packages – 8 boxes",
    weight: 45,
  },
  {
    id: "del_102",
    deliveryNumber: "DLV-7824",
    organizationName: "MediQuick Pharma",
    pickupAddress: "45 Industrial Area, Whitefield, Bengaluru 560066",
    dropoffAddress: "23 Jayanagar 4th Block, Bengaluru 560041",
    distance: 18.7,
    estimatedEarnings: 520,
    status: "pending",
    cargoDescription: "Medical supplies – temperature sensitive",
    weight: 20,
  },
  {
    id: "del_103",
    deliveryNumber: "DLV-7825",
    organizationName: "TechZone Electronics",
    pickupAddress: "7 Electronics City Phase 1, Bengaluru 560100",
    dropoffAddress: "15 MG Road, Bengaluru 560001",
    distance: 22.1,
    estimatedEarnings: 640,
    status: "pending",
    cargoDescription: "Laptop shipment – 12 units",
    weight: 36,
  },
];

export const MOCK_COMPLETED_DELIVERIES: DriverDelivery[] = [
  {
    id: "del_091",
    deliveryNumber: "DLV-7815",
    organizationName: "Urban Eats Co.",
    pickupAddress: "32 HSR Layout, Bengaluru 560102",
    dropoffAddress: "10 Indiranagar 100ft Road, Bengaluru 560038",
    distance: 8.2,
    estimatedEarnings: 240,
    status: "delivered",
    acceptedAt: "2026-06-14T09:30:00Z",
    completedAt: "2026-06-14T10:45:00Z",
    cargoDescription: "Restaurant supplies",
    weight: 18,
  },
  {
    id: "del_092",
    deliveryNumber: "DLV-7816",
    organizationName: "BuildRight Construction",
    pickupAddress: "56 Peenya Industrial Area, Bengaluru 560058",
    dropoffAddress: "3 Bannerghatta Road, Bengaluru 560076",
    distance: 31.5,
    estimatedEarnings: 890,
    status: "delivered",
    acceptedAt: "2026-06-13T14:00:00Z",
    completedAt: "2026-06-13T16:30:00Z",
    cargoDescription: "Construction materials",
    weight: 120,
  },
];

// ─── Mock Ratings ─────────────────────────────────────────────────────────────

export const MOCK_DRIVER_RATINGS: DriverRating[] = [
  {
    id: "rat_001",
    deliveryId: "del_091",
    organizationName: "Urban Eats Co.",
    rating: 5,
    comment: "Excellent driver! Delivered on time and handled cargo with care.",
    createdAt: "2026-06-14T11:00:00Z",
  },
  {
    id: "rat_002",
    deliveryId: "del_092",
    organizationName: "BuildRight Construction",
    rating: 5,
    comment: "Very professional. Great communication throughout.",
    createdAt: "2026-06-13T17:00:00Z",
  },
  {
    id: "rat_003",
    deliveryId: "del_089",
    organizationName: "FreshMart Retail",
    rating: 4,
    comment: "Good delivery, slight delay due to traffic.",
    createdAt: "2026-06-12T15:30:00Z",
  },
];
