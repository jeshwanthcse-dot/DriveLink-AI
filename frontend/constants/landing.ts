import {
  Brain,
  Building2,
  Camera,
  MapPin,
  Radio,
  Shield,
  Sparkles,
  Truck,
  Users,
  WifiOff,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "DriveLink AI",
  tagline: "Smart Driver Matching. Intelligent Deliveries.",
  description:
    "DriveLink AI connects transport organizations with professional drivers using intelligent matching, real-time tracking, and seamless logistics coordination.",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Drivers", href: "/drivers" },
  { label: "For Organizations", href: "/organizations" },
  { label: "Contact", href: "/contact" },
] as const;


export const STATISTICS = [
  { value: "10K+", label: "Deliveries Completed", icon: Truck },
  { value: "5K+", label: "Verified Drivers", icon: Users },
  { value: "500+", label: "Organizations", icon: Building2 },
  { value: "99.2%", label: "Success Rate", icon: Shield },
] as const;

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Intelligent ranking weighs rating, distance, experience, and delivery history to find the perfect driver instantly.",
  },
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    description:
      "Real-time location, speed, ETA, and distance remaining — visible to organizations from pickup to drop-off.",
  },
  {
    icon: WifiOff,
    title: "Offline Sync",
    description:
      "Drivers keep working without connectivity. GPS, status, and photos sync automatically when back online.",
  },
  {
    icon: Camera,
    title: "Proof of Delivery",
    description:
      "Photo capture with automatic GPS and timestamp metadata. Simple, reliable, and audit-ready.",
  },
  {
    icon: Sparkles,
    title: "Dual AI Assistants",
    description:
      "Separate AI copilots for drivers and organizations — each scoped to their own data with zero shared memory.",
  },
  {
    icon: Radio,
    title: "Instant Notifications",
    description:
      "Push alerts when matches are found, deliveries accepted, and milestones reached — no manual follow-ups.",
  },
];

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    step: 1,
    title: "Create a Delivery",
    description:
      "Organizations post delivery requests with pickup, drop-off, and cargo details in seconds.",
  },
  {
    step: 2,
    title: "AI Finds the Best Match",
    description:
      "Our engine ranks qualified drivers by rating, proximity, experience, and completed deliveries.",
  },
  {
    step: 3,
    title: "First Accept Wins",
    description:
      "Top-ranked drivers are notified instantly. The first to accept is assigned — no manual approval.",
  },
  {
    step: 4,
    title: "Track in Real Time",
    description:
      "Live map tracking with ETA, speed, and route progress from pickup through final delivery.",
  },
  {
    step: 5,
    title: "Complete & Rate",
    description:
      "Drivers upload proof of delivery. Both parties rate each other to improve future matches.",
  },
];

export const AI_MATCHING_WEIGHTS = [
  { label: "Driver Rating", weight: 40, color: "bg-primary" },
  { label: "Distance", weight: 30, color: "bg-blue-400" },
  { label: "Experience", weight: 20, color: "bg-blue-300" },
  { label: "Completed Deliveries", weight: 10, color: "bg-blue-200" },
] as const;

export const TRACKING_METRICS = [
  "Latitude & Longitude",
  "Speed",
  "Timestamp",
  "ETA",
  "Distance Remaining",
] as const;

export const OFFLINE_CAPABILITIES = [
  "GPS coordinates",
  "Delivery status",
  "Progress updates",
  "Proof-of-delivery photos",
] as const;

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: "drivers" | "organizations" | "both";
}

export const BENEFITS: BenefitItem[] = [
  {
    icon: Zap,
    title: "Faster Assignments",
    description: "Eliminate hours of phone calls. AI matching assigns drivers in minutes, not days.",
    audience: "organizations",
  },
  {
    icon: Truck,
    title: "More Earnings",
    description: "Get matched to nearby jobs that fit your profile. Accept and go — no bidding wars.",
    audience: "drivers",
  },
  {
    icon: Shield,
    title: "Verified Network",
    description: "Every driver and organization is vetted. Ratings keep quality high across the platform.",
    audience: "both",
  },
  {
    icon: MapPin,
    title: "Full Visibility",
    description: "Organizations see every mile. Drivers see every detail. No blind spots in the supply chain.",
    audience: "both",
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "AI Matching", href: "/ai-matching" },
    { label: "Live Tracking", href: "/live-tracking" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "Updates", href: "/updates" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Press Kit", href: "/press-kit" },
    { label: "Partners", href: "/partners" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Data Processing", href: "/data-processing" },
    { label: "Licenses", href: "/licenses" },
  ],
} as const;
