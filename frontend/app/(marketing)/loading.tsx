/**
 * app/(marketing)/loading.tsx
 * Loading UI for all marketing pages (/features, /how-it-works, /drivers, etc.)
 * Shown during Suspense while the page Server Component is rendering.
 */

import { SectionContainer } from "@/components/layout/section-container";
import { CardSkeleton } from "@/components/ui/loader";

export default function MarketingLoading() {
  return (
    <SectionContainer className="pt-20">
      {/* Page hero skeleton */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-5 w-24 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-muted" />
        <div className="mx-auto mt-3 h-5 w-2/3 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Card grid skeleton */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </SectionContainer>
  );
}
