"use client";

/**
 * app/organization/tracking/page.tsx
 * Organization — Live Tracking Dashboard (Sprint 7: Live Tracking Engine)
 * Shows live driver map, ETA, timeline, driver card, and location history.
 */

import * as React from "react";
import {
  Navigation,
  Truck,
  Star,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useDrivers } from "@/hooks/useDrivers";
import { useTracking } from "@/hooks/useTracking";
import { EmptyState } from "@/components/common/empty-state";
import { DeliveryStatusBadge } from "@/components/delivery/DeliveryStatusBadge";
import { formatCurrency, formatDistance } from "@/utils/formatters";

// Sprint 7 tracking components
import { LiveMap } from "@/components/maps/LiveMap";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { ETAWidget } from "@/components/tracking/ETAWidget";
import { SpeedCard } from "@/components/tracking/SpeedCard";
import { DistanceCard } from "@/components/tracking/DistanceCard";
import { TrackingCard } from "@/components/tracking/TrackingCard";
import { TrackingHistoryCard } from "@/components/tracking/TrackingHistoryCard";
import { StatusIndicator } from "@/components/tracking/StatusIndicator";

export default function OrgTrackingPage() {
  const { deliveries } = useDeliveries();
  const { currentOrgId } = useOrganizations();
  const { drivers } = useDrivers();
  const { startTracking, getSession, autoStartForActiveDeliveries } = useTracking();

  // Active deliveries for this org
  const activeDeliveries = React.useMemo(() => {
    return deliveries.filter(
      (d) =>
        d.organizationId === currentOrgId &&
        ["accepted", "assigned", "pickup_started", "in_transit", "near_destination", "delivered"].includes(d.status)
    );
  }, [deliveries, currentOrgId]);

  const [selectedId, setSelectedId] = React.useState<string>("");

  // Auto-select first active delivery
  React.useEffect(() => {
    if (activeDeliveries.length > 0) {
      if (!selectedId || !activeDeliveries.some((d) => d.id === selectedId)) {
        setSelectedId(activeDeliveries[0].id);
      }
    } else {
      setSelectedId("");
    }
  }, [activeDeliveries, selectedId]);

  // Auto-start tracking for all active deliveries
  React.useEffect(() => {
    autoStartForActiveDeliveries();
  }, [autoStartForActiveDeliveries]);

  const selectedDelivery = React.useMemo(
    () => activeDeliveries.find((d) => d.id === selectedId) ?? activeDeliveries[0] ?? null,
    [activeDeliveries, selectedId]
  );

  // Tracking session for selected delivery
  const session = selectedDelivery ? getSession(selectedDelivery.id) : undefined;

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (activeDeliveries.length === 0 || !selectedDelivery) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Live Tracking"
          subtitle="Real-time GPS location, ETA tracking, and status logs for your active shipments."
        />
        <EmptyState
          title="No shipments in transit"
          description="Post a new delivery request and assign a driver to begin live tracking."
          icon={Navigation}
        >
          <div className="flex gap-3">
            <LinkButton href={ROUTES.organization.createDelivery} size="sm">
              + New Shipment
            </LinkButton>
            <LinkButton href={ROUTES.organization.deliveries} variant="outline" size="sm">
              View All Deliveries
            </LinkButton>
          </div>
        </EmptyState>
      </div>
    );
  }

  const assignedDriver = drivers.find((d) => d.id === selectedDelivery.driverId);
  const driverName = selectedDelivery.driverName ?? assignedDriver?.name ?? "Driver";
  const driverRating = assignedDriver?.rating ?? 4.8;
  const currentMilestone = session?.currentMilestone ?? "waiting";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Tracking"
        subtitle="GPS-powered real-time map, ETA, and status logs for your active shipments."
      />

      {/* ── Delivery selector ── */}
      {activeDeliveries.length > 1 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground">Active Shipment:</span>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8 appearance-none"
            >
              {activeDeliveries.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.deliveryNumber} · {d.pickup.split(",")[0]} → {d.drop.split(",")[0]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}

      {/* ── Active run header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">{selectedDelivery.deliveryNumber}</span>
              <DeliveryStatusBadge status={selectedDelivery.status} />
              {session && !session.isOffline && session.status === "active" && (
                <Badge className="text-[9px] py-0.5 bg-emerald-500/10 text-emerald-700 border-emerald-400/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 inline-block animate-pulse" />
                  GPS Live
                </Badge>
              )}
              {session && session.isOffline && (
                <Badge className="text-[9px] py-0.5 bg-red-500/10 text-red-700 border-red-400/30 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 inline-block" />
                  DEVICE OFFLINE
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {driverName} <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline-block" /> {driverRating} · {formatDistance(selectedDelivery.distance)} trip
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <StatusIndicator
              status={session.status}
              lastUpdated={session.lastUpdated}
              accuracy={session.routeHistory[session.routeHistory.length - 1]?.accuracy}
            />
          )}
          <LinkButton href={ROUTES.organization.deliveries} variant="outline" size="sm" className="text-xs rounded-xl h-9">
            All Shipments
          </LinkButton>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main: Map + Stats ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live Map */}
          <Card className="rounded-2xl border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border py-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                Live Driver Map
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {selectedDelivery.pickup.split(",")[0]} → {selectedDelivery.drop.split(",")[0]}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {session ? (
                <LiveMap session={session} showControls />
              ) : (
                <div className="aspect-video bg-muted/20 flex flex-col items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-6 w-6 text-muted-foreground/40" />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Initializing GPS tracking engine...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats row */}
          {session && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <ETAWidget
                eta={session.eta}
                etaMinutes={session.etaMinutes}
                milestone={currentMilestone}
              />
              <SpeedCard speed={session.speed} heading={session.heading} />
              <DistanceCard
                remainingDistance={session.remainingDistance}
                totalDistance={selectedDelivery.distance}
              />
            </div>
          )}

          {/* Route summary */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Route Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Distance", value: formatDistance(selectedDelivery.distance) },
                  { label: "Cargo Value", value: formatCurrency(selectedDelivery.payment) },
                  { label: "Priority", value: selectedDelivery.priority.toUpperCase() },
                  { label: "GPS Points", value: `${session?.routeHistory.length ?? 0}` },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl bg-muted/40 border border-border/50 p-3">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">{row.label}</p>
                    <p className="font-black text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-muted/30 border border-border/40 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Pickup</p>
                    <p className="font-semibold text-foreground">{selectedDelivery.pickup}</p>
                  </div>
                </div>
                <div className="ml-[3px] h-4 w-px bg-border" />
                <div className="flex items-start gap-2">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Drop-off</p>
                    <p className="font-semibold text-foreground">{selectedDelivery.drop}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location history */}
          {session && <TrackingHistoryCard history={session.routeHistory} maxItems={6} />}
        </div>

        {/* ── Side panel ── */}
        <div className="space-y-5">
          {/* Driver card */}
          {session && (
            <TrackingCard
              session={session}
              driverRating={driverRating}
              deliveryNumber={selectedDelivery.deliveryNumber}
            />
          )}

          {/* Delivery Timeline */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Live Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <TrackingTimeline
                currentMilestone={currentMilestone}
                startedAt={session?.startedAt}
                compact={false}
              />
            </CardContent>
          </Card>

          {/* Delivery Progress card */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress bar */}
              {session && (
                <DistanceCard
                  remainingDistance={session.remainingDistance}
                  totalDistance={selectedDelivery.distance}
                />
              )}

              {/* Key timestamps */}
              <div className="space-y-2 text-xs border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session started:</span>
                  <span className="font-semibold">
                    {session?.startedAt
                      ? new Date(session.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </span>
                </div>
                {session?.isOffline ? (
                  <>
                    <div className="flex justify-between text-red-500 font-bold animate-pulse">
                      <span>Device Status:</span>
                      <span>OFFLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Synced GPS:</span>
                      <span className="font-semibold text-foreground">
                        {session.lastSyncedLat?.toFixed(4)}°, {session.lastSyncedLng?.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated Time:</span>
                      <span className="font-semibold text-foreground">
                        {session.lastSyncedTime
                          ? new Date(session.lastSyncedTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Sync:</span>
                      <span className="font-bold text-amber-600">
                        ~{session.pendingSyncCount ?? 0} actions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Reconnect:</span>
                      <span className="font-semibold text-foreground">
                        {session.estimatedReconnectTime
                          ? new Date(session.estimatedReconnectTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                          : "Reconnecting..."}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last GPS ping:</span>
                      <span className="font-semibold text-foreground">
                        {session?.lastUpdated
                          ? new Date(session.lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ETA to destination:</span>
                      <span className="font-bold text-primary">{session?.eta ?? "Calculating..."}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
