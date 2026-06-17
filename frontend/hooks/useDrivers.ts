"use client";

import { useAppStore } from "@/store/app-store";
import { driverService } from "@/services/driver-service";
import { Driver, DriverStatus } from "@/types/driver";

export function useDrivers() {
  const drivers = useAppStore((state) => state.drivers);
  const currentDriverId = useAppStore((state) => state.currentDriverId);
  const setCurrentDriverId = useAppStore((state) => state.setCurrentDriverId);
  const setDriverStatus = useAppStore((state) => state.setDriverStatus);

  const activeDriver = drivers.find((d) => d.id === currentDriverId);

  return {
    drivers,
    currentDriverId,
    activeDriver,
    setCurrentDriverId,
    setDriverStatus,
    
    // Query Helpers
    getAll: () => driverService.getAll(drivers),
    getById: (id: string) => driverService.getById(drivers, id),
    search: (term: string) => driverService.search(drivers, term),
    filter: (status?: DriverStatus, vehicleType?: string) =>
      driverService.filter(drivers, status, vehicleType),
    sort: (key: keyof Driver, direction?: "asc" | "desc") =>
      driverService.sort(drivers, key, direction)
  };
}
