"use client";

import { motion } from "framer-motion";
import { Clock, Gauge, MapPin, Navigation, Route } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TRACKING_METRICS } from "@/constants/landing";

const METRIC_ICONS = [MapPin, Gauge, Clock, Navigation, Route];

export function LiveTrackingSection() {
  return (
    <SectionContainer id="live-tracking" className="bg-muted/20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 lg:order-1"
        >
          <TrackingMapVisual />
        </motion.div>

        <div className="order-1 lg:order-2">
          <SectionHeader
            badge="Live Tracking"
            title="See every mile,"
            highlight="in real time"
            description="Open-source real-time maps give organizations full visibility — from pickup through final drop-off."
            align="left"
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TRACKING_METRICS.map((metric, index) => {
              const Icon = METRIC_ICONS[index] ?? MapPin;
              return (
                <div
                  key={metric}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-soft"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{metric}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3">
            <p className="text-sm text-amber-900/80">
              <span className="font-semibold">Device offline?</span> Show last known
              location and resume automatically when the device reconnects.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

function TrackingMapVisual() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Tracking</p>
            <p className="font-semibold text-foreground">DLV-7823</p>
          </div>
          <Badge variant="success">In Transit</Badge>
        </div>

        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-blue-50/50">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 480 360"
            fill="none"
            aria-hidden
          >
            <path
              d="M60 280 C140 200 200 220 280 160 S400 100 420 80"
              stroke="#2563EB"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="60" cy="280" r="10" fill="#16A34A" stroke="white" strokeWidth="3" />
            <circle cx="280" cy="160" r="8" fill="#2563EB" stroke="white" strokeWidth="2">
              <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="420" cy="80" r="10" fill="#2563EB" stroke="white" strokeWidth="3" />
          </svg>

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute left-4 top-4 rounded-xl border border-border bg-white/95 px-4 py-3 shadow-card backdrop-blur-sm"
          >
            <p className="text-xs text-muted-foreground">Estimated Arrival</p>
            <p className="text-xl font-bold text-foreground">20 min</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute bottom-4 right-4 rounded-xl border border-border bg-white/95 px-4 py-3 shadow-card backdrop-blur-sm"
          >
            <p className="text-xs text-muted-foreground">Distance Remaining</p>
            <p className="text-xl font-bold text-foreground">12.4 km</p>
          </motion.div>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          {["Pickup", "In Transit", "Drop-off"].map((stage, i) => (
            <div key={stage} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  i <= 1 ? "bg-primary" : "bg-muted"
                }`}
              />
              <span
                className={`text-xs ${
                  i === 1 ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
