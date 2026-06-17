"use client";

/**
 * app/driver/layout.tsx
 * Driver portal shell layout — matches the Sprint 2.2 structural diagram
 * Handles responsive sidebar drawer trigger, connection state mock toggle,
 * scrollable main content, and the professional footer.
 */

import { useState } from "react";
import { DriverSidebar } from "@/components/driver/layout/driver-sidebar";
import { DriverTopbar } from "@/components/driver/layout/driver-topbar";
import { DriverFooter } from "@/components/driver/layout/driver-footer";
import { useDrivers } from "@/hooks/useDrivers";

export default function DriverPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { activeDriver, setDriverStatus, currentDriverId } = useDrivers();

  const status = activeDriver?.status === "offline" ? "offline" : "available";
  const handleStatusChange = (newStatus: "available" | "offline") => {
    setDriverStatus(currentDriverId, newStatus);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DriverSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* Main content column */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Top Header holding Logo and Topbar controls */}
        <DriverTopbar
          onMobileMenuOpen={() => setIsMobileOpen(true)}
          status={status}
          onStatusChange={handleStatusChange}
        />

        {/* Content Section */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 flex flex-col">
          {children}
        </main>
        <DriverFooter />
      </div>
    </div>
  );
}
