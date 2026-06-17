"use client";

/**
 * OrganizationBreadcrumb — Route-aware breadcrumb for the Organization portal
 * Automatically derives crumbs from the current URL segments.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/cn";

const SEGMENT_LABELS: Record<string, string> = {
  organization: "Organization",
  dashboard: "Dashboard",
  "create-delivery": "Create Delivery",
  deliveries: "Active Deliveries",
  tracking: "Tracking",
  drivers: "Drivers",
  analytics: "Analytics",
  ai: "AI Assistant",
  settings: "Settings",
};

interface OrganizationBreadcrumbProps {
  className?: string;
}

export function OrganizationBreadcrumb({ className }: OrganizationBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = SEGMENT_LABELS[segment] ?? segment;
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Link
        href="/organization/dashboard"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb) => {
        // Skip the main "organization" segment to keep the breadcrumb cleaner: "Dashboard > Tracking"
        if (crumb.label === "Organization") return null;

        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" aria-hidden />
            {crumb.isLast ? (
              <span className="font-semibold text-foreground" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
