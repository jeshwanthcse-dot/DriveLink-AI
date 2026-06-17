"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Terms of Service</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="default">Platform Rules</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            SLA parameters, shipping expectations, and transport coordination agreements.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-left space-y-8 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Vetted Carrier Registration</h2>
            <p>
              Drivers must provide correct registration detail smart cards (License, RC, PUC) in our Document Center. Operating transport runs with expired credentials will degrade matching ranking values and might pause match score indexing.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. Shipment Dispatches</h2>
            <p>
              Shipping organizations declare that post requests detail accurate cargos. Matching algorithms evaluate driver proximity to compute the first-accept assignments loop. Assignments are locked upon driver confirmation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">3. System Mock Architecture</h2>
            <p>
              DriveLink AI is built using client-side frontend simulations, Zustand local storage slices, and mock services. No financial, authentication, or live server liabilities are supported in this release.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
