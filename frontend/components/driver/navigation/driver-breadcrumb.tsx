"use client";

/**
 * DriverBreadcrumb — Route-aware breadcrumb for the Driver portal
 * Automatically derives crumbs from the current URL segments and translates them to clean labels.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/cn";

const SEGMENT_LABELS: Record<string, string> = {
  driver: "Driver",
  dashboard: "Dashboard",
  deliveries: "Available Deliveries",
  completed: "Completed Deliveries",
  profile: "Profile",
  ratings: "Ratings",
  ai: "AI Assistant",
  settings: "Settings",
};

interface DriverBreadcrumbProps {
  className?: string;
}

export function DriverBreadcrumb({ className }: DriverBreadcrumbProps) {
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
        href="/driver/dashboard"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb) => {
        // Skip the main "driver" segment to keep the breadcrumb cleaner: "Dashboard > Profile"
        if (crumb.label === "Driver") return null;

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
