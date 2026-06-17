import { DeliveryPriority, VehicleType } from "@/types/delivery";

export interface MockDelivery {
  id: string;
  deliveryNumber: string;
  pickup: string;
  drop: string;
  distance: number; // km
  weight: number; // kg
  vehicleType: VehicleType;
  payment: number; // USD
  priority: DeliveryPriority;
  driverId?: string | null;
  driverName?: string | null;
  organizationId: string;
  organizationName: string;
  cargoDescription?: string;
  status:
    | "draft"
    | "published"
    | "available"
    | "accepted"
    | "assigned"
    | "pickup_started"
    | "in_transit"
    | "near_destination"
    | "delivered"
    | "completed"
    | "rated"
    | "cancelled"
    | "pending";
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
  deliveryPhoto?: string | null;
}

export const mockDeliveries: MockDelivery[] = [
  {
    id: "JOB-1001",
    deliveryNumber: "DLV-987120",
    pickup: "Apex Dallas Terminal, TX",
    drop: "Houston Distribution Hub, TX",
    distance: 385.5,
    weight: 1250,
    vehicleType: "heavy_truck",
    payment: 620.0,
    priority: "express",
    driverId: "DRV-003",
    driverName: "Marcus Thompson",
    organizationId: "ORG-001",
    organizationName: "Apex Global Logistics",
    status: "in_transit",
    estimatedTime: "4 hrs 15 mins",
    createdAt: "2026-06-16T08:00:00Z",
    updatedAt: "2026-06-16T10:00:00Z"
  },
  {
    id: "JOB-1002",
    deliveryNumber: "DLV-987121",
    pickup: "Fresh Foods cold storage, Chicago, IL",
    drop: "Supermarket Plaza, Milwaukee, WI",
    distance: 148.2,
    weight: 450,
    vehicleType: "van",
    payment: 220.0,
    priority: "standard",
    driverId: "DRV-001",
    driverName: "David Miller",
    organizationId: "ORG-003",
    organizationName: "Fresh Foods Distribution",
    status: "accepted",
    estimatedTime: "2 hrs 5 mins",
    createdAt: "2026-06-16T09:15:00Z",
    updatedAt: "2026-06-16T09:30:00Z"
  },
  {
    id: "JOB-1003",
    deliveryNumber: "DLV-987122",
    pickup: "BioPharma Lab, SF, CA",
    drop: "Stanford Health Depot, Palo Alto, CA",
    distance: 52.8,
    weight: 25,
    vehicleType: "motorcycle",
    payment: 85.0,
    priority: "overnight",
    driverId: "DRV-009",
    driverName: "Emily Watson",
    organizationId: "ORG-002",
    organizationName: "BioPharma Express",
    status: "delivered",
    estimatedTime: "50 mins",
    createdAt: "2026-06-15T14:00:00Z",
    updatedAt: "2026-06-15T15:00:00Z",
    deliveryPhoto: "/assets/proofs/proof-003.jpg"
  },
  {
    id: "JOB-1004",
    deliveryNumber: "DLV-987123",
    pickup: "Metro Foundry, Pittsburgh, PA",
    drop: "Bridge Construction Site, Philadelphia, PA",
    distance: 490.5,
    weight: 4200,
    vehicleType: "heavy_truck",
    payment: 1250.0,
    priority: "standard",
    driverId: null,
    driverName: null,
    organizationId: "ORG-004",
    organizationName: "Metro Heavy Freight",
    status: "pending",
    estimatedTime: "5 hrs 45 mins",
    createdAt: "2026-06-16T11:00:00Z",
    updatedAt: "2026-06-16T11:00:00Z"
  },
  {
    id: "JOB-1005",
    deliveryNumber: "DLV-987124",
    pickup: "Apex Wholesale Center, Phoenix, AZ",
    drop: "Home Depot Retailer, Tempe, AZ",
    distance: 18.4,
    weight: 85,
    vehicleType: "van",
    payment: 45.0,
    priority: "standard",
    driverId: "DRV-008",
    driverName: "Li Wei",
    organizationId: "ORG-005",
    organizationName: "Apex Fasteners",
    status: "delivered",
    estimatedTime: "25 mins",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-15T10:30:00Z",
    deliveryPhoto: "/assets/proofs/proof-005.jpg"
  },
  {
    id: "JOB-1006",
    deliveryNumber: "DLV-987125",
    pickup: "Fresh Foods Depot, Houston, TX",
    drop: "Whole Foods Market, Austin, TX",
    distance: 260.8,
    weight: 850,
    vehicleType: "truck",
    payment: 380.0,
    priority: "express",
    driverId: "DRV-006",
    driverName: "Kofi Mensah",
    organizationId: "ORG-003",
    organizationName: "Fresh Foods Distribution",
    status: "in_transit",
    estimatedTime: "3 hrs 0 mins",
    createdAt: "2026-06-16T10:30:00Z",
    updatedAt: "2026-06-16T12:00:00Z"
  },
  {
    id: "JOB-1007",
    deliveryNumber: "DLV-987126",
    pickup: "BioPharma Depot, SF, CA",
    drop: "Kaiser Hospital, Oakland, CA",
    distance: 20.5,
    weight: 12,
    vehicleType: "motorcycle",
    payment: 60.0,
    priority: "express",
    driverId: "DRV-004",
    driverName: "Elena Rostova",
    organizationId: "ORG-002",
    organizationName: "BioPharma Express",
    status: "delivered",
    estimatedTime: "30 mins",
    createdAt: "2026-06-15T16:00:00Z",
    updatedAt: "2026-06-15T16:35:00Z",
    deliveryPhoto: "/assets/proofs/proof-007.jpg"
  },
  {
    id: "JOB-1008",
    deliveryNumber: "DLV-987127",
    pickup: "Metro Heavy Depot, Cleveland, OH",
    drop: "Machine Works, Toledo, OH",
    distance: 188.4,
    weight: 2300,
    vehicleType: "heavy_truck",
    payment: 550.0,
    priority: "standard",
    driverId: "DRV-007",
    driverName: "Carlos Santana",
    organizationId: "ORG-004",
    organizationName: "Metro Heavy Freight",
    status: "in_transit",
    estimatedTime: "2 hrs 15 mins",
    createdAt: "2026-06-16T11:30:00Z",
    updatedAt: "2026-06-16T12:30:00Z"
  },
  {
    id: "JOB-1009",
    deliveryNumber: "DLV-987128",
    pickup: "Apex Fasteners Depot, Phoenix, AZ",
    drop: "Contractor Storage, Tucson, AZ",
    distance: 182.5,
    weight: 350,
    vehicleType: "van",
    payment: 190.0,
    priority: "standard",
    driverId: null,
    driverName: null,
    organizationId: "ORG-005",
    organizationName: "Apex Fasteners",
    status: "pending",
    estimatedTime: "2 hrs 5 mins",
    createdAt: "2026-06-16T12:00:00Z",
    updatedAt: "2026-06-16T12:00:00Z"
  },
  {
    id: "JOB-1010",
    deliveryNumber: "DLV-987129",
    pickup: "Fresh Foods Warehouse, Dallas, TX",
    drop: "Kroger Grocery Store, Fort Worth, TX",
    distance: 52.3,
    weight: 600,
    vehicleType: "van",
    payment: 120.0,
    priority: "express",
    driverId: "DRV-001",
    driverName: "David Miller",
    organizationId: "ORG-003",
    organizationName: "Fresh Foods Distribution",
    status: "delivered",
    estimatedTime: "55 mins",
    createdAt: "2026-06-15T08:00:00Z",
    updatedAt: "2026-06-15T09:05:00Z",
    deliveryPhoto: "/assets/proofs/proof-010.jpg"
  },
  {
    id: "JOB-1011",
    deliveryNumber: "DLV-987130",
    pickup: "BioPharma Cold Storage, Seattle, WA",
    drop: "UW Medicine Pharmacy, Seattle, WA",
    distance: 12.4,
    weight: 8,
    vehicleType: "motorcycle",
    payment: 45.0,
    priority: "express",
    driverId: "DRV-008",
    driverName: "Li Wei",
    organizationId: "ORG-002",
    organizationName: "BioPharma Express",
    status: "delivered",
    estimatedTime: "20 mins",
    createdAt: "2026-06-14T09:00:00Z",
    updatedAt: "2026-06-14T09:20:00Z",
    deliveryPhoto: "/assets/proofs/proof-011.jpg"
  },
  {
    id: "JOB-1012",
    deliveryNumber: "DLV-987131",
    pickup: "Metro Steel Yard, Detroit, MI",
    drop: "Auto Parts Assembly, Flint, MI",
    distance: 108.5,
    weight: 3500,
    vehicleType: "heavy_truck",
    payment: 820.0,
    priority: "standard",
    driverId: null,
    driverName: null,
    organizationId: "ORG-004",
    organizationName: "Metro Heavy Freight",
    status: "pending",
    estimatedTime: "1 hr 35 mins",
    createdAt: "2026-06-16T12:45:00Z",
    updatedAt: "2026-06-16T12:45:00Z"
  },
  {
    id: "JOB-1013",
    deliveryNumber: "DLV-987132",
    pickup: "Apex Fasteners Depot, Phoenix, AZ",
    drop: "Contractor Storage, Mesa, AZ",
    distance: 28.5,
    weight: 120,
    vehicleType: "van",
    payment: 65.0,
    priority: "standard",
    driverId: "DRV-002",
    driverName: "Sarah Jenkins",
    organizationId: "ORG-005",
    organizationName: "Apex Fasteners",
    status: "accepted",
    estimatedTime: "35 mins",
    createdAt: "2026-06-16T13:00:00Z",
    updatedAt: "2026-06-16T13:05:00Z"
  },
  {
    id: "JOB-1014",
    deliveryNumber: "DLV-987133",
    pickup: "Fresh Foods Warehouse, Chicago, IL",
    drop: "Trader Joe's Retailer, Naperville, IL",
    distance: 45.2,
    weight: 380,
    vehicleType: "van",
    payment: 110.0,
    priority: "standard",
    driverId: null,
    driverName: null,
    organizationId: "ORG-003",
    organizationName: "Fresh Foods Distribution",
    status: "pending",
    estimatedTime: "50 mins",
    createdAt: "2026-06-16T13:30:00Z",
    updatedAt: "2026-06-16T13:30:00Z"
  },
  {
    id: "JOB-1015",
    deliveryNumber: "DLV-987134",
    pickup: "Apex Dallas Terminal, TX",
    drop: "Fort Worth Warehouses, TX",
    distance: 48.0,
    weight: 900,
    vehicleType: "truck",
    payment: 150.0,
    priority: "express",
    driverId: null,
    driverName: null,
    organizationId: "ORG-001",
    organizationName: "Apex Global Logistics",
    status: "pending",
    estimatedTime: "45 mins",
    createdAt: "2026-06-16T13:45:00Z",
    updatedAt: "2026-06-16T13:45:00Z"
  }
];
