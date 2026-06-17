"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { BookOpen, Calendar, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "Optimizing Fleet Match Latency using Proximity Scopes",
      date: "June 12, 2026",
      desc: "How DriveLink AI matching algorithms analyze rating indices and distance telemetry in less than 50ms.",
      readTime: "5 min read",
    },
    {
      title: "Maintaining PII Vetting Protections on Carrier Networks",
      date: "May 28, 2026",
      desc: "Our secure credentials protocol restricts shippers from viewing raw license PDFs while exposing verified audits.",
      readTime: "4 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumb section */}
      <SectionContainer className="pb-0 pt-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Blog</span>
        </div>
      </SectionContainer>

      {/* Hero Section */}
      <SectionContainer className="pt-8 pb-12">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <Badge variant="default">DriveLink AI Blog</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Logistics & Engineering <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore articles about freight matching engines, GPS tracking architectures, and offline sync.
          </p>
        </div>
      </SectionContainer>

      {/* Blog Feed Section */}
      <SectionContainer className="py-12 border-t border-border/40">
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {posts.map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-border bg-card shadow-card flex flex-col justify-between text-left space-y-4"
            >
              <div className="space-y-2">
                <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{post.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{post.desc}</p>
              </div>

              <div className="pt-4">
                <LinkButton href="/contact" size="sm" variant="ghost" className="text-primary hover:text-primary/90 p-0 text-xs flex items-center gap-1.5">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
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
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore developer integrations?</h2>
            <p className="text-sm text-blue-100">Access documentation, guides, and sandbox endpoints.</p>
            <div className="pt-4 flex justify-center gap-4">
              <LinkButton href="/organizations" size="lg" variant="default">
                Sign Up Now
              </LinkButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
