"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Check, Info, ChevronRight, DollarSign } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "per month",
      desc: "For small logistics teams getting started with dispatching.",
      features: [
        "Up to 50 matched deliveries/mo",
        "Standard AI matching scores",
        "Mobile driver GPS tracking",
        "Email support response",
      ],
      cta: "Get Started",
      href: "/organizations",
      popular: false,
    },
    {
      name: "Business",
      price: "₹14,999",
      period: "per month",
      desc: "Perfect for mid-size operations with active fleets.",
      features: [
        "Unlimited matched deliveries",
        "Advanced proximity AI engine",
        "Live GPS maps + speed indicators",
        "Document Center & Expiry Dashboard",
        "Priority Slack + Call support",
      ],
      cta: "Try Business Free",
      href: "/organizations",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "custom pricing",
      desc: "For large enterprise fleets requiring absolute compliance SLA.",
      features: [
        "Dedicated matching rules Engine",
        "Custom API integrations",
        "White-label driver portals",
        "OCR verification pipelines",
        "Dedicated Account Manager",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Pricing</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <Badge variant="default">Pricing Plans</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Flexible plans for <span className="text-gradient">fleets of all sizes</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Constructed to match your logistics scale. Free access for drivers, transparent billing tiers for shipping organizations.
          </p>
        </div>
      </SectionContainer>

      {/* Pricing Cards Grid */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`rounded-3xl border p-8 flex flex-col justify-between relative bg-card shadow-card ${
                tier.popular ? "border-primary ring-2 ring-primary/10" : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-bold bg-primary text-white select-none">
                  MOST POPULAR
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono text-foreground">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">{tier.period}</span>
                </div>

                <ul className="space-y-3 pt-6 border-t border-border/50 text-xs">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-650 dark:text-slate-355">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <LinkButton
                  href={tier.href}
                  variant={tier.popular ? "default" : "outline"}
                  className="w-full justify-center text-xs h-10"
                >
                  {tier.cta}
                </LinkButton>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Info banner */}
      <SectionContainer className="pt-0">
        <div className="mx-auto max-w-3xl flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-border/50 text-left text-xs leading-relaxed text-muted-foreground">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground">Free for Drivers:</span> DriveLink AI matching portals, compliance workspaces, offline cache storage models, and rating summaries are completely free for all active registered freight operators.
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
