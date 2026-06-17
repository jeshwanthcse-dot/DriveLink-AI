/**
 * /how-it-works — Visual step-by-step guide page
 */

import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { HOW_IT_WORKS_STEPS } from "@/constants/landing";

export const metadata: Metadata = {
  title: "How It Works — DriveLink AI",
  description:
    "Learn how DriveLink AI connects organizations with drivers in 5 simple steps.",
};

export default function HowItWorksPage() {
  return (
    <>
      <SectionContainer className="pb-0 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">The Process</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Five steps to a <span className="text-gradient">perfect delivery</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            DriveLink AI automates the most complex parts of logistics so you can focus on what
            matters — delivering on time.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-[27px] top-10 h-[calc(100%-64px)] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" aria-hidden />
          <ol className="space-y-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step.step} className="flex items-start gap-6">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/20 bg-background shadow-soft">
                  <span className="text-lg font-bold text-primary">{step.step}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <ArrowRight className="h-3 w-3" aria-hidden />
                      <span>Then…</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-muted/40 p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">For Organizations</h2>
              <ul className="mt-4 space-y-3">
                {["Post deliveries in under 2 minutes","AI assigns the best driver automatically","Track live from pickup to drop-off","Receive photo proof on completion"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <LinkButton href="/organizations" size="sm" className="mt-6 group">
                Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </LinkButton>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">For Drivers</h2>
              <ul className="mt-4 space-y-3">
                {["Receive nearby delivery notifications","Accept with one tap — no bidding","Follow turn-by-turn route guidance","Upload photo to complete delivery"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <LinkButton href="/drivers" variant="outline" size="sm" className="mt-6">
                Join as Driver
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
