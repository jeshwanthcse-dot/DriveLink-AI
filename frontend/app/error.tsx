"use client";

/**
 * app/error.tsx
 * Global error boundary — catches unhandled runtime errors in the root segment.
 * Must be a Client Component (required by Next.js).
 *
 * Displays a professional error UI with:
 * - Error icon + title + description
 * - Retry button (calls reset())
 * - Home navigation link
 */

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an external error tracking service in production
    console.error("[DriveLink AI] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background text-foreground font-sans antialiased">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 shadow-soft">
        <AlertTriangle className="h-10 w-10 text-red-500" aria-hidden />
      </div>

      {/* Heading */}
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Something went wrong
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        An unexpected error occurred. Our team has been notified. You can try
        again or return to the homepage.
      </p>

      {/* Digest (development only) */}
      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-xl bg-muted px-4 py-3 text-left text-xs text-muted-foreground">
          {error.message}
        </pre>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Button
          onClick={reset}
          className="gap-2"
          aria-label="Try again"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Try Again
        </Button>
        <LinkButton href="/" variant="outline" className="gap-2">
          <Home className="h-4 w-4" aria-hidden />
          Back to Home
        </LinkButton>
      </div>
    </div>
  );
}
