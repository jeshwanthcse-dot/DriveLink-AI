import { MockDelivery } from "@/mock/deliveries";

export const deliveryService = {
  getAll(deliveries: MockDelivery[]): MockDelivery[] {
    return deliveries;
  },

  getById(deliveries: MockDelivery[], id: string): MockDelivery | undefined {
    return deliveries.find((d) => d.id === id);
  },

  search(deliveries: MockDelivery[], term: string): MockDelivery[] {
    if (!term) return deliveries;
    const cleanTerm = term.toLowerCase();
    return deliveries.filter(
      (d) =>
        d.pickup.toLowerCase().includes(cleanTerm) ||
        d.drop.toLowerCase().includes(cleanTerm) ||
        d.deliveryNumber.toLowerCase().includes(cleanTerm) ||
        d.organizationName.toLowerCase().includes(cleanTerm) ||
        (d.driverName && d.driverName.toLowerCase().includes(cleanTerm))
    );
  },

  filter(
    deliveries: MockDelivery[],
    filters: {
      status?: MockDelivery["status"];
      priority?: MockDelivery["priority"];
      vehicleType?: MockDelivery["vehicleType"];
      driverId?: string | null;
      organizationId?: string;
    }
  ): MockDelivery[] {
    let result = [...deliveries];

    if (filters.status) {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((d) => d.priority === filters.priority);
    }
    if (filters.vehicleType) {
      result = result.filter((d) => d.vehicleType === filters.vehicleType);
    }
    if (filters.driverId !== undefined) {
      result = result.filter((d) => d.driverId === filters.driverId);
    }
    if (filters.organizationId) {
      result = result.filter((d) => d.organizationId === filters.organizationId);
    }

    return result;
  },

  sort(deliveries: MockDelivery[], key: keyof MockDelivery, direction: "asc" | "desc" = "asc"): MockDelivery[] {
    return [...deliveries].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      
      if (valA === undefined || valB === undefined || valA === null || valB === null) return 0;
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }
};
