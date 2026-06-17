"use client";

/**
 * app/organization/layout.tsx
 * Organization portal shell layout
 * Manages responsive sidebar drawer trigger, scrollable main content, and the footer.
 */

import { useState } from "react";
import { OrganizationSidebar } from "@/components/organization/layout/organization-sidebar";
import { OrganizationTopbar } from "@/components/organization/layout/organization-topbar";
import { OrganizationFooter } from "@/components/organization/layout/organization-footer";

export default function OrganizationPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <OrganizationSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main content column */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Top Header holding Search and Topbar controls */}
        <OrganizationTopbar onMobileMenuOpen={() => setIsMobileOpen(true)} />

        {/* Content Section */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 flex flex-col">
          {children}
        </main>
        <OrganizationFooter />
      </div>
    </div>
  );
}
