"use client";

/**
 * app/organization/analytics/page.tsx
 * Operations Analytics page — UI mockup
 * Displays monthly shipment summaries, spending breakdowns, performance metrics, and top drivers.
 */

import { useMemo } from "react";
import { DollarSign, Package, Clock, Award, Users, Star } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/common/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDrivers } from "@/hooks/useDrivers";

export default function OrgAnalyticsPage() {
  const { deliveries } = useDeliveries();
  const { currentOrgId } = useOrganizations();
  const { drivers } = useDrivers();

  const orgDeliveries = useMemo(() => {
    return deliveries.filter((d) => d.organizationId === currentOrgId);
  }, [deliveries, currentOrgId]);

  const completedRuns = useMemo(() => {
    return orgDeliveries.filter((d) => d.status === "delivered");
  }, [orgDeliveries]);

  const totalSpend = useMemo(() => {
    const completedPayment = completedRuns.reduce((sum, d) => sum + d.payment, 0);
    // Base historical spend of ₹94,200 plus newly completed runs
    return 94200 + (completedPayment > 0 ? completedPayment : 0);
  }, [completedRuns]);

  const avgCost = useMemo(() => {
    const totalCount = orgDeliveries.length;
    if (totalCount === 0) return 503;
    const totalPayment = orgDeliveries.reduce((sum, d) => sum + d.payment, 0);
    return Math.round(totalPayment / totalCount);
  }, [orgDeliveries]);

  const activeDriversCount = useMemo(() => {
    return drivers.filter((d) => d.status !== "offline").length;
  }, [drivers]);

  const monthlyVolume = useMemo(() => {
    const currentMonthCount = orgDeliveries.length;
    const baseCounts = [24, 28, 35, 42, 31, currentMonthCount + 15];
    const maxVal = Math.max(...baseCounts);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, idx) => {
      const count = baseCounts[idx];
      const pct = maxVal > 0 ? (count / maxVal) * 100 : 10;
      return { month, count, pct };
    });
  }, [orgDeliveries]);

  const SLA_Rates = useMemo(() => {
    const total = orgDeliveries.length;
    const deliveredCount = completedRuns.length;
    // Standard base rate of 96%, updates dynamically if deliveries exist
    const onTimeRate = total > 0 ? Math.min(100, Math.round((deliveredCount / total) * 100)) : 96;
    return [
      { label: "On-Time Delivery Rate", pct: onTimeRate, labelVal: `${onTimeRate}.0%` },
      { label: "AI Match Success Rate", pct: 98, labelVal: "98.2%" },
      { label: "Incident-Free Trips", pct: 100, labelVal: "100.0%" },
      { label: "Driver Acceptance SLA", pct: 92, labelVal: "92.1%" },
    ];
  }, [orgDeliveries, completedRuns]);

  const topDriversList = useMemo(() => {
    return [...drivers]
      .sort((a, b) => b.completedDeliveries - a.completedDeliveries)
      .slice(0, 3)
      .map((d) => ({
        name: d.name,
        deliveries: d.completedDeliveries,
        rating: d.rating,
        earnings: `₹${(d.completedDeliveries * 480).toLocaleString("en-IN")}`
      }));
  }, [drivers]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Overview"
        subtitle="Review historical spend parameters, delivery completion stats, and partner performance."
      />

      {/* Analytics stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Spend"
          value={`₹${totalSpend.toLocaleString("en-IN")}`}
          icon={DollarSign}
          trend={{ value: "+8.3% vs last month", direction: "up" }}
        />
        <StatsCard
          label="Completed Runs"
          value={(187 + completedRuns.length).toString()}
          icon={Package}
          trend={{ value: "+14.2% vs last month", direction: "up" }}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
        />
        <StatsCard
          label="Avg Cost per Trip"
          value={`₹${avgCost.toLocaleString("en-IN")}`}
          icon={Clock}
          trend={{ value: "-₹24 vs last month", direction: "down" }}
        />
        <StatsCard
          label="Active Drivers Vetted"
          value={activeDriversCount.toString()}
          icon={Users}
          trend={{ value: `${drivers.filter(d => d.status === "available").length} ready in zone`, direction: "up" }}
          iconBg="bg-blue-50"
          iconColor="text-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Shipments bar chart simulator */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold">Monthly Deliveries Volume</CardTitle>
            <CardDescription className="text-xs">Trips processed over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-between gap-2 pt-6">
            {monthlyVolume.map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground">{bar.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-500 hover:from-primary/90 hover:to-blue-400 transition-all"
                  style={{ height: `${bar.pct}%`, minHeight: "8px" }}
                />
                <span className="text-xs font-semibold text-muted-foreground">{bar.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completion Rates */}
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold">Operational Quality Scores</CardTitle>
            <CardDescription className="text-xs">Trips SLA parameters and completion efficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {SLA_Rates.map((sla) => (
              <div key={sla.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{sla.label}</span>
                  <span className="text-foreground">{sla.labelVal}</span>
                </div>
                <div className="overflow-hidden rounded-full bg-muted h-2.5 w-full">
                  <div className="h-2.5 rounded-full bg-secondary transition-all duration-500" style={{ width: `${sla.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Drivers Table */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-secondary" />
            Top Partner Drivers
          </CardTitle>
          <CardDescription className="text-xs">Based on completed runs, cost savings, and quality reviews</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed Runs</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average Stars</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Payouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topDriversList.map((driver) => (
                <tr key={driver.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{driver.name}</td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{driver.deliveries} trips</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {driver.rating.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-secondary">{driver.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
