"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Building2, Truck } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { Card, CardContent } from "@/components/ui/card";
import { BENEFITS } from "@/constants/landing";

export function BenefitsSection() {
  const driverBenefits = BENEFITS.filter((b) => b.audience === "drivers" || b.audience === "both");
  const orgBenefits = BENEFITS.filter(
    (b) => b.audience === "organizations" || b.audience === "both"
  );

  return (
    <>
      <SectionContainer id="for-drivers" className="bg-muted/20">
        <BenefitsBlock
          icon={Truck}
          badge="For Drivers"
          title="Drive smarter,"
          highlight="earn more"
          description="Get matched to jobs that fit your profile. Accept nearby deliveries and focus on the road — not the paperwork."
          benefits={driverBenefits}
        />
      </SectionContainer>

      <SectionContainer id="for-organizations">
        <BenefitsBlock
          icon={Building2}
          badge="For Organizations"
          title="Dispatch faster,"
          highlight="track everything"
          description="Post deliveries in seconds, let AI handle matching, and monitor every route from a single dashboard."
          benefits={orgBenefits}
        />
      </SectionContainer>
    </>
  );
}

function BenefitsBlock({
  icon: BlockIcon,
  badge,
  title,
  highlight,
  description,
  benefits,
}: {
  icon: LucideIcon;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  benefits: typeof BENEFITS;
}) {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:flex">
          <BlockIcon className="h-6 w-6 text-primary" />
        </div>
        <SectionHeader
          badge={badge}
          title={title}
          highlight={highlight}
          description={description}
          align="left"
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <motion.div
            key={`${badge}-${benefit.title}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <Card className="h-full border-border/80">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
