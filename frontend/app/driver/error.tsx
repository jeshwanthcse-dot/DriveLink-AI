"use client";

/**
 * app/driver/error.tsx
 * Error boundary for the driver portal segment.
 * Renders inside the DriverLayout shell so that navigation remains fully active.
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ROUTES } from "@/constants/routes";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DriverPortalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[DriveLink AI / Driver] Portal error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-soft">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden />
      </div>

      {/* Heading */}
      <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Something went wrong
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        An error occurred loading this segment. Try again or navigate back to the dashboard.
      </p>

      {/* Dev-only error detail */}
      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-4 max-w-md overflow-auto rounded-xl bg-muted px-4 py-3 text-left text-xs text-muted-foreground">
          {error.message}
        </pre>
      )}

      {/* Actions */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" aria-hidden />
          Try Again
        </Button>
        <LinkButton
          href={ROUTES.driver.dashboard}
          variant="outline"
          className="gap-2"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Back to Dashboard
        </LinkButton>
      </div>
    </div>
  );
}
