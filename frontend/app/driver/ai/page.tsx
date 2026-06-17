"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { formatCurrency } from "@/utils/formatters";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/data-display/displays";
import { cn } from "@/lib/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "How many deliveries did I complete?",
  "What's my current rating?",
  "Show me my total earnings",
  "What are my pending deliveries?",
];

export default function DriverAIPage() {
  const { activeDriver, currentDriverId } = useDrivers();
  const { deliveries } = useDeliveries();

  const driverName = activeDriver?.name || "Driver";
  const driverInitials = activeDriver?.avatarInitials || "D";
  const driverRating = activeDriver?.rating || 4.9;

  const myDeliveries = deliveries.filter((d) => d.driverId === currentDriverId);
  const completedJobs = myDeliveries.filter((d) => ["delivered", "completed", "rated"].includes(d.status));
  const totalEarnings = completedJobs.reduce((sum, d) => sum + d.payment, 0);
  const availableJobs = deliveries.filter(
    (d) => d.status === "available" && d.vehicleType.toLowerCase() === activeDriver?.vehicleType?.toLowerCase()
  );

  const getAIResponse = (input: string): string => {
    const key = input.toLowerCase().trim().replace(/[?!.]/g, "");
    
    if (key.includes("how many deliveries") || key.includes("completed")) {
      return `You have completed **${completedJobs.length} deliveries** under your active profile on our logistics network. Let me know if you would like me to summarize your route statistics.`;
    }
    if (key.includes("rating") || key.includes("score")) {
      return `Your current average driver rating is **${driverRating} out of 5.0** ⭐, which ranks you as a premium carrier. Organizations consistently praise your load safety compliance.`;
    }
    if (key.includes("earnings") || key.includes("payout")) {
      return `Your total verified earnings is **${formatCurrency(totalEarnings)}**. This has been fully cleared to your connected bank account.`;
    }
    if (key.includes("pending") || key.includes("available")) {
      return `There are currently **${availableJobs.length} pending cargo matches** available near you matching your vehicle type. Go to the available dispatches feed to accept a job.`;
    }
    
    return `That is an excellent query! I am currently operating in Copilot preview mode. Full interactive conversational logs powered by Gemini API are scheduled for a later sprint. Let me know if you want stats about your deliveries, ratings, or payouts!`;
  };

  const INITIAL_MESSAGES: Message[] = [
    {
      id: "init_1",
      role: "assistant",
      content: `Hello ${driverName.split(" ")[0]}! I'm your DriveLink AI driver copilot. I can help you query your route telemetry, payouts, ratings, or cargo profiles. Ask me anything!`,
    },
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const reply: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: getAIResponse(text),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="AI Driver Copilot"
        subtitle="Ask questions about your completed trips, average safety ratings, or payout logs."
      />

      <Card className="flex flex-1 flex-col overflow-hidden rounded-2xl border-border bg-card mt-4">
        {/* Messages Container */}
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0 bg-background/50">
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                      </div>
                    ) : (
                      <Avatar name={driverName} size="sm" />
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                        msg.role === "assistant"
                          ? "bg-card border border-border text-slate-800 dark:text-slate-200"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-card border border-border px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick prompts */}
          <div className="border-t border-border bg-card/30 px-4 py-3 select-none">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick queries</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-slate-500 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t border-border bg-card p-4">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                id="driver-ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about deliveries, earnings, ratings..."
                className="flex-1 h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isTyping}
                aria-label="Message to AI assistant"
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
