"use client";

/**
 * app/driver/loading.tsx
 * Loading suspense skeleton placeholder shown during driver portal transitions.
 */

import { CardSkeleton } from "@/components/ui/loader";

export default function DriverPortalLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>

      {/* Content cards skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    </div>
  );
}
