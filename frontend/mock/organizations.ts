import { Organization } from "@/types/organization";

export interface MockOrganization extends Organization {
  companyName: string; // Add companyName alias for Sprint 2.5 requirements compatibility
  manager: string;
  logo: string;
  completedDeliveries: number;
  rating: number;
  phone: string;
}

export const mockOrganizations: MockOrganization[] = [
  {
    id: "ORG-001",
    name: "Apex Global Logistics",
    companyName: "Apex Global Logistics",
    email: "ops@apexlogistics.com",
    phone: "+1 (800) 555-0101",
    avatarInitials: "AG",
    industry: "Retail & E-commerce",
    address: "100 Logistics Blvd, Dallas, TX 75201",
    totalRequests: 240,
    activeRequests: 4,
    completedDeliveries: 236,
    rating: 4.8,
    manager: "John Davis",
    logo: "/assets/org-logos/apex.png",
    joinedAt: "2023-01-10T08:00:00Z"
  },
  {
    id: "ORG-002",
    name: "BioPharma Express",
    companyName: "BioPharma Express",
    email: "dispatch@biopharma.com",
    phone: "+1 (800) 555-0102",
    avatarInitials: "BP",
    industry: "Pharmaceuticals",
    address: "450 Science Dr, South San Francisco, CA 94080",
    totalRequests: 180,
    activeRequests: 2,
    completedDeliveries: 178,
    rating: 4.9,
    manager: "Dr. Alice Vance",
    logo: "/assets/org-logos/biopharma.png",
    joinedAt: "2023-05-15T09:00:00Z"
  },
  {
    id: "ORG-003",
    name: "Fresh Foods Distribution",
    companyName: "Fresh Foods Distribution",
    email: "coldchain@freshfoods.com",
    phone: "+1 (800) 555-0103",
    avatarInitials: "FF",
    industry: "Food & Grocery",
    address: "800 Produce Row, Chicago, IL 60608",
    totalRequests: 320,
    activeRequests: 5,
    completedDeliveries: 315,
    rating: 4.7,
    manager: "Robert Chen",
    logo: "/assets/org-logos/freshfoods.png",
    joinedAt: "2023-03-20T07:30:00Z"
  },
  {
    id: "ORG-004",
    name: "Metro Heavy Freight",
    companyName: "Metro Heavy Freight",
    email: "heavy@metrofreight.com",
    phone: "+1 (800) 555-0104",
    avatarInitials: "MF",
    industry: "Industrial & Manufacturing",
    address: "1200 Steel Mill Rd, Pittsburgh, PA 15201",
    totalRequests: 140,
    activeRequests: 3,
    completedDeliveries: 137,
    rating: 4.6,
    manager: "Bill Kowalski",
    logo: "/assets/org-logos/metro.png",
    joinedAt: "2023-08-01T10:00:00Z"
  },
  {
    id: "ORG-005",
    name: "Apex Fasteners",
    companyName: "Apex Fasteners",
    email: "shipping@apexfasteners.com",
    phone: "+1 (800) 555-0105",
    avatarInitials: "AF",
    industry: "Hardware Wholesale",
    address: "300 Industrial Parkway, Phoenix, AZ 85001",
    totalRequests: 95,
    activeRequests: 1,
    completedDeliveries: 94,
    rating: 4.75,
    manager: "Samantha Ortiz",
    logo: "/assets/org-logos/fasteners.png",
    joinedAt: "2023-11-12T11:00:00Z"
  }
];
