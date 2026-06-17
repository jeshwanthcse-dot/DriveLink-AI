/**
 * app/not-found.tsx
 * 404 — Not Found page.
 * Rendered automatically by Next.js when notFound() is called or no route matches.
 *
 * Features:
 * - Branded 404 number with gradient
 * - Clear message explaining the page is missing
 * - Navigation back to home, driver portal, and org portal
 * - Fully static Server Component — no client state needed
 */

import type { Metadata } from "next";
import { Truck, Home, ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Logo } from "@/components/common/logo";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "404 — Page Not Found | DriveLink AI",
  description: "The page you are looking for does not exist.",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header */}
      <header className="flex h-16 items-center border-b border-border px-4 sm:px-6 lg:px-8">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        {/* 404 number */}
        <div className="relative">
          <p className="select-none text-[9rem] font-extrabold leading-none tracking-tight text-muted/80 sm:text-[12rem]">
            404
          </p>
          {/* Floating truck icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-soft">
              <Truck className="h-10 w-10 text-primary animate-float" aria-hidden />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          This route got lost in transit
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>

        {/* Quick links */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <LinkButton href={ROUTES.home} variant="outline" className="gap-2">
            <Home className="h-4 w-4" aria-hidden />
            Go Home
          </LinkButton>
          <LinkButton href={ROUTES.driver.dashboard} className="gap-2">
            Driver Portal
          </LinkButton>
          <LinkButton
            href={ROUTES.organization.dashboard}
            variant="secondary"
            className="gap-2"
          >
            Org Portal
          </LinkButton>
        </div>

        {/* Helpful links */}
        <div className="mt-10 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Looking for something specific?</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: "Features", href: ROUTES.features },
              { label: "How It Works", href: ROUTES.howItWorks },
              { label: "For Drivers", href: ROUTES.drivers },
              { label: "For Organizations", href: ROUTES.organizations },
              { label: "Contact", href: ROUTES.contact },
              { label: "FAQ", href: ROUTES.faq },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
