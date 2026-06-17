"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { HOW_IT_WORKS_STEPS } from "@/constants/landing";

export function HowItWorksSection() {
  return (
    <SectionContainer id="how-it-works" className="bg-muted/20">
      <SectionHeader
        badge="How It Works"
        title="From request to delivery in"
        highlight="five steps"
        description="No phone tag. No manual dispatch. DriveLink AI automates the entire workflow."
      />

      <div className="relative mt-16">
        <div
          className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:left-1/2 lg:block lg:-translate-x-px"
          aria-hidden
        />

        <div className="space-y-8 lg:space-y-12">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepRow key={step.step} {...step} index={index} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

function StepRow({
  step,
  title,
  description,
  index,
}: {
  step: number;
  title: string;
  description: string;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className={`relative flex flex-col gap-4 lg:flex-row lg:items-center ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <div className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
        <div
          className={`inline-block rounded-2xl border border-border bg-card p-6 shadow-card ${
            isEven ? "lg:ml-auto" : ""
          } max-w-md`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step {step}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-center lg:w-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary shadow-soft">
          {step}
        </div>
      </div>

      <div className="hidden flex-1 lg:block" />
    </motion.div>
  );
}
