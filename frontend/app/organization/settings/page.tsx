"use client";

/**
 * app/organization/settings/page.tsx
 * Organization Settings page — UI mockup
 * Displays notification toggles, billing profiles, organization details, privacy preferences, and account controls.
 */

import { useState, useEffect } from "react";
import { Bell, Shield, Building2, ChevronRight, Palette } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useTheme } from "@/providers/theme-provider";

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

export default function OrgSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { activeOrganization } = useOrganizations();

  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [notifications, setNotifications] = useState({
    driverAssigned: true,
    deliveryStarted: true,
    deliveryComplete: true,
    weeklyReport: true,
    systemAlerts: false,
  });

  const [useCompactTables, setUseCompactTables] = useState(false);

  const handleSaveChanges = () => {
    alert("Organization settings updated successfully! Configurations logged.");
  };

  const org = activeOrganization || {
    name: "Apex Global Logistics",
    industry: "Retail & E-commerce",
    email: "ops@apexlogistics.com",
    phone: "+1 (800) 555-0101",
    address: "100 Logistics Blvd, Dallas, TX 75201",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage organization profiles, notifications, team access, and regional preferences."
      />

      <div className="max-w-2xl space-y-6">
        {/* Org Details Card */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Building2 className="h-4.5 w-4.5 text-primary" aria-hidden />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 pt-0">
            {[
              { label: "Organization Name", value: org.name },
              { label: "Industry Sector", value: org.industry },
              { label: "Corporate Email", value: org.email },
              { label: "Billing Phone", value: org.phone },
            ].map((field) => (
              <div key={field.label} className="rounded-2xl bg-muted/40 p-4 border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{field.label}</p>
                <p className="mt-1 text-xs font-semibold text-foreground">{field.value}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <div className="rounded-2xl bg-muted/40 p-4 border border-border/50">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Registered Address</p>
                <p className="mt-1 text-xs font-semibold text-foreground">{org.address}</p>
              </div>
            </div>
            <div className="sm:col-span-2 pt-2">
              <Button onClick={() => alert("Edit organization details is disabled in this mockup.")} variant="outline" size="sm" className="rounded-xl text-xs h-9">
                Edit Organization Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Bell className="h-4.5 w-4.5 text-primary" aria-hidden />
              Notifications & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 pt-0">
            <Toggle
              id="notif-driver-assigned"
              label="Driver Match Assignments"
              description="Receive notifications when a driver accepts your delivery request."
              checked={notifications.driverAssigned}
              onChange={(v) => setNotifications((n) => ({ ...n, driverAssigned: v }))}
            />
            <Toggle
              id="notif-delivery-started"
              label="Delivery Started Updates"
              description="Alert when the driver officially begins route tracking."
              checked={notifications.deliveryStarted}
              onChange={(v) => setNotifications((n) => ({ ...n, deliveryStarted: v }))}
            />
            <Toggle
              id="notif-delivery-complete"
              label="Delivery Completion Invoices"
              description="Alert when the driver uploads photo proof of delivery."
              checked={notifications.deliveryComplete}
              onChange={(v) => setNotifications((n) => ({ ...n, deliveryComplete: v }))}
            />
            <Toggle
              id="notif-weekly"
              label="Weekly Analytical Digest"
              description="Receive a consolidated spent & completion rate review on Mondays."
              checked={notifications.weeklyReport}
              onChange={(v) => setNotifications((n) => ({ ...n, weeklyReport: v }))}
            />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Palette className="h-4.5 w-4.5 text-primary" />
              Appearance Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 pt-0">
            <Toggle
              id="app-theme"
              label="Dark Theme Mode"
              description="Toggle dark background settings for dashboard viewports."
              checked={mounted && theme === "dark"}
              onChange={(v) => setTheme(v ? "dark" : "light")}
            />
            <Toggle
              id="app-compact"
              label="Compact Tables View"
              description="Compress tables and tracking logs rows."
              checked={useCompactTables}
              onChange={(v) => setUseCompactTables(v)}
            />
          </CardContent>
        </Card>

        {/* Account and billing Actions */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Shield className="h-4.5 w-4.5 text-primary" aria-hidden />
              Account & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            {[
              { label: "Change Password", description: "Update corporate account access password" },
              { label: "Billing Profiles & Invoices", description: "View monthly corporate bills and invoices" },
              { label: "Team Members Permissions", description: "Manage operator access controls" },
              { label: "Delete Organization Account", description: "Permanently delete organization records", danger: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => alert(`Redirecting to mock settings: ${item.label}`)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="text-left">
                  <p className={cn("text-xs font-semibold", item.danger ? "text-red-500" : "text-foreground")}>{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
              </button>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSaveChanges} className="w-full rounded-xl h-11">Save Configurations</Button>
      </div>
    </div>
  );
}
