"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Compass, Users, Sparkles, Building, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">About Us</span>
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
            <Badge variant="default">Our Mission</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Driving the future of <span className="text-gradient">logistics matching</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started DriveLink AI to construct a secure, intelligent, and resilient operations layer that connects transport drivers with cargo operators seamlessly.
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
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">DriveLink AI Mission</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">company_vision_model.svg</div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Our Core Values</h2>
            <p className="text-sm text-muted-foreground">
              These principles guide how we develop code, manage logistics networks, and construct security parameters.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Compass, title: "Efficiency First", desc: "Automate manual dispatch phone calls with smart match scores." },
              { icon: Users, title: "Carrier Trust", desc: "Validate operational documents to ensure compliance and data privacy." },
              { icon: Sparkles, title: "Tech Resilience", desc: "Implement offline synchronization pipelines so driver telemetry is never lost." },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{value.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{value.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold">Want to partner with DriveLink AI?</h2>
            <p className="text-sm text-blue-100">Get in touch with our partnerships office today.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/contact" size="lg" variant="default">
                Contact Our Team
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
