"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Licenses</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="default">Legal & Compliance</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Software Licenses
          </h1>
          <p className="text-lg text-muted-foreground">
            Information regarding open source licenses and software compliance for DriveLink AI.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-left space-y-8 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Open Source Software</h2>
            <p>
              DriveLink AI is built using various open source packages, libraries, and frameworks. We acknowledge and appreciate the contributions of the open source community. Relevant licenses, including the MIT License, Apache License 2.0, and BSD-style licenses, apply to their respective libraries.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. Commercial Use</h2>
            <p>
              For enterprise and commercial implementations of DriveLink AI, custom commercial software licenses may apply. Please refer to our main Terms of Service or contact our legal team for specific licensing agreements.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
