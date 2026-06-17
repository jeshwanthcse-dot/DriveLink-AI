import { Driver, DriverStatus } from "@/types/driver";

export const driverService = {
  getAll(drivers: Driver[]): Driver[] {
    return drivers;
  },

  getById(drivers: Driver[], id: string): Driver | undefined {
    return drivers.find((drv) => drv.id === id);
  },

  search(drivers: Driver[], term: string): Driver[] {
    if (!term) return drivers;
    const cleanTerm = term.toLowerCase();
    return drivers.filter(
      (drv) =>
        drv.name.toLowerCase().includes(cleanTerm) ||
        drv.email.toLowerCase().includes(cleanTerm) ||
        drv.licenseNumber.toLowerCase().includes(cleanTerm)
    );
  },

  filter(drivers: Driver[], status?: DriverStatus, vehicleType?: string): Driver[] {
    let result = [...drivers];
    if (status) {
      result = result.filter((drv) => drv.status === status);
    }
    if (vehicleType) {
      result = result.filter((drv) => drv.vehicleType === vehicleType);
    }
    return result;
  },

  sort(drivers: Driver[], key: keyof Driver, direction: "asc" | "desc" = "asc"): Driver[] {
    return [...drivers].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      
      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }
};
