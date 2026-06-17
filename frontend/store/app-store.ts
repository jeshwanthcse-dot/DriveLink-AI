import { create } from "zustand";
import { Driver, DriverStatus } from "@/types/driver";
import { MockOrganization, mockOrganizations } from "@/mock/organizations";
import { MockDelivery, mockDeliveries } from "@/mock/deliveries";
import { mockDrivers } from "@/mock/drivers";
// Sprint 6: AI Matching Engine integration (import at call-site to avoid circular deps)
import { aiMatchingService } from "@/services/ai-matching-service";
import { useMatchingStore } from "@/store/matching-store";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning";
  portal: "driver" | "org";
}

interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  drivers: Driver[];
  organizations: MockOrganization[];
  deliveries: MockDelivery[];
  notifications: AppNotification[];
  currentDriverId: string;
  currentOrgId: string;
  
  // Basic Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentDriverId: (id: string) => void;
  setCurrentOrgId: (id: string) => void;
  addNotification: (title: string, message: string, portal: "driver" | "org", type?: "info" | "success" | "warning") => void;
  markNotificationsAsRead: (portal: "driver" | "org") => void;

  // Lifecycle Mutations
  addDelivery: (delivery: MockDelivery) => void;
  publishDelivery: (id: string) => void;
  acceptDelivery: (id: string, driverId: string, driverName: string) => void;
  rejectDelivery: (id: string) => void;
  startPickup: (id: string) => void;
  updateDeliveryStatus: (id: string, status: MockDelivery["status"]) => void;
  setDriverStatus: (id: string, status: DriverStatus) => void;
  submitDriverRating: (id: string, rating: number, comment?: string) => void;
  submitOrgRating: (id: string, rating: number, comment?: string) => void;

  // Sprint 6: AI Matching helpers
  /** Marks a delivery as having had its AI matching session triggered */
  markMatchingTriggered: (id: string) => void;
}

const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "System Active",
    message: "DriveLink AI matching engine is online and monitoring available drivers.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: "success",
    portal: "org",
  },
  {
    id: "notif-2",
    title: "System Active",
    message: "GPS telemetry tracking sync is active in your zone.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: "success",
    portal: "driver",
  }
];

export const useAppStore = create<AppState>((set) => ({
  // Initial States
  theme: "light",
  sidebarOpen: true,
  drivers: mockDrivers,
  organizations: mockOrganizations,
  deliveries: mockDeliveries.map((d) => 
    d.status === ("pending" as any) ? { ...d, status: "available" as const } : d
  ),
  notifications: initialNotifications,
  currentDriverId: "DRV-001", // Default active driver
  currentOrgId: "ORG-001",    // Default active organization

  // Toggles & Layout Actions
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCurrentDriverId: (currentDriverId) => set({ currentDriverId }),
  setCurrentOrgId: (currentOrgId) => set({ currentOrgId }),

  addNotification: (title, message, portal, type = "info") =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
          type,
          portal,
        },
        ...state.notifications,
      ],
    })),

  markNotificationsAsRead: (portal) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.portal === portal ? { ...n, read: true } : n
      ),
    })),

  // Data Mutations
  addDelivery: (delivery) =>
    set((state) => {
      const updatedDeliveries = [delivery, ...state.deliveries];
      
      // Notification helper
      const notifs = [
        {
          id: `notif-${Date.now()}-1`,
          title: "Shipment Draft Created",
          message: `Delivery ${delivery.deliveryNumber} has been saved as a draft.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "info" as const,
          portal: "org" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        notifications: notifs,
        organizations: state.organizations.map((org) =>
          org.id === delivery.organizationId
            ? {
                ...org,
                totalRequests: org.totalRequests + 1,
              }
            : org
        ),
      };
    }),

  publishDelivery: (id) =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      const updatedDelivery: MockDelivery = {
        ...delivery,
        status: "available" as const,
        updatedAt: new Date().toISOString(),
      };

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id ? updatedDelivery : d
      );

      // Sprint 6: Run AI Matching Engine immediately on publish
      const matchingSession = aiMatchingService.runMatchingEngine(
        updatedDelivery,
        state.drivers
      );
      // Store session in matching store (outside of this set() call to avoid circular issues)
      setTimeout(() => {
        useMatchingStore.getState().setSession({
          ...matchingSession,
          status: "scanning",
          rankedResults: [],
        });
        setTimeout(() => {
          useMatchingStore.getState().updateSessionStatus(id, "ranking");
          setTimeout(() => {
            useMatchingStore.getState().setSession(matchingSession);
          }, 500);
        }, 600);
      }, 0);

      const topScore = matchingSession.rankedResults[0]?.score ?? 0;
      const topDriverName = matchingSession.rankedResults[0]?.driver.name ?? "";

      const notifs = [
        {
          id: `notif-${Date.now()}-2`,
          title: "Delivery Published",
          message: `Shipment ${delivery.deliveryNumber} is now live. AI engine scanning ${state.drivers.length} drivers.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success" as const,
          portal: "org" as const,
        },
        {
          id: `notif-${Date.now()}-ai`,
          title: "AI Matching Started",
          message: `Matching engine found ${matchingSession.eligibleCount} eligible drivers. Top candidate score: ${topScore}/100.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "info" as const,
          portal: "org" as const,
        },
        // Notify top 3 drivers
        ...matchingSession.rankedResults.slice(0, 3).map((result, idx) => ({
          id: `notif-${Date.now()}-drv-${idx}`,
          title: "New AI Match Found",
          message: `You are rank #${result.rank} for ${delivery.deliveryNumber} (${delivery.organizationName}). Score: ${result.score}/100. Accept now!`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "info" as const,
          portal: "driver" as const,
        })),
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        notifications: notifs,
        organizations: state.organizations.map((org) =>
          org.id === delivery.organizationId
            ? {
                ...org,
                activeRequests: org.activeRequests + 1,
              }
            : org
        )
      };
    }),

  acceptDelivery: (id, driverId, driverName) =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id
          ? {
              ...d,
              driverId,
              driverName,
              status: "accepted" as const,
              updatedAt: new Date().toISOString(),
            }
          : d
      );

      const updatedDrivers = state.drivers.map((drv) =>
        drv.id === driverId
          ? {
              ...drv,
              status: "on_delivery" as const,
            }
          : drv
      );

      const notifs = [
        {
          id: `notif-${Date.now()}-4`,
          title: "Driver Accepted",
          message: `Driver ${driverName} accepted your shipment ${delivery.deliveryNumber}.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success" as const,
          portal: "org" as const,
        },
        {
          id: `notif-${Date.now()}-5`,
          title: "Match Confirmed",
          message: `You are assigned to shipment ${delivery.deliveryNumber}. Navigate to Active workspace.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success" as const,
          portal: "driver" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        drivers: updatedDrivers,
        notifications: notifs,
      };
    }),

  rejectDelivery: (id) =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};
      const oldDriverId = delivery.driverId;
      const oldDriverName = delivery.driverName;

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id
          ? {
              ...d,
              driverId: null,
              driverName: null,
              status: "available" as const,
              updatedAt: new Date().toISOString(),
            }
          : d
      );

      const updatedDrivers = state.drivers.map((drv) =>
        oldDriverId && drv.id === oldDriverId
          ? {
              ...drv,
              status: "available" as const,
            }
          : drv
      );

      const notifs = [
        {
          id: `notif-${Date.now()}-6`,
          title: "Assignment Cancelled",
          message: `Driver ${oldDriverName || "assigned"} returned shipment ${delivery.deliveryNumber} to the available exchange.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "warning" as const,
          portal: "org" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        drivers: updatedDrivers,
        notifications: notifs,
      };
    }),

  startPickup: (id) =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "pickup_started" as const,
              updatedAt: new Date().toISOString(),
            }
          : d
      );

      const notifs = [
        {
          id: `notif-${Date.now()}-7`,
          title: "Pickup Started",
          message: `Driver ${delivery.driverName || "assigned"} started heading to pickup at ${delivery.pickup}.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "info" as const,
          portal: "org" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        notifications: notifs,
      };
    }),

  updateDeliveryStatus: (id, status) =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      const isDelivered = status === "delivered" && delivery.status !== "delivered";

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
      );

      // Track org completed and active requests
      const updatedOrgs = state.organizations.map((org) => {
        if (org.id === delivery.organizationId) {
          const finished = status === "delivered" || status === "completed" || status === "rated" || status === "cancelled";
          return {
            ...org,
            activeRequests: finished 
              ? Math.max(0, org.activeRequests - 1) 
              : org.activeRequests,
            completedDeliveries: isDelivered ? org.completedDeliveries + 1 : org.completedDeliveries
          };
        }
        return org;
      });

      const updatedDrivers = state.drivers.map((drv) => {
        if (delivery.driverId && drv.id === delivery.driverId) {
          const finished = status === "delivered" || status === "completed" || status === "rated" || status === "cancelled";
          return {
            ...drv,
            status: finished ? ("available" as const) : ("on_delivery" as const),
            completedDeliveries: isDelivered ? drv.completedDeliveries + 1 : drv.completedDeliveries,
            totalDeliveries: isDelivered ? drv.totalDeliveries + 1 : drv.totalDeliveries
          };
        }
        return drv;
      });

      let statusMsg = "";
      if (status === "in_transit") statusMsg = "started routing cargo.";
      else if (status === "near_destination") statusMsg = "is approaching the delivery destination.";
      else if (status === "delivered") statusMsg = "successfully completed the delivery route.";

      const notifs = [
        {
          id: `notif-${Date.now()}-8`,
          title: status === "delivered" ? "Cargo Delivered" : `Status Update`,
          message: `Shipment ${delivery.deliveryNumber} status: driver ${statusMsg}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: (status === "delivered" ? "success" : "info") as any,
          portal: "org" as const,
        },
        ...(status === "delivered"
          ? [
              {
                id: `notif-${Date.now()}-drv-delivered`,
                title: "Delivery Completed",
                message: `You successfully delivered shipment ${delivery.deliveryNumber}. Verify notes and ratings in the dashboard.`,
                timestamp: new Date().toISOString(),
                read: false,
                type: "success" as const,
                portal: "driver" as const,
              },
            ]
          : []),
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        organizations: updatedOrgs,
        drivers: updatedDrivers,
        notifications: notifs,
      };
    }),

  setDriverStatus: (id, status) =>
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, status } : d)),
    })),

  submitDriverRating: (id, rating, comment = "") =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      // If org rating is already submitted, status goes to completed or rated
      const nextStatus = delivery.status === "completed" ? ("rated" as const) : ("completed" as const);

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id ? { ...d, status: nextStatus, updatedAt: new Date().toISOString() } : d
      );

      const updatedDrivers = state.drivers.map((drv) => {
        if (delivery.driverId && drv.id === delivery.driverId) {
          const prevTotal = drv.completedDeliveries - 1 > 0 ? drv.completedDeliveries - 1 : 1;
          const newRating = parseFloat(((drv.rating * prevTotal + rating) / (prevTotal + 1)).toFixed(2));
          return {
            ...drv,
            rating: newRating,
          };
        }
        return drv;
      });

      const notifs = [
        {
          id: `notif-${Date.now()}-9`,
          title: "Feedback Received",
          message: `Organization rated your performance: ★${rating.toFixed(1)} for delivery ${delivery.deliveryNumber}.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success" as const,
          portal: "driver" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        drivers: updatedDrivers,
        notifications: notifs,
      };
    }),

  submitOrgRating: (id, rating, comment = "") =>
    set((state) => {
      const delivery = state.deliveries.find((d) => d.id === id);
      if (!delivery) return {};

      // If driver rating is already submitted, status goes to completed or rated
      const nextStatus = delivery.status === "completed" ? ("rated" as const) : ("completed" as const);

      const updatedDeliveries = state.deliveries.map((d) =>
        d.id === id ? { ...d, status: nextStatus, updatedAt: new Date().toISOString() } : d
      );

      const updatedOrgs = state.organizations.map((org) => {
        if (org.id === delivery.organizationId) {
          const prevTotal = org.completedDeliveries - 1 > 0 ? org.completedDeliveries - 1 : 1;
          const newRating = parseFloat(((org.rating * prevTotal + rating) / (prevTotal + 1)).toFixed(2));
          return {
            ...org,
            rating: newRating,
          };
        }
        return org;
      });

      const notifs = [
        {
          id: `notif-${Date.now()}-10`,
          title: "Feedback Received",
          message: `Driver rated organization performance: ★${rating.toFixed(1)} for delivery ${delivery.deliveryNumber}.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success" as const,
          portal: "org" as const,
        },
        ...state.notifications
      ];

      return {
        deliveries: updatedDeliveries,
        organizations: updatedOrgs,
        notifications: notifs,
      };
    }),

  // Sprint 6: Mark a delivery as having its AI session triggered
  markMatchingTriggered: (id) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id ? { ...d, updatedAt: new Date().toISOString() } : d
      ),
    })),
}));

