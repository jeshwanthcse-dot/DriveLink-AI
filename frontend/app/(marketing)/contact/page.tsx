"use client";

/**
 * /contact — Contact page (static, no form submission)
 */

import { Mail, Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";


const CONTACT_CHANNELS = [
  { icon: Mail, title: "Email Us", description: "For general inquiries and support", value: "hello@drivelinkai.com", cta: "Send an Email", href: "mailto:hello@drivelinkai.com" },
  { icon: Phone, title: "Call Us", description: "Mon–Fri, 9am – 6pm IST", value: "+91 80 4567 8900", cta: "Call Now", href: "tel:+918045678900" },
  { icon: MessageSquare, title: "Live Chat", description: "Talk to our team in real time", value: "Available in app", cta: "Open Chat", href: "#" },
];

export default function ContactPage() {
  return (
    <>
      <SectionContainer className="pb-0 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">Contact</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            We&apos;re here to <span className="text-gradient">help</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Reach out for support, partnership inquiries, or any questions about the platform.</p>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-3">
          {CONTACT_CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.title} className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <h2 className="font-semibold text-foreground">{channel.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
                <p className="mt-3 font-medium text-foreground">{channel.value}</p>
                <LinkButton href={channel.href} variant="outline" size="sm" className="mt-6 self-start" external={channel.href.startsWith("mailto") || channel.href.startsWith("tel")}>
                  {channel.cta}
                </LinkButton>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10">
            <h2 className="text-xl font-bold text-foreground">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you within one business day.</p>
            <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-first-name" className="mb-1.5 block text-sm font-medium text-foreground">First name</label>
                  <input id="contact-first-name" type="text" placeholder="James" className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="mb-1.5 block text-sm font-medium text-foreground">Last name</label>
                  <input id="contact-last-name" type="text" placeholder="Okafor" className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">Email address</label>
                <input id="contact-email" type="email" placeholder="james@example.com" className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                <select id="contact-subject" className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow">
                  <option value="">Select a topic…</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="billing">Billing</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
                <textarea id="contact-message" rows={5} placeholder="Tell us how we can help…" className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0">
        <div className="mx-auto flex max-w-2xl flex-wrap items-start gap-6 rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Headquarters</h3>
              <p className="mt-1 text-sm text-muted-foreground">DriveLink AI Technologies Pvt. Ltd.<br />42 Innovation Drive, Bengaluru 560001<br />Karnataka, India</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Office Hours</h3>
              <p className="mt-1 text-sm text-muted-foreground">Monday – Friday<br />9:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
