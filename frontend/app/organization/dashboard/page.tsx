"use client";

/**
 * app/organization/dashboard/page.tsx
 * Organization Portal Dashboard Home Page — High-fidelity premium mockup
 * Displays operation summary stats, active delivery trackers, quick actions, and alerts.
 */

import * as React from "react";
import {
  Package,
  Truck,
  DollarSign,
  Star,
  Clock,
  ArrowRight,
  PlusCircle,
  MapPin,
  Users,
  BarChart3,
  Sparkles,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/common/stats-card";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useDrivers } from "@/hooks/useDrivers";
import { useTrackingStore } from "@/store/tracking-store";
import { DeliveryStatusBadge } from "@/components/delivery/DeliveryStatusBadge";
import { useMatchingStore } from "@/store/matching-store";
import { MatchScoreBadge } from "@/components/ai/MatchScoreBadge";

export default function OrgDashboardPage() {
  const { activeOrganization, currentOrgId } = useOrganizations();
  const { deliveries } = useDeliveries();
  const { drivers } = useDrivers();
  const sessions = useMatchingStore((state) => state.sessions);

  const orgName = activeOrganization?.name || "Organization";
  const orgIndustry = activeOrganization?.industry || "Logistics Network";

  // Filter deliveries for current organization
  const myDeliveries = React.useMemo(() => {
    return deliveries.filter((d) => d.organizationId === currentOrgId);
  }, [deliveries, currentOrgId]);

  // Compute stats
  const activeRequests = React.useMemo(() => {
    return myDeliveries.filter((d) =>
      ["published", "available", "accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(d.status)
    );
  }, [myDeliveries]);

  const completedRequests = React.useMemo(() => {
    return myDeliveries.filter((d) =>
      ["delivered", "completed", "rated"].includes(d.status)
    );
  }, [myDeliveries]);

  const totalSpend = React.useMemo(() => {
    return completedRequests.reduce((sum, d) => sum + d.payment, 0);
  }, [completedRequests]);

  const availableDrivers = React.useMemo(() => {
    return drivers.filter((d) => d.status === "available").length;
  }, [drivers]);

  // Recent notifications logs based on actual status
  const alerts = React.useMemo(() => {
    const list = [
      { id: 1, text: "AI matching engine scanning nearby vetted carriers.", time: "Just now" },
      { id: 2, text: "Operating environment standard SLA: 96.4% success rate.", time: "1h ago" }
    ];
    const pendingCount = activeRequests.filter(r => r.status === "available" || r.status === "published").length;
    if (pendingCount > 0) {
      list.unshift({
        id: 3,
        text: `AI matching active for ${pendingCount} available shipments.`,
        time: "5m ago"
      });
    }
    const transitCount = activeRequests.filter(r => r.status === "in_transit").length;
    if (transitCount > 0) {
      list.unshift({
        id: 4,
        text: `${transitCount} shipment runs are actively in transit mapping GPS heartbeats.`,
        time: "Just now"
      });
    }
    return list.slice(0, 3);
  }, [activeRequests]);

  // Sprint 6: AI matching activity summary
  const allSessions = Object.values(sessions);
  const activeSessions = allSessions.filter(
    (s) => s.status === "scanning" || s.status === "ranking" || s.status === "notifying"
  );
  const assignedSessions = allSessions.filter((s) => s.status === "assigned");
  const recentSessions = allSessions.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-blue-700 p-6 text-white shadow-soft sm:p-8">
        <div className="absolute inset-0 grid-pattern opacity-10" aria-hidden />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-3">
              Organization Console
            </Badge>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {orgName}! 👋
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-blue-100">
              {orgName} is operating at 96% on-time efficiency. There are currently {activeRequests.length} active delivery cycles.
            </p>
          </div>
          <div className="shrink-0 flex gap-2">
            <LinkButton href={ROUTES.organization.createDelivery} className="bg-white text-primary hover:bg-blue-50 text-xs">
              <PlusCircle className="h-4 w-4" />
              Create Shipment
            </LinkButton>
            <LinkButton href={ROUTES.organization.tracking} variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs">
              <MapPin className="h-4 w-4" />
              Live Tracking
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          label="Active Deliveries"
          value={activeRequests.length}
          icon={Truck}
          trend={{ value: `${activeRequests.filter(d => d.status === "in_transit").length} in transit now`, direction: "up" }}
        />
        <StatsCard
          label="Completed This Month"
          value={completedRequests.length || 31}
          icon={Package}
          trend={{ value: "+8 from last month", direction: "up" }}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
        />
        <StatsCard
          label="Total Spend"
          value={(totalSpend || 94200).toLocaleString()}
          icon={DollarSign}
          prefix="₹"
          trend={{ value: "Invoice balance cleared", direction: "neutral" }}
        />
        <StatsCard
          label="Available Drivers"
          value={availableDrivers}
          icon={Users}
          trend={{ value: "In your active zone", direction: "up" }}
          iconBg="bg-blue-50"
          iconColor="text-primary"
        />
        <StatsCard
          label="On-Time Delivery"
          value="96.4%"
          icon={Clock}
          trend={{ value: "Excellent efficiency", direction: "up" }}
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Deliveries Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Trip Monitoring Board</CardTitle>
                <CardDescription className="text-xs">Real-time status of active logistics orders</CardDescription>
              </div>
              <LinkButton href={ROUTES.organization.deliveries} variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </LinkButton>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery #</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Route Details</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Assigned Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-xs text-muted-foreground">
                          No active deliveries found. Post a delivery request to begin matching.
                        </td>
                      </tr>
                    ) : (
                      activeRequests.map((req) => {
                        const session = useTrackingStore.getState().sessions[req.id];
                        const isOffline = session?.isOffline;

                        return (
                          <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">{req.deliveryNumber}</td>
                            <td className="px-6 py-4 text-muted-foreground">
                              <p className="font-semibold text-foreground text-xs">{req.pickup.split(",")[0]}</p>
                              <p className="text-[10px]">&darr; {req.drop.split(",")[0]}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-muted-foreground hidden md:table-cell">
                              {req.driverName ? (
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-foreground">{req.driverName}</span>
                                    <span className="text-amber-500 font-semibold">★4.8</span>
                                  </div>
                                  {session && (
                                    <div className="flex items-center gap-1 mt-0.5 text-[9px]">
                                      <span className={cn("h-1.5 w-1.5 rounded-full", isOffline ? "bg-red-500 animate-pulse" : "bg-emerald-500 animate-pulse")} />
                                      <span className={isOffline ? "text-red-500 font-bold" : "text-emerald-600 font-medium"}>
                                        {isOffline ? "Offline" : "Live"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="italic text-muted-foreground/60 animate-pulse text-[10px]">AI matching active...</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <DeliveryStatusBadge status={req.status} />
                                {isOffline && (
                                  <span className="text-[9px] text-amber-600 font-semibold mt-0.5">
                                    [Cached {session.pendingSyncCount ?? 0} pts]
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-foreground">₹{req.payment}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions row */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Quick Operations Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <LinkButton href={ROUTES.organization.createDelivery} variant="outline" className="flex flex-col items-center justify-center h-20 rounded-2xl border-dashed">
                <PlusCircle className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs text-center font-semibold">Create Order</span>
              </LinkButton>
              <LinkButton href={ROUTES.organization.tracking} variant="outline" className="flex flex-col items-center justify-center h-20 rounded-2xl border-dashed">
                <MapPin className="h-5 w-5 text-secondary mb-1.5" />
                <span className="text-xs text-center font-semibold">Live Map</span>
              </LinkButton>
              <LinkButton href={ROUTES.organization.drivers} variant="outline" className="flex flex-col items-center justify-center h-20 rounded-2xl border-dashed">
                <Users className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-xs text-center font-semibold">Drivers Roster</span>
              </LinkButton>
              <LinkButton href={ROUTES.organization.analytics} variant="outline" className="flex flex-col items-center justify-center h-20 rounded-2xl border-dashed">
                <BarChart3 className="h-5 w-5 text-muted-foreground mb-1.5" />
                <span className="text-xs text-center font-semibold">Analytics Reports</span>
              </LinkButton>
            </CardContent>
          </Card>
        </div>

        {/* Side column: spend overview, notifications, actions */}
        <div className="space-y-6">
          {/* Monthly Overview Spend */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Monthly Spend Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {[
                { label: "Peenya Warehouses Route", pct: 60, val: "₹56,520", color: "bg-primary" },
                { label: "Koramangala Stores", pct: 25, val: "₹23,550", color: "bg-blue-400" },
                { label: "Whitefield Industrial", pct: 15, val: "₹14,130", color: "bg-blue-200" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.val}</span>
                  </div>
                  <div className="overflow-hidden rounded-full bg-muted h-2 w-full">
                    <div className={cn("h-2 rounded-full", item.color)} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Operation Logs</span>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {alerts.map((a) => (
                <div key={a.id} className="text-xs p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <p className="font-medium text-foreground">{a.text}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sprint 6: AI Matching Activity Widget */}
          {allSessions.length > 0 && (
            <Card className="rounded-2xl border-blue-500/20 bg-gradient-to-br from-blue-50/50 to-slate-50/30 dark:from-blue-950/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  AI Matching Activity
                </CardTitle>
                <CardDescription className="text-xs">
                  {activeSessions.length > 0
                    ? `${activeSessions.length} session${activeSessions.length > 1 ? "s" : ""} actively matching drivers`
                    : `${assignedSessions.length} assignment${assignedSessions.length > 1 ? "s" : ""} completed via AI`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                {recentSessions.map((session) => (
                  <div
                    key={session.deliveryId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-border/50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                        {session.deliveryNumber}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {session.eligibleCount} eligible · {session.status}
                      </p>
                    </div>
                    {session.rankedResults[0] && (
                      <MatchScoreBadge
                        score={session.rankedResults[0].score}
                        size="xs"
                        animated={false}
                        showLabel={false}
                      />
                    )}
                    {session.status === "assigned" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 ml-2" />
                    )}
                    {(session.status === "scanning" ||
                      session.status === "ranking" ||
                      session.status === "notifying") && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0 ml-2" />
                    )}
                  </div>
                ))}
                <LinkButton
                  href={ROUTES.organization.deliveries}
                  size="sm"
                  variant="outline"
                  className="w-full justify-center text-xs rounded-xl mt-1 border-blue-500/20 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  View All Matches <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </LinkButton>
              </CardContent>
            </Card>
          )}

          {/* AI matched overview banner */}
          <Card className="rounded-2xl border-border bg-gradient-to-br from-secondary/10 to-transparent">
            <CardContent className="p-5 flex flex-col justify-between h-fit gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">AI Operations Assistant</span>
              </div>
              <p className="text-xs text-foreground font-semibold">
                &ldquo;Peenya Logistics routes are showing high driver density today. Accepting pending matched runs immediately will reduce ETA delays by 15 min.&rdquo;
              </p>
              <LinkButton href={ROUTES.organization.ai} size="sm" variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/5 self-start text-xs rounded-xl">
                Open AI Planner
              </LinkButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
