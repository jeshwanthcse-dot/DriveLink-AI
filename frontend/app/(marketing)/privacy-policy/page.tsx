"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, EyeOff, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Privacy Policy</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Badge variant="default">Privacy & Security</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            How we protect personal identifiable information (PII), secure document centers, and manage GPS telemetry data.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl text-left space-y-8 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Data Storage & Masking</h2>
            <p>
              In our Trust & Verification Engine, all uploaded documents (Driving Licenses, RC, PUC, profile photos) are processed via mock OCR mechanisms. To ensure identity compliance, raw files are protected and never made accessible or downloadable to transport organizations or third-party shippers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. GPS & Telemetry Tracking</h2>
            <p>
              Live tracking monitors geolocations, speed, and ETA parameters strictly during active delivery assignments. Location tracking ceases instantly when a delivery is marked completed or rated. Offline cached coordinates are stored inside local browser memory buffers and sequences are replayed and purged once connection is restored.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">3. Local Browser Caches</h2>
            <p>
              Zustand store profiles and security history logs are written locally in browser storage models (`localStorage`). You can clear your client logs or mock settings inside the dashboard workspaces.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
