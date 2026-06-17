"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Handshake, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Partners</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-left"
          >
            <Badge variant="default">Alliances & Fleet Partners</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Constructing an ecosystem of <span className="text-gradient">logistics partners</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We collaborate with vetted shippers, national fleet carriers, and operations software providers to drive automation across transport channels.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-8 flex items-center justify-center aspect-video shadow-card overflow-hidden"
          >
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="text-center space-y-4 relative z-10">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary text-2xl font-bold shadow-soft">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Partners System Link</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">ecosystem_partners.svg</div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Partner Categories</h2>
            <p className="text-sm text-muted-foreground">
              We construct integrations to fit your fleet management scale.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Fleet Providers", desc: "Integrate your vehicle catalog and automatically match drivers to orders." },
              { icon: ShieldCheck, title: "Vetting Agencies", desc: "Collaborate with document validator authorities to speed up credential checks." },
              { icon: Handshake, title: "TMS Platforms", desc: "REST API syncing hooks mapping DriveLink AI coordinates directly to your systems." },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionContainer>

      {/* Call to Action (CTA) */}
      <SectionContainer className="pb-20 pt-12">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to join our partner network?</h2>
            <p className="text-sm text-blue-100">Construct integrations and expand matching pipelines.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/contact" size="lg" variant="default">
                Apply for Partnership
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
