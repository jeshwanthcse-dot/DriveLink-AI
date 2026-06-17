/**
 * /organizations — For-Organizations marketing page
 */

import type { Metadata } from "next";
import { Building2, Zap, MapPin, Brain, Shield, BarChart3, ArrowRight } from "lucide-react";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "For Organizations — DriveLink AI",
  description: "Use DriveLink AI to post delivery requests, auto-match verified drivers, track shipments live, and get AI-powered logistics insights.",
};

const ORG_BENEFITS = [
  { icon: Zap, title: "Assign Drivers in Minutes", description: "Eliminate hours of phone calls. Post a delivery and our AI assigns the best available driver automatically — in under 3 seconds." },
  { icon: Brain, title: "Intelligent Driver Ranking", description: "Our AI ranks drivers by rating, distance, experience, and delivery history. You always get the most qualified driver for every job." },
  { icon: MapPin, title: "Real-Time Fleet Visibility", description: "See every active driver on a live map with speed, ETA, and route progress. No more status calls or guesswork." },
  { icon: Shield, title: "Verified Driver Network", description: "Every driver on the platform is vetted and rated. Poor performers are flagged automatically — your deliveries are safe." },
  { icon: BarChart3, title: "Delivery Analytics", description: "Track delivery performance, on-time rates, and driver ratings. Export reports or ask your AI assistant for insights." },
  { icon: Building2, title: "Built for Scale", description: "Whether you run 5 deliveries a month or 500, DriveLink AI scales with your operations without extra overhead." },
];

export default function OrganizationsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-5">For Transport Organizations</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3rem] lg:leading-tight">
              Logistics that runs <span className="text-gradient">itself.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Post deliveries, get the best driver assigned by AI, track everything live, and receive proof — all without a single phone call.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <LinkButton href="/organization/dashboard">
                View Organization Portal <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/features" variant="outline">See All Features</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <SectionContainer className="py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[{ value: "500+", label: "Organizations" },{ value: "99.2%", label: "Success Rate" },{ value: "< 3s", label: "Match Time" },{ value: "96%", label: "On-Time Delivery" }].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <SectionHeader badge="Platform Benefits" title="The smarter way to" highlight="run deliveries" description="Stop managing drivers manually. Let AI handle matching, tracking, and reporting." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ORG_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
                  <Icon className="h-5 w-5 text-secondary" aria-hidden />
                </div>
                <h2 className="font-semibold text-foreground">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <div className="mx-auto max-w-xl rounded-3xl bg-primary p-10 text-center text-primary-foreground shadow-elevated">
          <h2 className="text-2xl font-bold">Ready to modernize your fleet?</h2>
          <p className="mt-3 text-primary-foreground/80">Start posting deliveries today — no setup fee, no commitment.</p>
          <LinkButton href="/organization/dashboard" variant="outline" size="lg" className="mt-6 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </SectionContainer>
    </>
  );
}
