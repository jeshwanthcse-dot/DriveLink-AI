"use client";

import { motion } from "framer-motion";
import { Brain, Bell, UserCheck } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AI_MATCHING_WEIGHTS } from "@/constants/landing";

export function AiMatchingSection() {
  return (
    <SectionContainer id="ai-matching">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader
            badge="AI Matching Engine"
            title="The right driver,"
            highlight="every time"
            description="Our ranking algorithm evaluates multiple signals to surface the best-qualified drivers — sorted descending, notified instantly."
            align="left"
          />

          <div className="mt-8 space-y-4">
            {[
              {
                icon: Brain,
                text: "Multi-factor scoring: rating, distance, experience, and delivery history",
              },
              {
                icon: Bell,
                text: "Top-ranked drivers receive push notifications immediately",
              },
              {
                icon: UserCheck,
                text: "First qualified driver to accept is assigned — zero manual approval",
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Match Score Breakdown</h3>
                <Badge variant="success">Live Algorithm</Badge>
              </div>

              <div className="mt-8 space-y-5">
                {AI_MATCHING_WEIGHTS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, width: 0 }}
                    whileInView={{ opacity: 1, width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="font-semibold text-primary">{item.weight}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.weight}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Top Match
                    </p>
                    <p className="font-semibold text-foreground">John Smith</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">98%</p>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
