/**
 * app/loading.tsx
 * Global loading UI — shown during root-level route transitions.
 * Automatically used by Next.js Suspense when navigating.
 *
 * Uses the existing Loader component for consistency.
 */

import { PageLoader } from "@/components/ui/loader";

export default function GlobalLoading() {
  return <PageLoader />;
}
