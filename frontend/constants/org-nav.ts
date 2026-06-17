/**
 * Organization portal navigation items and mock data
 */

import type { OrgStats, DeliveryRequest, Organization, TrackingPoint } from "@/types/organization";

export interface SidebarNavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: number;
}

export const ORG_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "/organization/dashboard", iconName: "LayoutDashboard" },
  { label: "Create Delivery", href: "/organization/create-delivery", iconName: "PlusCircle" },
  { label: "Active Deliveries", href: "/organization/deliveries", iconName: "Package", badge: 2 },
  { label: "Tracking", href: "/organization/tracking", iconName: "MapPin" },
  { label: "Drivers", href: "/organization/drivers", iconName: "Users" },
  { label: "Analytics", href: "/organization/analytics", iconName: "BarChart3" },
  { label: "AI Assistant", href: "/organization/ai", iconName: "Sparkles" },
  { label: "Settings", href: "/organization/settings", iconName: "Settings" },
  { label: "Support", href: "#support", iconName: "HelpCircle" },
];

// ─── Mock Organization ────────────────────────────────────────────────────────

export const MOCK_ORGANIZATION: Organization = {
  id: "org_001",
  name: "FreshMart Retail",
  email: "logistics@freshmart.com",
  phone: "+1 (555) 987-6543",
  avatarInitials: "FM",
  industry: "Retail & Grocery",
  address: "12 Warehouse Lane, Bengaluru 560001",
  totalRequests: 187,
  activeRequests: 4,
  joinedAt: "2023-08-20",
};

// ─── Mock Stats ───────────────────────────────────────────────────────────────

export const MOCK_ORG_STATS: OrgStats = {
  totalDeliveries: 187,
  activeDeliveries: 4,
  completedThisMonth: 31,
  totalSpend: 94200,
  averageDriverRating: 4.8,
  onTimeDeliveryRate: 96,
};

// ─── Mock Delivery Requests ───────────────────────────────────────────────────

export const MOCK_DELIVERY_REQUESTS: DeliveryRequest[] = [
  {
    id: "req_201",
    deliveryNumber: "DLV-7823",
    pickupAddress: "12 Warehouse Lane, Bengaluru 560001",
    dropoffAddress: "88 Koramangala 5th Block, Bengaluru 560034",
    cargoDescription: "Grocery packages – 8 boxes",
    weight: 45,
    scheduledAt: "2026-06-16T10:00:00Z",
    status: "in_transit",
    assignedDriverName: "James Okafor",
    assignedDriverRating: 4.9,
    estimatedCost: 380,
    distance: 12.4,
    createdAt: "2026-06-15T16:00:00Z",
  },
  {
    id: "req_202",
    deliveryNumber: "DLV-7828",
    pickupAddress: "45 Industrial Area, Whitefield, Bengaluru 560066",
    dropoffAddress: "23 Jayanagar 4th Block, Bengaluru 560041",
    cargoDescription: "Medical supplies – temperature sensitive",
    weight: 20,
    scheduledAt: "2026-06-16T14:00:00Z",
    status: "matched",
    assignedDriverName: "Priya Sharma",
    assignedDriverRating: 4.7,
    estimatedCost: 520,
    distance: 18.7,
    createdAt: "2026-06-15T18:00:00Z",
  },
  {
    id: "req_203",
    deliveryNumber: "DLV-7831",
    pickupAddress: "7 Electronics City Phase 1, Bengaluru 560100",
    dropoffAddress: "15 MG Road, Bengaluru 560001",
    cargoDescription: "Office furniture – 3 pieces",
    weight: 85,
    scheduledAt: "2026-06-17T09:00:00Z",
    status: "posted",
    estimatedCost: 720,
    distance: 22.1,
    createdAt: "2026-06-16T08:00:00Z",
  },
  {
    id: "req_204",
    deliveryNumber: "DLV-7832",
    pickupAddress: "32 HSR Layout, Bengaluru 560102",
    dropoffAddress: "10 Indiranagar 100ft Road, Bengaluru 560038",
    cargoDescription: "Restaurant supplies – perishables",
    weight: 18,
    scheduledAt: "2026-06-17T11:00:00Z",
    status: "posted",
    estimatedCost: 240,
    distance: 8.2,
    createdAt: "2026-06-16T09:00:00Z",
  },
  {
    id: "req_195",
    deliveryNumber: "DLV-7810",
    pickupAddress: "56 Peenya Industrial Area, Bengaluru 560058",
    dropoffAddress: "3 Bannerghatta Road, Bengaluru 560076",
    cargoDescription: "Construction materials",
    weight: 120,
    scheduledAt: "2026-06-14T14:00:00Z",
    status: "delivered",
    assignedDriverName: "Ravi Kumar",
    assignedDriverRating: 4.8,
    estimatedCost: 890,
    distance: 31.5,
    createdAt: "2026-06-13T10:00:00Z",
  },
];

// ─── Mock Tracking Data ───────────────────────────────────────────────────────

export const MOCK_TRACKING_POINTS: TrackingPoint[] = [
  {
    lat: 12.9716,
    lng: 77.5946,
    timestamp: "2026-06-16T10:00:00Z",
    speed: 0,
    eta: "45 min",
    distanceRemaining: 12.4,
  },
  {
    lat: 12.9752,
    lng: 77.6008,
    timestamp: "2026-06-16T10:10:00Z",
    speed: 42,
    eta: "34 min",
    distanceRemaining: 9.8,
  },
  {
    lat: 12.9802,
    lng: 77.6124,
    timestamp: "2026-06-16T10:20:00Z",
    speed: 38,
    eta: "22 min",
    distanceRemaining: 6.2,
  },
];

// ─── Mock FAQ Data ────────────────────────────────────────────────────────────

export const MOCK_FAQ_ITEMS = [
  {
    id: "faq_1",
    question: "How does AI driver matching work?",
    answer:
      "Our AI engine ranks all available drivers using a weighted formula: 40% rating, 30% distance, 20% experience, and 10% completed deliveries. The top-ranked drivers are notified instantly, and the first to accept gets the delivery automatically — no manual approval needed.",
  },
  {
    id: "faq_2",
    question: "What happens if a driver goes offline mid-delivery?",
    answer:
      "DriveLink AI has built-in offline sync. The driver app continues logging GPS coordinates, delivery status, and photos locally. Everything syncs automatically when connectivity is restored. The organization dashboard shows 'Device Offline' with the last known location.",
  },
  {
    id: "faq_3",
    question: "How is proof of delivery captured?",
    answer:
      "Drivers upload a delivery photo directly from the app. GPS coordinates and a timestamp are automatically embedded — no OTP or digital signature required. This makes the process fast and friction-free while keeping records audit-ready.",
  },
  {
    id: "faq_4",
    question: "Can I track multiple deliveries at once?",
    answer:
      "Yes. The organization dashboard shows all active deliveries on a live map. You can switch between deliveries and view real-time metrics including speed, ETA, and distance remaining for each one.",
  },
  {
    id: "faq_5",
    question: "Are drivers and organizations verified?",
    answer:
      "Every driver goes through a verification process including license checks and vehicle validation. Organizations are vetted during onboarding. The mutual rating system keeps quality high across the platform over time.",
  },
  {
    id: "faq_6",
    question: "What is the AI Assistant?",
    answer:
      "Each portal has a separate, scoped AI copilot. The Driver AI can answer questions about your deliveries, ratings, and earnings. The Organization AI provides insights about your delivery history, driver performance, and operational reports. There is zero shared memory between them.",
  },
];
