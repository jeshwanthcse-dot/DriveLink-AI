"use client";

/**
 * app/driver/settings/page.tsx
 * Driver Settings Page — UI mockup
 * Displays notification toggles, privacy settings, theme and appearance configurations, languages, and account actions.
 */

import { useState, useEffect } from "react";
import { Bell, Shield, Smartphone, Globe, ChevronRight, Palette } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/badges/badge";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
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
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 py-4">
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
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

export default function DriverSettingsPage() {
  const [notifications, setNotifications] = useState({
    newDelivery: true,
    ratingReceived: true,
    systemUpdates: false,
    emailDigest: true,
  });

  const [privacy, setPrivacy] = useState({
    showRating: true,
    showLocation: true,
  });

  const { theme, setTheme } = useTheme();

  const [appearance, setAppearance] = useState({
    darkMode: theme === "dark",
    useCompactLayout: false,
  });

  useEffect(() => {
    setAppearance((a) => ({ ...a, darkMode: theme === "dark" }));
  }, [theme]);

  const handleSaveChanges = () => {
    alert("Settings updated successfully! Changes saved to mock client profile.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your notification preferences, privacy, language, and account appearance."
      />

      <div className="max-w-2xl space-y-6">
        {/* Notifications */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Bell className="h-4.5 w-4.5 text-primary" aria-hidden />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 pt-0">
            <Toggle
              id="notif-new-delivery"
              label="New Delivery Alerts"
              description="Get notified when a delivery matches your profile."
              checked={notifications.newDelivery}
              onChange={(v) => setNotifications((n) => ({ ...n, newDelivery: v }))}
            />
            <Toggle
              id="notif-rating"
              label="Rating Received"
              description="Get notified when an organization rates your delivery."
              checked={notifications.ratingReceived}
              onChange={(v) => setNotifications((n) => ({ ...n, ratingReceived: v }))}
            />
            <Toggle
              id="notif-system"
              label="System Updates"
              description="Platform updates, maintenance alerts, and announcements."
              checked={notifications.systemUpdates}
              onChange={(v) => setNotifications((n) => ({ ...n, systemUpdates: v }))}
            />
            <Toggle
              id="notif-email"
              label="Weekly Email Digest"
              description="Receive a weekly summary of your earnings and performance."
              checked={notifications.emailDigest}
              onChange={(v) => setNotifications((n) => ({ ...n, emailDigest: v }))}
            />
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Shield className="h-4.5 w-4.5 text-primary" aria-hidden />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 pt-0">
            <Toggle
              id="priv-rating"
              label="Show Rating Publicly"
              description="Display your average rating on your public profile card."
              checked={privacy.showRating}
              onChange={(v) => setPrivacy((p) => ({ ...p, showRating: v }))}
            />
            <Toggle
              id="priv-location"
              label="Share Location During Delivery"
              description="Allow organizations to see your live coordinates during active trips."
              checked={privacy.showLocation}
              onChange={(v) => setPrivacy((p) => ({ ...p, showLocation: v }))}
            />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Palette className="h-4.5 w-4.5 text-primary" aria-hidden />
              Appearance & Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 pt-0">
            <Toggle
              id="app-theme"
              label="Dark Theme Mode"
              description="Toggle dark background settings for dashboard viewports."
              checked={appearance.darkMode}
              onChange={(v) => {
                setAppearance((a) => ({ ...a, darkMode: v }));
                setTheme(v ? "dark" : "light");
              }}
            />
            <Toggle
              id="app-compact"
              label="Compact Row Layout"
              description="Compress cards and padding for information-dense layouts."
              checked={appearance.useCompactLayout}
              onChange={(v) => setAppearance((a) => ({ ...a, useCompactLayout: v }))}
            />
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Smartphone className="h-4.5 w-4.5 text-primary" aria-hidden />
              Account & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            {[
              { label: "Change Password", description: "Update your account password" },
              { label: "Language & Region", description: "English (India) · IST" },
              { label: "Delete Account", description: "Permanently remove your account", danger: true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => alert(`Redirecting to mock settings: ${item.label}`)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="text-left">
                  <p className={cn("text-xs font-semibold", item.danger ? "text-red-500" : "text-foreground")}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
              </button>
            ))}
          </CardContent>
        </Card>

        <ReusableButton onClick={handleSaveChanges} className="w-full rounded-xl">Save All Changes</ReusableButton>
      </div>
    </div>
  );
}
