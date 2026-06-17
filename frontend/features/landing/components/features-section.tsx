"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/constants/landing";

export function FeaturesSection() {
  return (
    <SectionContainer id="features">
      <SectionHeader
        badge="Platform Features"
        title="Everything you need to move"
        highlight="faster"
        description="From intelligent matching to offline-ready tracking — DriveLink AI handles the full delivery lifecycle."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </SectionContainer>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Card className="group h-full transition-all duration-300 hover:border-primary/20 hover:shadow-elevated">
        <CardContent className="p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
