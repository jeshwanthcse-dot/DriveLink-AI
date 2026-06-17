"use client";

import { useAppStore } from "@/store/app-store";
import { deliveryService } from "@/services/delivery-service";
import { MockDelivery } from "@/mock/deliveries";

export function useDeliveries() {
  const deliveries = useAppStore((state) => state.deliveries);
  const addDelivery = useAppStore((state) => state.addDelivery);
  const publishDelivery = useAppStore((state) => state.publishDelivery);
  const acceptDelivery = useAppStore((state) => state.acceptDelivery);
  const rejectDelivery = useAppStore((state) => state.rejectDelivery);
  const startPickup = useAppStore((state) => state.startPickup);
  const updateDeliveryStatus = useAppStore((state) => state.updateDeliveryStatus);
  const submitDriverRating = useAppStore((state) => state.submitDriverRating);
  const submitOrgRating = useAppStore((state) => state.submitOrgRating);

  return {
    deliveries,
    addDelivery,
    publishDelivery,
    acceptDelivery,
    rejectDelivery,
    startPickup,
    updateDeliveryStatus,
    submitDriverRating,
    submitOrgRating,
    assignDriverToDelivery: acceptDelivery, // compatibility alias

    // Query Helpers
    getAll: () => deliveryService.getAll(deliveries),
    getById: (id: string) => deliveryService.getById(deliveries, id),
    search: (term: string) => deliveryService.search(deliveries, term),
    filter: (filters: Parameters<typeof deliveryService.filter>[1]) =>
      deliveryService.filter(deliveries, filters),
    sort: (key: keyof MockDelivery, direction?: "asc" | "desc") =>
      deliveryService.sort(deliveries, key, direction)
  };
}
