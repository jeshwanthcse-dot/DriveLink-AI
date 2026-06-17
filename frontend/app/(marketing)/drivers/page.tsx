/**
 * /drivers — For-Drivers marketing page
 */

import type { Metadata } from "next";
import { Truck, Star, Zap, Shield, Wallet, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "For Drivers — DriveLink AI",
  description: "Join DriveLink AI as a professional driver. Get matched to nearby delivery jobs instantly, earn more, and manage your career with AI-powered tools.",
};

const DRIVER_BENEFITS = [
  { icon: Zap, title: "Instant Job Matching", description: "Get notified the moment a delivery matches your profile. Accept with one tap — no bidding, no waiting." },
  { icon: Wallet, title: "Competitive Earnings", description: "See your estimated payout before accepting any job. Transparent pricing with no hidden deductions." },
  { icon: Shield, title: "Verified & Safe", description: "Every organization on the platform is vetted. You'll always know who you're delivering for." },
  { icon: MapPin, title: "Nearby Jobs Only", description: "Our AI only matches you to deliveries within your preferred radius. Less driving, more earning." },
  { icon: Star, title: "Build Your Reputation", description: "Earn ratings after every delivery. Higher ratings unlock better jobs and priority matching." },
  { icon: Truck, title: "Your Schedule, Your Rules", description: "Go available or offline whenever you want. Full control over when and how much you work." },
];

const HOW_TO_JOIN = [
  { step: 1, title: "Create a Driver Account", description: "Sign up and complete your profile with your license, vehicle details, and availability." },
  { step: 2, title: "Get Verified", description: "Our team verifies your documents within 24 hours. Once approved, you're live on the platform." },
  { step: 3, title: "Receive Delivery Matches", description: "Turn on availability and our AI instantly starts matching you to nearby jobs." },
  { step: 4, title: "Accept & Deliver", description: "Accept a job, follow the route, upload the delivery photo, and collect your earnings." },
];

export default function DriversPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="default" className="mb-5">For Professional Drivers</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3rem] lg:leading-tight">
              Drive more. Earn more. <span className="text-gradient">Stress less.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Join 5,000+ drivers using DriveLink AI to find nearby delivery jobs instantly, build their reputation, and grow their income — on their own schedule.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <LinkButton href="/driver/dashboard">
                View Driver Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href="/how-it-works" variant="outline">How It Works</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <SectionContainer className="py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[{ value: "5K+", label: "Active Drivers" },{ value: "4.8★", label: "Average Rating" },{ value: "₹18K", label: "Avg. Monthly Earnings" },{ value: "97%", label: "On-Time Rate" }].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <SectionHeader badge="Why Drivers Choose Us" title="Built for the" highlight="professional driver" description="Everything you need to manage your delivery career — in one platform." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DRIVER_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h2 className="font-semibold text-foreground">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <div className="rounded-3xl border border-border bg-muted/40 p-8 sm:p-12">
          <SectionHeader badge="Getting Started" title="How to join" highlight="DriveLink AI" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_JOIN.map((item) => (
              <div key={item.step} className="flex flex-col">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{item.step}</div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
