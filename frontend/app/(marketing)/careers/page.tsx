"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const jobs = [
    { title: "Senior React Engineer", dept: "Product & Frontend", location: "Bengaluru, India (Hybrid)", type: "Full-Time" },
    { title: "Senior Systems Engineer (Go/Rust)", dept: "Infrastructure & Telemetry", location: "Remote / Bengaluru", type: "Full-Time" },
    { title: "Lead AI Research Scientist", dept: "Matching Algorithms", location: "Bengaluru, India (Hybrid)", type: "Full-Time" },
    { title: "Growth Operations Lead", dept: "Operations & Sales", location: "Mumbai, India", type: "Full-Time" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Careers</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <Badge variant="default">Join Our Fleet</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Build the future of <span className="text-gradient">logistics technology</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We are looking for creative engineers, researchers, and operators to construct modern freight systems.
          </p>
        </div>
      </SectionContainer>

      {/* Jobs list Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-6 text-left">Open Positions</h2>
          {jobs.map((job, idx) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 shadow-sm transition-all duration-200 text-left flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{job.title}</h3>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>{job.dept}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                  {job.type}
                </span>
                <LinkButton href="/contact" size="sm" variant="outline" className="text-xs h-9">
                  Apply Now
                </LinkButton>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Call to Action (CTA) */}
      <SectionContainer className="pb-20 pt-12">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Don&apos;t see the right role?</h2>
            <p className="text-sm text-blue-100">Send an open application to our human resources office.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/contact" size="lg" variant="default">
                Open Application
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
