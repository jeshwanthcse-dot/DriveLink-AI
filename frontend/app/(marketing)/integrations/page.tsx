"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Cpu, Terminal, Webhook, Key, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Integrations</span>
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
            <Badge variant="default">API & Webhooks</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Connect your existing <span className="text-gradient">logistics stack</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              DriveLink AI fits seamlessly into your ERP, TMS, and freight operations software with developer-friendly REST APIs and active webhook endpoints.
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
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">API Sync Framework</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">integration_channels.svg</div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Content Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Developer Tools</h2>
            <p className="text-sm text-muted-foreground">
              Automate orders, dispatch updates, and telemetry monitoring by connecting directly to our secure systems.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Terminal, title: "REST Logistics API", desc: "Programmatically post delivery runs, query matched drivers, and check payouts." },
              { icon: Webhook, title: "Event Webhooks", desc: "Receive JSON payloads for status transitions like accepted, near destination, and complete." },
              { icon: Key, title: "Secure Keys", desc: "Easy bearer token authorization to safeguard private dispatcher transactions." },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore developer integrations?</h2>
            <p className="text-sm text-blue-100">Access documentation, guides, and sandbox endpoints.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/organizations" size="lg" variant="default">
                Get API Token
              </LinkButton>
              <LinkButton href="/contact" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Contact Developer Relations
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
