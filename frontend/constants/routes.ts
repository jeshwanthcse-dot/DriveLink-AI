export const ROUTES = {
  // Marketing
  home: "/",
  features: "/features",
  howItWorks: "/how-it-works",
  drivers: "/drivers",
  organizations: "/organizations",
  contact: "/contact",
  faq: "/faq",

  // Driver portal
  driver: {
    dashboard: "/driver/dashboard",
    deliveries: "/driver/deliveries",
    completed: "/driver/completed",
    profile: "/driver/profile",
    ratings: "/driver/ratings",
    ai: "/driver/ai",
    settings: "/driver/settings",
  },

  // Organization portal
  organization: {
    dashboard: "/organization/dashboard",
    createDelivery: "/organization/create-delivery",
    deliveries: "/organization/deliveries",
    tracking: "/organization/tracking",
    drivers: "/organization/drivers",
    analytics: "/organization/analytics",
    ai: "/organization/ai",
    settings: "/organization/settings",
  },
} as const;

