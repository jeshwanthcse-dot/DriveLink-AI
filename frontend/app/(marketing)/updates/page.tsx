"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { RefreshCw, Tag, Sparkles, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function UpdatesPage() {
  const changelogs = [
    {
      version: "v2.1.0",
      date: "June 16, 2026",
      title: "Trust & Verification Engine Release",
      type: "Major Release",
      items: [
        "Introduced dynamic OCR document audit flows supporting Licenses, RC, and PUC certifications.",
        "Deployed weighted Trust Score gauges combining ratings, trip milestones, and validations.",
        "Integrated client-side local storage caches for verified documents history log summaries.",
        "Launched security reporting screens masking raw documents to maintain compliance and PII protection.",
      ],
    },
    {
      version: "v2.0.4",
      date: "June 08, 2026",
      title: "Offline Telemetry Diagnostics",
      type: "Patch",
      items: [
        "Enabled automated browser cache buffering when driver connection signals drop.",
        "Created background synchronization loaders sequential replaying stored coordinates and photos.",
        "Added connection status banner toggles to simulate offline modes in dispatcher overlays.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Updates</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <Badge variant="default">Platform Changelog</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            DriveLink AI <span className="text-gradient">Changelog</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with optimization release notes, engine updates, and user dashboard integrations.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl space-y-10">
          {changelogs.map((log, idx) => (
            <motion.div
              key={log.version}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-border bg-card shadow-card space-y-4 text-left"
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {log.version}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{log.date}</span>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                  {log.type}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{log.title}</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                  {log.items.map((item, id) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Call to Action (CTA) */}
      <SectionContainer className="pb-20 pt-12">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Never miss an update from DriveLink AI</h2>
            <p className="text-sm text-blue-100">Subscribe to our developers newsletter today.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/contact" size="lg" variant="default">
                Subscribe Updates
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
