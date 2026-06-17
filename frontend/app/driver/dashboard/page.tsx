"use client";

/**
 * app/driver/dashboard/page.tsx
 * Driver Portal Dashboard Home Page — Integrated with Sprint 8 Offline diagnostics
 */

import * as React from "react";
import {
  Truck,
  Star,
  Package,
  CheckSquare,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  User,
  PlayCircle,
  Activity,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { formatCurrency, formatDistance } from "@/utils/formatters";
import { StatsCard } from "@/components/cards/card-variants";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Typography } from "@/components/typography/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/badges/badge";
import { BarChart, LineChart } from "@/components/charts/charts-placeholder";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

// Sprint 8 Offline Components
import { useOfflineStore } from "@/store/offline-store";
import { ConnectionStatusCard } from "@/components/offline/ConnectionStatusCard";
import { SyncQueueCard } from "@/components/offline/SyncQueueCard";
import { DeviceHealthCard } from "@/components/offline/DeviceHealthCard";

export default function DriverDashboardPage() {
  const { activeDriver, currentDriverId } = useDrivers();
  const { deliveries } = useDeliveries();

  const isOnline = useOfflineStore((state) => state.isOnline);
  const isDeviceOn = useOfflineStore((state) => state.isDeviceSwitchedOn);
  const queueLength = useOfflineStore((state) => state.offlineQueue.length);

  // 1. Get active driver details
  const driverName = activeDriver?.name || "Driver";
  const driverVehicle = activeDriver?.vehicleType || "Van";
  const driverRating = activeDriver?.rating || 4.9;
  const driverStatus = activeDriver?.status || "available";

  // Load storage state on mount
  React.useEffect(() => {
    useOfflineStore.getState().loadFromStorage();
  }, []);

  // 2. Compute dynamic stats from store deliveries
  const myDeliveries = deliveries.filter((d) => d.driverId === currentDriverId);
  const completedDeliveries = myDeliveries.filter((d) =>
    ["delivered", "completed", "rated"].includes(d.status)
  );
  const totalEarnings = completedDeliveries.reduce((sum, d) => sum + d.payment, 0);
  const activeDelivery = myDeliveries.find((d) =>
    ["accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(d.status)
  );
  
  // Available nearby matching jobs
  const availableJobs = deliveries.filter(
    (d) => d.status === "available" && d.vehicleType.toLowerCase() === driverVehicle.toLowerCase()
  );

  // Today's assigned deliveries
  const todaysDeliveries = myDeliveries.filter(
    (d) =>
      d.status !== "cancelled" &&
      new Date(d.createdAt).toDateString() === new Date().toDateString()
  );

  // Recent notifications log
  const recentNotifications = React.useMemo(() => {
    const list: { id: string; text: string; time: string; variant: "info" | "success" | "warning" | "danger" }[] = [
      { id: "notif_1", text: "Welcome to DriveLink AI! Get matched with express jobs.", time: "1 day ago", variant: "info" },
    ];
    if (availableJobs.length > 0) {
      list.unshift({
        id: "notif_job",
        text: `${availableJobs.length} recommended matching cargo jobs found in your area.`,
        time: "Just now",
        variant: "success" as const
      });
    }
    if (activeDelivery) {
      list.unshift({
        id: "notif_active",
        text: `Active job ${activeDelivery.deliveryNumber} requires checkpoint update.`,
        time: "5m ago",
        variant: "warning" as const
      });
    }
    return list.slice(0, 3);
  }, [availableJobs.length, activeDelivery]);

  // Recent activities list
  const recentActivities = React.useMemo(() => {
    const list = myDeliveries.slice(0, 3).map((d, idx) => ({
      id: `act_${idx}`,
      event: d.status === "delivered" ? "Completed Trip" : d.status === "in_transit" ? "Began Route" : "Accepted Job",
      description: `${d.deliveryNumber} for ${d.organizationName}`,
      time: new Date(d.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: d.status === "delivered" ? "success" : "info"
    }));

    if (list.length === 0) {
      return [{ id: "act_empty", event: "No recent trips", description: "Accept a delivery to start logging activities.", time: "", status: "neutral" }];
    }
    return list;
  }, [myDeliveries]);

  const chartData = [
    { label: "Mon", value: 3 },
    { label: "Tue", value: 5 },
    { label: "Wed", value: 2 },
    { label: "Thu", value: 6 },
    { label: "Fri", value: 4 },
    { label: "Sat", value: completedDeliveries.length },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-6 text-white shadow-soft sm:p-8">
        <div className="absolute inset-0 grid-pattern opacity-10" aria-hidden />
        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white select-none">
              Driver Copilot Active
            </span>
            {activeDelivery && (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 animate-pulse select-none">
                On Duty
              </span>
            )}
            {!isOnline && (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 animate-pulse select-none">
                Offline Mode ({queueLength} queued)
              </span>
            )}
          </div>
          <Typography variant="hero" as="h1" className="text-white mt-1">
            Welcome back, {driverName.split(" ")[0]}! 👋
          </Typography>
          <Typography variant="body" className="text-blue-100 max-w-xl mt-1 text-xs sm:text-sm">
            Your status is listed as <span className="font-bold underline">{driverStatus.toUpperCase()}</span>. We identified <span className="font-bold underline">{availableJobs.length} available matches</span> matching your registered <span className="font-bold">{driverVehicle}</span> vehicle.
          </Typography>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/driver/deliveries"
              className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none bg-emerald-600 text-white shadow-soft hover:bg-emerald-700 focus-visible:ring-emerald-500/50 h-9 px-4 text-xs rounded-lg gap-1.5 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <PlayCircle className="h-4 w-4" />
              View Available Jobs
            </Link>
            {activeDelivery && (
              <Link
                href="/driver/active"
                className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none border border-white/30 text-white bg-transparent hover:bg-white/10 focus-visible:ring-primary/30 h-9 px-4 text-xs rounded-lg gap-1.5 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Activity className="h-4 w-4" />
                View Active Trip
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total completed"
          value={completedDeliveries.length}
          icon={<CheckSquare className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true, label: "this week" }}
        />
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 8.5, isPositive: true, label: "vs last week" }}
          className="border-l-4 border-l-emerald-500"
        />
        <StatsCard
          title="Average Rating"
          value={`${driverRating}/5.0`}
          icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
          trend={{ value: 5, isPositive: true, label: "Top Driver Score" }}
        />
        <StatsCard
          title="Today's Deliveries"
          value={todaysDeliveries.length}
          icon={<Truck className="h-5 w-5" />}
          trend={{ value: 0, isPositive: true, label: "Active duty" }}
        />
      </div>

      {/* Active Delivery Callout */}
      {activeDelivery && (
        <Card className="border-l-4 border-l-amber-500 rounded-2xl bg-amber-500/5 dark:bg-amber-500/5">
          <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 items-start">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Active Order: {activeDelivery.deliveryNumber}</span>
                  <Badge variant="warning">{activeDelivery.status.toUpperCase()}</Badge>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Route: {activeDelivery.pickup} ➔ {activeDelivery.drop}
                </span>
              </div>
            </div>
            <Link
              href="/driver/active"
              className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none bg-primary text-primary-foreground shadow-soft hover:bg-blue-700 focus-visible:ring-primary/50 h-9 px-4 text-xs rounded-lg gap-1.5 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Open Dispatch Workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Grid Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommended Job Previews */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold">Recommended Matches</CardTitle>
                <CardDescription className="text-xs">Based on location and vehicle type matching</CardDescription>
              </div>
              <Link href="/driver/deliveries" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {availableJobs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2 border border-dashed border-border rounded-xl">
                  <Package className="h-8 w-8 text-slate-300" />
                  <span>No available matches found for your vehicle profile.</span>
                </div>
              ) : (
                availableJobs.slice(0, 2).map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 hover:border-primary/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{delivery.deliveryNumber}</span>
                        <Badge variant="default" outline>{formatDistance(delivery.distance)}</Badge>
                      </div>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{delivery.organizationName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">
                        {delivery.pickup.split(",")[0]} ➔ {delivery.drop.split(",")[0]}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 border-t sm:border-0 border-border pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Payout</span>
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(delivery.payment)}</p>
                      </div>
                      <Link
                        href="/driver/deliveries"
                        className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none bg-primary text-primary-foreground shadow-soft hover:bg-blue-700 focus-visible:ring-primary/50 h-8 px-4 text-xs rounded-lg gap-1.5 hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Review Job
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link href="/driver/deliveries" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-card hover:bg-muted/40 hover:border-primary transition-all group text-center">
                <Package className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Find Deliveries</span>
              </Link>
              <Link href="/driver/completed" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-card hover:bg-muted/40 hover:border-primary transition-all group text-center">
                <CheckSquare className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Completed Logs</span>
              </Link>
              <Link href="/driver/ai" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-card hover:bg-muted/40 hover:border-primary transition-all group text-center">
                <Sparkles className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Assistant</span>
              </Link>
              <Link href="/driver/profile" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-card hover:bg-muted/40 hover:border-primary transition-all group text-center">
                <User className="h-5 w-5 text-slate-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Driver Profile</span>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel Widgets */}
        <div className="space-y-6">
          {/* Sprint 8 Connection Simulation widgets */}
          <ConnectionStatusCard />
          <SyncQueueCard />
          <DeviceHealthCard />

          {/* Performance summary card */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Metrics Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-slate-500">Acceptance Ratio</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">96%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span className="text-slate-500">On-Time Accuracy</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">98.5%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-amber-500" />
                  <span className="text-slate-500">Customer Reviews</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">{completedDeliveries.length} positive</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Recent Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {recentNotifications.map((n) => (
                <div key={n.id} className="text-xs p-3 rounded-xl bg-muted/20 border border-border flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{n.text}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5">{n.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <BarChart data={chartData} title="Completed Trips Analytics" description="Trips completed by day over this week." />
        <LineChart data={chartData} title="Earnings Growth Telemetry" description="Estimated daily payouts earned over time." />
      </div>
    </div>
  );
}
