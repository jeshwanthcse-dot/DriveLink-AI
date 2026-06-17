/**
 * /features — Full feature showcase page
 */

import type { Metadata } from "next";
import { Brain, MapPin, WifiOff, Camera, Sparkles, Radio, ArrowRight } from "lucide-react";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Features — DriveLink AI",
  description:
    "Explore all features of DriveLink AI: AI matching, GPS tracking, offline sync, proof of delivery, dual AI assistants, and instant notifications.",
};

const DEEP_FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our matching engine scores every available driver using a weighted formula: 40% rating, 30% distance, 20% experience, and 10% delivery history. Rankings are computed in real time.",
    highlight: "< 3 sec match time",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    description:
      "Organizations see every driver move on a live map. Speed, ETA, distance remaining, and route progress are streamed continuously from pickup through final drop-off.",
    highlight: "Real-time updates",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: WifiOff,
    title: "Offline Sync",
    description:
      "Drivers keep working without internet. The app buffers GPS coordinates, status changes, and photos locally. Everything syncs the moment connectivity returns.",
    highlight: "Zero data loss",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Camera,
    title: "Proof of Delivery",
    description:
      "Drivers upload a single delivery photo. GPS coordinates and a UTC timestamp are automatically embedded. No OTP, no digital signature — fast and audit-ready.",
    highlight: "Auto GPS + timestamp",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Sparkles,
    title: "Dual AI Assistants",
    description:
      "Two completely separate AI copilots — one for drivers, one for organizations. Each is scoped to its own data with zero shared memory.",
    highlight: "Zero shared memory",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: Radio,
    title: "Instant Notifications",
    description:
      "Push alerts fire automatically when matches are found, deliveries accepted, milestones reached, and deliveries completed.",
    highlight: "Firebase FCM",
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <SectionContainer className="pb-0 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="default" className="mb-4">Platform Features</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3rem] lg:leading-tight">
            Everything you need for{" "}
            <span className="text-gradient">intelligent logistics</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            From AI-driven driver matching to real-time GPS tracking and offline sync — DriveLink AI
            covers every step of the delivery lifecycle.
          </p>
        </div>
      </SectionContainer>

      {/* Feature Cards */}
      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEEP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color}`}>
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} aria-hidden />
                </div>
                <h2 className="text-base font-semibold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <div className="mt-4">
                  <Badge variant="outline" className="text-xs">{feature.highlight}</Badge>
                </div>
              </article>
            );
          })}
        </div>
      </SectionContainer>

      {/* CTA */}
      <SectionContainer className="pt-0">
        <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to transform your logistics?
          </h2>
          <p className="mt-3 text-muted-foreground">Join 500+ organizations already using DriveLink AI.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/organizations">
              Start for Organizations
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/drivers" variant="outline">
              Join as Driver
            </LinkButton>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
