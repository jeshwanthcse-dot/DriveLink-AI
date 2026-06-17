"use client";

/**
 * /faq — Accordion FAQ page
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { MOCK_FAQ_ITEMS } from "@/constants/org-nav";
import { cn } from "@/lib/cn";

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(MOCK_FAQ_ITEMS[0].id);

  return (
    <>
      <SectionContainer className="pb-0 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">FAQ</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently asked <span className="text-gradient">questions</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about DriveLink AI — from driver matching to proof of delivery.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          {MOCK_FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="pr-4 text-sm font-semibold text-foreground sm:text-base">{item.question}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pt-0 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="font-semibold text-foreground">Still have questions?</p>
          <p className="mt-1 text-sm text-muted-foreground">Our team is happy to help you get started.</p>
          <LinkButton href="/contact" variant="outline" size="sm" className="mt-4">Contact Support</LinkButton>
        </div>
      </SectionContainer>
    </>
  );
}
