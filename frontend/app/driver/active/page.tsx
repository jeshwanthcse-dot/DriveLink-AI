"use client";

/**
 * app/driver/active/page.tsx
 * Driver — Active Delivery Workspace (Sprint 8: Offline Resilience Engine)
 * Full live GPS simulation with network drop warning triggers, device battery metrics,
 * offline coordinates queue buffers, and photo/notes synchronization replays.
 */

import * as React from "react";
import {
  Truck,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Battery,
  Signal,
  Navigation,
} from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useTracking } from "@/hooks/useTracking";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";
import { PageHeader } from "@/components/common/page-header";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Typography } from "@/components/typography/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/badges/badge";
import { SuccessModal } from "@/components/modals/modal-dialogs";
import { Textarea } from "@/components/forms/form-inputs";
import Link from "next/link";
import { DeliveryEvidenceCard } from "@/components/delivery/DeliveryEvidenceCard";
import { DeliveryRatingCard } from "@/components/delivery/DeliveryRatingCard";
import { DeliveryStatusBadge } from "@/components/delivery/DeliveryStatusBadge";

// Sprint 7 components
import { LiveMap } from "@/components/maps/LiveMap";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { ETAWidget } from "@/components/tracking/ETAWidget";
import { SpeedCard } from "@/components/tracking/SpeedCard";
import { DistanceCard } from "@/components/tracking/DistanceCard";
import { StatusIndicator } from "@/components/tracking/StatusIndicator";
import { TrackingHistoryCard } from "@/components/tracking/TrackingHistoryCard";
import { LastKnownLocationCard } from "@/components/tracking/LastKnownLocationCard";

// Sprint 8 Offline Resilience components
import { OfflineBanner } from "@/components/offline/OfflineBanner";
import { ConnectionStatusCard } from "@/components/offline/ConnectionStatusCard";
import { SyncQueueCard } from "@/components/offline/SyncQueueCard";
import { PendingActionsCard } from "@/components/offline/PendingActionsCard";
import { DeviceHealthCard } from "@/components/offline/DeviceHealthCard";
import { OfflineTimeline } from "@/components/offline/OfflineTimeline";
import { SyncProgressModal } from "@/components/offline/SyncProgressModal";
import { ReconnectionToast } from "@/components/offline/ReconnectionToast";
import { useOfflineStore } from "@/store/offline-store";

export default function ActiveDeliveryPage() {
  const { activeDriver, currentDriverId } = useDrivers();
  const { deliveries, startPickup, updateDeliveryStatus, submitOrgRating } = useDeliveries();
  const { startTracking, getSession } = useTracking();

  const [notes, setNotes] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  // Active delivery for this driver
  const activeJob = React.useMemo(() => {
    return deliveries.find(
      (d) =>
        d.driverId === currentDriverId &&
        ["accepted", "assigned", "pickup_started", "in_transit", "near_destination", "delivered"].includes(d.status)
    );
  }, [deliveries, currentDriverId]);

  // Tracking session
  const trackingSession = activeJob ? getSession(activeJob.id) : undefined;

  // Auto-start tracking engine when delivery becomes active
  React.useEffect(() => {
    if (!activeJob) return;
    if (
      ["pickup_started", "in_transit", "near_destination", "accepted", "assigned"].includes(activeJob.status) &&
      !trackingSession
    ) {
      startTracking(activeJob);
    }
  }, [activeJob, trackingSession, startTracking]);

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (!activeJob) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Active Routing Workspace"
          subtitle="GPS tracking, ETA heartbeats, and delivery status controls."
        />
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-card">
          <Truck className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">No active delivery</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mb-6 leading-relaxed">
            You don&apos;t have any active shipments. Accept a job from the available matches feed.
          </p>
          <Link
            href="/driver/deliveries"
            className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none bg-primary text-primary-foreground shadow-soft hover:bg-blue-700 focus-visible:ring-primary/50 h-11 px-6 text-sm rounded-xl gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Browse Available Matches
          </Link>
        </div>
      </div>
    );
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleStartPickup = () => {
    const isOnline = useOfflineStore.getState().isOnline && useOfflineStore.getState().isDeviceSwitchedOn;
    if (!isOnline) {
      useOfflineStore.getState().queueStatus({
        deliveryId: activeJob.id,
        status: "pickup_started",
        timestamp: new Date().toISOString()
      });
      useOfflineStore.getState().queueTimeline({
        deliveryId: activeJob.id,
        milestone: "moving_to_pickup",
        timestamp: new Date().toISOString()
      });
      // Start locally
      startPickup(activeJob.id);
      if (!trackingSession) startTracking(activeJob);
      setSuccessMessage(`Pickup started (simulated offline). Actions cached in local queue.`);
      setShowSuccessModal(true);
    } else {
      startPickup(activeJob.id);
      if (!trackingSession) startTracking(activeJob);
      setSuccessMessage(`Pickup started for ${activeJob.deliveryNumber}. GPS tracking is now live.`);
      setShowSuccessModal(true);
    }
  };

  const handleStartTransit = () => {
    const isOnline = useOfflineStore.getState().isOnline && useOfflineStore.getState().isDeviceSwitchedOn;
    if (!isOnline) {
      useOfflineStore.getState().queueStatus({
        deliveryId: activeJob.id,
        status: "in_transit",
        timestamp: new Date().toISOString()
      });
      useOfflineStore.getState().queueTimeline({
        deliveryId: activeJob.id,
        milestone: "in_transit",
        timestamp: new Date().toISOString()
      });
      // Update locally
      updateDeliveryStatus(activeJob.id, "in_transit");
      setSuccessMessage(`Transit started (simulated offline). Actions cached in local queue.`);
      setShowSuccessModal(true);
    } else {
      updateDeliveryStatus(activeJob.id, "in_transit");
      setSuccessMessage(`Transit started for ${activeJob.deliveryNumber}. GPS broadcast active.`);
      setShowSuccessModal(true);
    }
  };

  const handleNearDestination = () => {
    const isOnline = useOfflineStore.getState().isOnline && useOfflineStore.getState().isDeviceSwitchedOn;
    if (!isOnline) {
      useOfflineStore.getState().queueStatus({
        deliveryId: activeJob.id,
        status: "near_destination",
        timestamp: new Date().toISOString()
      });
      useOfflineStore.getState().queueTimeline({
        deliveryId: activeJob.id,
        milestone: "near_destination",
        timestamp: new Date().toISOString()
      });
      // Update locally
      updateDeliveryStatus(activeJob.id, "near_destination");
      setSuccessMessage(`Marked near destination (simulated offline). Actions cached in local queue.`);
      setShowSuccessModal(true);
    } else {
      updateDeliveryStatus(activeJob.id, "near_destination");
      setSuccessMessage(`${activeJob.deliveryNumber} marked as Near Destination. Approaching receiver.`);
      setShowSuccessModal(true);
    }
  };

  const handleEvidenceSubmit = (_photoUrl: string, _lat: number, _lng: number, _timestamp: string) => {
    const isOnline = useOfflineStore.getState().isOnline && useOfflineStore.getState().isDeviceSwitchedOn;
    if (!isOnline) {
      useOfflineStore.getState().queuePhoto({
        deliveryId: activeJob.id,
        photoUrl: _photoUrl,
        lat: _lat,
        lng: _lng,
        timestamp: _timestamp,
      });
      // Update locally so driver can proceed to ratings UI
      updateDeliveryStatus(activeJob.id, "delivered");
      setSuccessMessage(`Delivery Photo cached in offline queue! Proceed to rating summary.`);
      setShowSuccessModal(true);
    } else {
      updateDeliveryStatus(activeJob.id, "delivered");
      setSuccessMessage(`Delivery confirmed for ${activeJob.deliveryNumber}!`);
      setShowSuccessModal(true);
    }
  };

  const handleOrgRatingSubmit = (rating: number, comment: string) => {
    submitOrgRating(activeJob.id, rating, comment);
    setSuccessMessage(`Rated ${activeJob.organizationName} ★${rating}. Dispatch complete.`);
    setShowSuccessModal(true);
  };

  const currentMilestone = trackingSession?.currentMilestone ?? "waiting";

  return (
    <div className="space-y-6">
      {/* Sprint 8 Offline banner indicators */}
      <OfflineBanner />
      <SyncProgressModal />
      <ReconnectionToast />

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs text-primary font-bold uppercase tracking-wider">Active Workspace</span>
          <div className="flex items-center gap-3 mt-0.5">
            <Typography variant="heading">{activeJob.deliveryNumber}</Typography>
            <DeliveryStatusBadge status={activeJob.status} />
          </div>
        </div>
        <Link
          href="/driver/dashboard"
          className="inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none border border-border bg-background hover:bg-muted text-foreground focus-visible:ring-primary/30 h-9 px-4 text-xs rounded-lg gap-1.5 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* ── GPS Status strip ── */}
      {trackingSession && (
        <StatusIndicator
          status={trackingSession.status}
          lastUpdated={trackingSession.lastUpdated}
          accuracy={trackingSession.routeHistory[trackingSession.routeHistory.length - 1]?.accuracy}
          className="w-fit"
        />
      )}

      {/* ── Mock system info ── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 border border-border rounded-lg px-2.5 py-1.5">
          <Battery className="h-3 w-3" />
          <span>Battery: 87% (Mock)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 border border-border rounded-lg px-2.5 py-1.5">
          <Signal className="h-3 w-3" />
          <span>4G LTE · -74 dBm (Mock)</span>
        </div>
        {trackingSession && (
          <div className="flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/20 border border-blue-400/20 rounded-lg px-2.5 py-1.5">
            <Navigation className="h-3 w-3" />
            <span>Heading {Math.round(trackingSession.heading)}° · {trackingSession.routeHistory.length} GPS pts</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Live Map */}
          {trackingSession && activeJob.status !== "near_destination" && activeJob.status !== "delivered" && (
            <Card className="rounded-2xl border-border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border py-3 px-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live GPS Map
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {activeJob.pickup.split(",")[0]} → {activeJob.drop.split(",")[0]}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LiveMap session={trackingSession} showControls className="rounded-none" />
              </CardContent>
            </Card>
          )}

          {/* POD Card */}
          {activeJob.status === "near_destination" && (
            <DeliveryEvidenceCard
              onSubmit={handleEvidenceSubmit}
              deliveryNumber={activeJob.deliveryNumber}
            />
          )}

          {/* Rating Card */}
          {activeJob.status === "delivered" && (
            <DeliveryRatingCard
              title={`Rate Organization: ${activeJob.organizationName}`}
              description={`Feedback for ${activeJob.deliveryNumber} to complete the dispatch cycle.`}
              onSubmit={handleOrgRatingSubmit}
              submitLabel="Submit Organization Review"
            />
          )}

          {/* Stats row */}
          {trackingSession && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <ETAWidget
                eta={trackingSession.eta}
                etaMinutes={trackingSession.etaMinutes}
                milestone={currentMilestone}
              />
              <SpeedCard
                speed={trackingSession.speed}
                heading={trackingSession.heading}
              />
              <DistanceCard
                remainingDistance={trackingSession.remainingDistance}
                totalDistance={activeJob.distance}
              />
            </div>
          )}

          {/* Action controls */}
          {!["near_destination", "delivered"].includes(activeJob.status) && (
            <Card className="rounded-2xl border-border">
              <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Next Action</span>
                  <span className="text-sm font-bold text-foreground">
                    {activeJob.status === "accepted" || activeJob.status === "assigned"
                      ? "Tap to start pickup and activate GPS tracking"
                      : activeJob.status === "pickup_started"
                      ? "Cargo loaded? Start the transit run"
                      : activeJob.status === "in_transit"
                      ? `${trackingSession?.remainingDistance.toFixed(1) ?? activeJob.distance} km remaining`
                      : "En Route"}
                  </span>
                </div>

                {(activeJob.status === "accepted" || activeJob.status === "assigned") && (
                  <ReusableButton variant="primary" onClick={handleStartPickup}>
                    Start Pickup + GPS
                  </ReusableButton>
                )}
                {activeJob.status === "pickup_started" && (
                  <ReusableButton variant="primary" onClick={handleStartTransit}>
                    Start Transit
                  </ReusableButton>
                )}
                {activeJob.status === "in_transit" && (
                  <ReusableButton variant="primary" onClick={handleNearDestination}>
                    Mark Near Destination
                  </ReusableButton>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location history with offline timeline overlay */}
          {trackingSession && (
            <div className="space-y-4">
              <OfflineTimeline />
              <TrackingHistoryCard history={trackingSession.routeHistory} maxItems={8} />
            </div>
          )}
        </div>

        {/* ── Side panel ── */}
        <div className="space-y-5">
          {/* Sprint 8 Offline Diagnostics side blocks */}
          <ConnectionStatusCard />
          <SyncQueueCard />
          <PendingActionsCard />
          <DeviceHealthCard />

          {/* Tracking Timeline */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <TrackingTimeline
                currentMilestone={currentMilestone}
                startedAt={trackingSession?.startedAt}
              />
            </CardContent>
          </Card>

          {/* Last known location */}
          {trackingSession && (
            <LastKnownLocationCard session={trackingSession} />
          )}

          {/* Client org info */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Client Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                  {activeJob.organizationName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground">{activeJob.organizationName}</p>
                  <p className="text-muted-foreground">Cargo Logistics Partner</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact Dispatch:</span>
                  <span className="font-semibold">+91 (80) 555-0199</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-muted-foreground">Pickup:</span>
                  <span className="font-semibold text-right truncate max-w-[160px]">{activeJob.pickup}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-muted-foreground">Drop:</span>
                  <span className="font-semibold text-right truncate max-w-[160px]">{activeJob.drop}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo specs */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Load Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { label: "Vehicle Type", value: activeJob.vehicleType.toUpperCase() },
                { label: "Cargo Weight", value: formatWeight(activeJob.weight) },
                { label: "Priority Tier", value: activeJob.priority.toUpperCase(), className: "text-red-500 font-bold" },
                { label: "Estimated Earnings", value: formatCurrency(activeJob.payment), className: "text-emerald-600 text-sm font-black" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                  <span className="text-muted-foreground">{row.label}:</span>
                  <span className={row.className ?? "font-bold text-foreground"}>{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Driver notes with offline resilience check */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Driver Check-In Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Log checkpoint updates, delay warnings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
              <ReusableButton
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  const isOnline = useOfflineStore.getState().isOnline && useOfflineStore.getState().isDeviceSwitchedOn;
                  if (!isOnline) {
                    useOfflineStore.getState().queueNote({
                      deliveryId: activeJob.id,
                      note: notes,
                      timestamp: new Date().toISOString(),
                    });
                    setNotes("");
                    alert("Note cached locally in offline sync queue.");
                  } else {
                    alert("Note saved to dispatch log.");
                    setNotes("");
                  }
                }}
              >
                Save Log Note
              </ReusableButton>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase">SLA Warning Logs</h4>
            <p className="text-[10px] text-muted-foreground">Offline delays will automatically recompute ETAs upon reconnection.</p>
          </div>
        </CardContent>
      </Card>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Status Updated!"
        message={successMessage}
      />
    </div>
  );
}
