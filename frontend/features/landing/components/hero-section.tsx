"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { BRAND } from "@/constants/landing";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
      <div className="hero-glow grid-pattern absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <Badge variant="default" className="mb-6">
                AI-Powered Logistics Marketplace
              </Badge>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Smart{" "}
              <span className="text-gradient">Driver Matching.</span>
              <br />
              Intelligent{" "}
              <span className="text-gradient">Deliveries.</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {BRAND.description}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <LinkButton href="/organizations" size="lg" className="group">
                For Organizations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href="/drivers" variant="outline" size="lg">
                For Drivers
              </LinkButton>
            </motion.div>

            <motion.ul
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
            >
              {["No manual approval", "Real-time tracking", "Offline-ready"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    {item}
                  </li>
                )
              )}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-2xl" />

      <div className="relative rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Route</p>
              <p className="font-semibold text-foreground">DLV-7823 · In Transit</p>
            </div>
          </div>
          <Badge variant="success">Live</Badge>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-muted/50">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 250"
              fill="none"
              aria-hidden
            >
              <path
                d="M40 180 Q120 120 200 140 T360 80"
                stroke="#2563EB"
                strokeWidth="3"
                strokeDasharray="8 4"
                fill="none"
                opacity="0.6"
              />
              <circle cx="40" cy="180" r="8" fill="#16A34A" />
              <circle cx="360" cy="80" r="8" fill="#2563EB" />
            </svg>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur-sm">
              <span className="text-xs font-medium text-muted-foreground">ETA</span>
              <span className="text-sm font-semibold text-foreground">20 min · 12.4 km</span>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 -top-4 w-[220px] rounded-2xl border border-border bg-card p-4 shadow-elevated sm:-right-6 sm:w-[240px]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-xs font-semibold text-foreground">AI Match Found!</p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              JS
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">John Smith</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">4.9 · 2.3 km away</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/10 px-3 py-2">
            <span className="text-xs font-medium text-secondary">98% Match</span>
            <Button size="sm" variant="secondary" className="h-7 px-3 text-xs">
              Assign
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
