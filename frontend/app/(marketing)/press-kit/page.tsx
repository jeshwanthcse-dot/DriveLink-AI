"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Image, Download, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PressKitPage() {
  const assets = [
    { title: "Primary Logo Set", desc: "Includes color, dark mode, and light mode SVG/PNG icons.", type: "ZIP (4.2MB)" },
    { title: "Brand Guidelines", desc: "PDF detailing color palettes, spacings, and typographies.", type: "PDF (1.8MB)" },
    { title: "Company Fact Sheet", desc: "Summary statistics, core features, and growth metrics.", type: "PDF (850KB)" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Press Kit</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <Badge variant="default">Brand Resources</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            DriveLink AI <span className="text-gradient">Press Kit</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Download official brand identities, screenshots, and guidelines for PR and media publications.
          </p>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-6 text-left">Assets Downloads</h2>
          {assets.map((asset, idx) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 shadow-sm transition-all duration-200 text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{asset.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{asset.desc}</p>
                <div className="text-[9px] font-mono text-slate-400 font-semibold">{asset.type}</div>
              </div>

              <LinkButton
                href="/contact"
                size="sm"
                variant="outline"
                className="text-xs h-9 gap-1.5 shrink-0"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </LinkButton>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Call to Action (CTA) */}
      <SectionContainer className="pb-20 pt-12">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Need custom PR details?</h2>
            <p className="text-sm text-blue-100">Contact our media relations office directly.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/contact" size="lg" variant="default">
                Contact Media Relations
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
