"use client";

/**
 * app/organization/drivers/page.tsx
 * Drivers Directory page — UI mockup
 * Displays verified transport drivers, ratings, vehicle details, and real-time availability status.
 */

import { useState, useMemo, useEffect } from "react";
import { Star, Phone, Shield } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { Avatar } from "@/components/common/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDrivers } from "@/hooks/useDrivers";
import type { DriverStatus } from "@/types/driver";
import { useTrustStore } from "@/store/trust-store";

const STATUS_BADGE: Record<string, string> = {
  available: "bg-secondary/15 text-secondary border-none",
  on_delivery: "bg-primary/10 text-primary border-none",
  offline: "bg-muted text-muted-foreground border-none",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Online (Available)",
  on_delivery: "Busy (On Delivery)",
  offline: "Offline",
};

const getLanguages = (id: string) => {
  const map: Record<string, string[]> = {
    "DRV-001": ["English", "Spanish"],
    "DRV-002": ["English", "French"],
    "DRV-003": ["English", "German"],
    "DRV-004": ["English", "Russian"],
    "DRV-005": ["English"],
    "DRV-006": ["English", "Akan"],
    "DRV-007": ["English", "Spanish"],
    "DRV-008": ["English", "Mandarin"],
    "DRV-009": ["English"],
    "DRV-010": ["English", "Arabic"],
  };
  return map[id] || ["English"];
};

const formatVehicleType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function OrgDriversPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DriverStatus>("all");
  const { drivers } = useDrivers();
  const getProfile = useTrustStore((state) => state.getProfile);
  const profiles = useTrustStore((state) => state.profiles); // Reactivity trigger

  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  useEffect(() => {
    useTrustStore.getState().loadFromStorage();
  }, []);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const langs = getLanguages(d.id);
      const vehicleReadable = formatVehicleType(d.vehicleType);
      
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        vehicleReadable.toLowerCase().includes(search.toLowerCase()) ||
        langs.some((lang) => lang.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const handleContact = (name: string) => {
    alert(`Initiating mock call session to: ${name}. Connection active.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers Directory"
        subtitle="Search, sort, and review all verified transport drivers registered in your service zone."
      />

      {/* Filter widgets */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="max-w-xs flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, vehicle, or language..."
            id="driver-directory-search"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
          {(["all", "available", "on_delivery", "offline"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "all" ? "All Drivers" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust Score</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification Tier</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Vehicle Details</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Languages</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((driver) => {
                const driverLanguages = getLanguages(driver.id);
                const profile = getProfile(driver.id);
                return (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={driver.avatarInitials} size="sm" />
                        <div>
                          <p className="font-bold text-foreground text-xs">{driver.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-bold text-muted-foreground">{driver.rating.toFixed(2)} · {driver.completedDeliveries} trips</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {profile.trustScore}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const level = profile.verificationLevel;
                        let label = "Unverified";
                        let badgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
                        if (level === "elite") {
                          label = "Elite";
                          badgeClass = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50";
                        } else if (level === "vetted") {
                          label = "Vetted";
                          badgeClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50";
                        } else if (level === "basic") {
                          label = "Basic";
                          badgeClass = "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
                        }
                        return (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">{formatVehicleType(driver.vehicleType)}</p>
                      <p className="text-[10px] font-mono mt-0.5">{driver.vehiclePlate}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {driverLanguages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-[9px] py-0 px-1.5 font-semibold">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-foreground">
                      {driver.experience} Years
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_BADGE[driver.status]}`}>
                        {STATUS_LABELS[driver.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={() => handleContact(driver.name)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs rounded-xl gap-1 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Driver Security Detail Modal Dialog */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl max-w-md w-full p-6 shadow-elevated space-y-4 animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar initials={selectedDriver.avatarInitials} size="md" />
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">{selectedDriver.name}</h3>
                  <p className="text-xs text-slate-400">Compliance & Performance Report</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trust Score</div>
                <div className="text-xl font-black text-primary font-mono mt-1">
                  {getProfile(selectedDriver.id).trustScore}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verification Level</div>
                <div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase mt-2.5">
                  {getProfile(selectedDriver.id).verificationLevel}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Rating</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center justify-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {selectedDriver.rating.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Runs Finished</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                  {selectedDriver.completedDeliveries} Trips
                </div>
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl text-left text-[11px] text-emerald-800 dark:text-emerald-450 space-y-1 leading-relaxed">
              <div className="font-extrabold flex items-center gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                🛡️ Privacy Protocol Enabled
              </div>
              <p>
                To safeguard personal identifiable information (PII), raw credential files (e.g. driving license scans, commercial insurance contracts, PUC certificates) are restricted. Only computed validation stages and OCR audit logs are shown.
              </p>
            </div>

            {/* Close */}
            <div className="pt-2">
              <Button
                onClick={() => setSelectedDriver(null)}
                className="w-full text-xs"
              >
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
