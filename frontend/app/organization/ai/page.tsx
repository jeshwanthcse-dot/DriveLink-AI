"use client";

/**
 * app/organization/ai/page.tsx
 * Organization AI Assistant Page — UI mockup
 * Scoped specifically to organization statistics, driver database, and logistics reports (zero driver profile sharing).
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/common/page-header";
import { Avatar } from "@/components/common/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDrivers } from "@/hooks/useDrivers";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "How many deliveries are active right now?",
  "What's our on-time delivery rate?",
  "Which driver has the best rating?",
  "How much have we spent this month?",
];

function getOrgAIResponse(input: string, deliveries: any[], drivers: any[], currentOrgId: string): string {
  const normalized = input.toLowerCase().trim().replace(/[?!.]/g, "");
  
  const orgDeliveries = deliveries.filter((d) => d.organizationId === currentOrgId);
  const activeCount = orgDeliveries.filter((d) =>
    ["published", "available", "accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(d.status)
  ).length;
  const inTransit = orgDeliveries.filter((d) => ["pickup_started", "in_transit", "near_destination"].includes(d.status));
  const matched = orgDeliveries.filter((d) => ["accepted", "assigned"].includes(d.status));
  const pending = orgDeliveries.filter((d) => ["available", "published"].includes(d.status));
  const completed = orgDeliveries.filter((d) => ["delivered", "completed", "rated"].includes(d.status));
  
  if (normalized.includes("how many deliveries are active right now") || normalized.includes("active deliveries")) {
    return `You currently have **${activeCount} active delivery requests**:\n- **${inTransit.length}** in transit\n- **${matched.length}** matched\n- **${pending.length}** awaiting driver assignment.\n\n${
      inTransit.length > 0
        ? `The transit shipment ${inTransit[0].deliveryNumber} is estimated to arrive in ${inTransit[0].estimatedTime || "45 minutes"}.`
        : "There are currently no shipments in transit."
    }`;
  }
  
  if (normalized.includes("on-time delivery rate") || normalized.includes("delivery rate") || normalized.includes("sla")) {
    const total = orgDeliveries.length;
    const deliveredCount = completed.length;
    const onTimeRate = total > 0 ? Math.min(100, Math.round((deliveredCount / total) * 100)) : 96;
    return `Your on-time delivery rate is **${onTimeRate}%** — well above the industry average of 89%. Over the past 30 days, your delivery matched pipelines have registered 0 severe incidents.`;
  }
  
  if (normalized.includes("driver") && (normalized.includes("best") || normalized.includes("rating"))) {
    const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);
    if (sortedDrivers.length > 0) {
      const best = sortedDrivers[0];
      const second = sortedDrivers[1];
      return `Based on active ratings in the system, **${best.name}** has the highest rating at **★${best.rating.toFixed(2)}** (${best.completedDeliveries} completed deliveries). ${
        second ? `**${second.name}** is a close second at **★${second.rating.toFixed(2)}**.` : ""
      }`;
    }
    return "No drivers are currently registered in your zone.";
  }
  
  if (normalized.includes("spent") || normalized.includes("spend") || normalized.includes("cost")) {
    const completedPayment = completed.reduce((sum, d) => sum + d.payment, 0);
    const totalSpend = 94200 + completedPayment;
    const count = 187 + completed.length;
    return `Your total spend is **₹${totalSpend.toLocaleString("en-IN")}** across ${count} deliveries. This represents an average cost of **₹${Math.round(totalSpend / count)}** per delivery request.`;
  }
  
  return "Great question! I have access to your organization's delivery records, driver ratings, and cost reports. I'm currently in preview mode — full Gemini AI integration is coming in a future sprint. Is there something specific about your delivery operations I can help with?";
}

export default function OrgAIPage() {
  const { deliveries } = useDeliveries();
  const { activeOrganization, currentOrgId } = useOrganizations();
  const { drivers } = useDrivers();

  const orgName = activeOrganization?.name || "Apex Global Logistics";
  const orgAvatarInitials = activeOrganization?.avatarInitials || "AG";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && orgName) {
      setMessages([
        {
          id: "init_1",
          role: "assistant",
          content: `Hello! I'm your Organization AI assistant for ${orgName}. I can help you analyze your delivery data, driver performance, costs, and generate reports. What would you like to explore?`,
        },
      ]);
      hasInitialized.current = true;
    }
  }, [orgName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          id: `a_${Date.now()}`, 
          role: "assistant", 
          content: getOrgAIResponse(text, deliveries, drivers, currentOrgId) 
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask about your deliveries, driver performance, costs, and operational reports."
      />

      <Card className="flex flex-1 flex-col overflow-hidden rounded-2xl border-border mt-4">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0 bg-background/50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("flex items-start gap-3", msg.role === "user" && "flex-row-reverse")}
                  >
                    {msg.role === "assistant" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                        <BarChart3 className="h-4 w-4 text-secondary" aria-hidden />
                      </div>
                    ) : (
                      <Avatar initials={orgAvatarInitials} size="sm" />
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-line",
                        msg.role === "assistant"
                          ? "bg-card border border-border text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                    <BarChart3 className="h-4 w-4 text-secondary" aria-hidden />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-card border border-border px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick prompts */}
          <div className="border-t border-border bg-card/30 px-4 py-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick queries</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-secondary/40 hover:bg-secondary/5 hover:text-secondary active:scale-[0.98]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t border-border bg-card p-4">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
              <input
                id="org-ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about deliveries, drivers, or spend rates..."
                className="flex-1 h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isTyping}
                aria-label="Message to Organization AI assistant"
              />
              <Button type="submit" size="sm" className="h-10 px-4" disabled={!input.trim() || isTyping} aria-label="Send message">
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
