"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Info, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Cookie Policy</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="default">Browser Storage</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Cookie & Local Storage Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            How we utilize cookies, local storage buffers, and cached telemetry logs to enable offline matching modes.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-left space-y-8 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Caching & Offline Storage</h2>
            <p>
              Rather than traditional cookies, DriveLink AI utilizes browser `localStorage` to cache offline action queues (GPS tracks, check-in logs, photo proof files) and verified document summaries. This local data persists to enable offline capability and auto-syncs when online connections return.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. Session and Theme Storage</h2>
            <p>
              We write basic settings to your local browser store (e.g. portal theme settings, active driver IDs like `DRV-001`, active organization IDs like `ORG-001`) to support rapid swapping between mockup workspaces.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
