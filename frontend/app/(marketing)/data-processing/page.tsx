"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Cpu, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DataProcessingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Data Processing</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="default">Telemetry Processing</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Data Processing Agreement
          </h1>
          <p className="text-lg text-muted-foreground">
            Compliance parameters surrounding geolocations, OCR details, and carrier validations.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-left space-y-8 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Geolocation Streams</h2>
            <p>
              Latitude and longitude coordinates are processed dynamically inside our Live Tracking Engine at a 3-second heartbeat frequency. Telemetry streams are deleted upon destination arrival.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. OCR Smart Parsing</h2>
            <p>
              Mock OCR processes upload payloads to check validity, extracting text matches (e.g. document name, expiration date) with confidence estimations (e.g. 96%). The processed data is held in local memory.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
