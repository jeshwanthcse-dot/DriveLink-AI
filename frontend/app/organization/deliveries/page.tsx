"use client";

/**
 * app/organization/deliveries/page.tsx
 * Organization Deliveries — Sprint 6: AI Matching Engine integrated
 * Shows inline RecommendationPanel for "available" deliveries after publish
 */

import * as React from "react";
import { Package, ArrowRight, Star } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useMatchingStore } from "@/store/matching-store";
import { DeliveryDetailsModal } from "@/components/delivery/DeliveryDetailsModal";
import { DeliveryRatingCard } from "@/components/delivery/DeliveryRatingCard";
import { DeliveryStatusBadge } from "@/components/delivery/DeliveryStatusBadge";
import { RecommendationPanel } from "@/components/ai/RecommendationPanel";
import { NotificationToast, useToastQueue } from "@/components/ai/NotificationToast";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { MockDelivery } from "@/mock/deliveries";
import { AnimatePresence } from "framer-motion";

type FilterKey = "all" | "draft" | "available" | "active" | "delivered" | "completed";

const TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Shipments" },
  { key: "draft", label: "Drafts" },
  { key: "available", label: "Awaiting Match" },
  { key: "active", label: "Active Runs" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
];

export default function OrgDeliveriesPage() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [search, setSearch] = React.useState("");
  const [selectedDelivery, setSelectedDelivery] = React.useState<MockDelivery | null>(null);
  const [ratingDelivery, setRatingDelivery] = React.useState<MockDelivery | null>(null);

  // Track which AI panel is open (deliveryId)
  const [openAIPanel, setOpenAIPanel] = React.useState<string | null>(null);

  const { deliveries, publishDelivery, submitDriverRating } = useDeliveries();
  const { currentOrgId } = useOrganizations();
  const sessions = useMatchingStore((state) => state.sessions);
  const toast = useToastQueue();

  // Filter deliveries for current org
  const myRequests = React.useMemo(() => {
    return deliveries.filter((d) => d.organizationId === currentOrgId);
  }, [deliveries, currentOrgId]);

  const filtered = React.useMemo(() => {
    return myRequests.filter((d) => {
      let matchesFilter = false;
      if (filter === "all") matchesFilter = true;
      else if (filter === "draft") matchesFilter = d.status === "draft";
      else if (filter === "available") matchesFilter = d.status === "available" || d.status === "published";
      else if (filter === "active") {
        matchesFilter = ["accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(d.status);
      }
      else if (filter === "delivered") matchesFilter = d.status === "delivered";
      else if (filter === "completed") matchesFilter = d.status === "completed" || d.status === "rated";

      const matchesSearch =
        d.deliveryNumber.toLowerCase().includes(search.toLowerCase()) ||
        (d.cargoDescription || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.driverName ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [myRequests, filter, search]);

  const handlePublish = (id: string) => {
    const delivery = deliveries.find((d) => d.id === id);
    publishDelivery(id);

    // Open AI panel automatically on publish
    setOpenAIPanel(id);

    toast.push(
      "ai_started",
      "AI Matching Started",
      `Scanning drivers for ${delivery?.deliveryNumber}. Top matches will appear shortly.`
    );
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingDelivery) {
      submitDriverRating(ratingDelivery.id, rating, comment);
      setRatingDelivery(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Deliveries"
        subtitle="Manage posted delivery requests, AI driver assignments, and live transit runs."
      >
        <LinkButton href={ROUTES.organization.createDelivery} size="sm">
          + New Shipment
        </LinkButton>
      </PageHeader>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit select-none">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? myRequests.length
              : myRequests.filter((d) => {
                  if (tab.key === "draft") return d.status === "draft";
                  if (tab.key === "available")
                    return d.status === "available" || d.status === "published";
                  if (tab.key === "active")
                    return ["accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(
                      d.status
                    );
                  if (tab.key === "delivered") return d.status === "delivered";
                  if (tab.key === "completed")
                    return d.status === "completed" || d.status === "rated";
                  return false;
                }).length;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setSearch("");
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filter === tab.key
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={filter === tab.key}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by delivery #, cargo, or driver..."
          id="org-delivery-search"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No deliveries found"
          description="Try adjusting your filters or search terms."
          icon={Package}
        >
          <LinkButton href={ROUTES.organization.createDelivery} size="sm">
            Post Delivery Request
          </LinkButton>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const session = sessions[req.id];
            const isAIPanelOpen = openAIPanel === req.id;

            return (
              <div key={req.id} className="space-y-3">
                {/* Delivery row card */}
                <Card
                  onClick={() => setSelectedDelivery(req)}
                  className="transition-all hover:shadow-elevated rounded-2xl border-border cursor-pointer active:scale-[0.99]"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {req.deliveryNumber}
                          </span>
                          <DeliveryStatusBadge status={req.status} />
                          <Badge variant="outline" className="text-[10px] py-0">
                            {formatDistance(req.distance)}
                          </Badge>
                          {session && session.status !== "idle" && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">
                              AI Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground font-semibold">
                          {req.cargoDescription || "General Cargo Shipment"} ·{" "}
                          {formatWeight(req.weight)}
                        </p>
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-start gap-2">
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                            <p className="text-xs text-muted-foreground">{req.pickup}</p>
                          </div>
                          <div className="ml-[3.5px] h-3 w-px bg-border" />
                          <div className="flex items-start gap-2">
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            <p className="text-xs text-muted-foreground">{req.drop}</p>
                          </div>
                        </div>
                        {req.driverName && (
                          <div className="mt-3.5 flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                            <span className="font-semibold text-foreground">
                              Assigned Driver:
                            </span>
                            <span className="font-medium text-foreground">
                              {req.driverName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right actions */}
                      <div
                        className="flex shrink-0 flex-col items-start sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-muted-foreground">Payout Cost</p>
                          <p className="text-xl font-bold text-foreground">
                            {formatCurrency(req.payment)}
                          </p>
                        </div>

                        {req.status === "draft" && (
                          <button
                            onClick={() => handlePublish(req.id)}
                            className="rounded-xl bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 hover:bg-primary/95 transition-colors"
                          >
                            Publish → AI Match
                          </button>
                        )}

                        {req.status === "available" && session && (
                          <button
                            onClick={() =>
                              setOpenAIPanel((prev) =>
                                prev === req.id ? null : req.id
                              )
                            }
                            className="rounded-xl bg-blue-600 text-white text-xs font-bold px-3 py-1.5 hover:bg-blue-700 transition-colors"
                          >
                            {isAIPanelOpen ? "Hide AI Panel" : "View AI Matches"}
                          </button>
                        )}

                        {["in_transit", "near_destination", "accepted"].includes(
                          req.status
                        ) && (
                          <LinkButton
                            href={ROUTES.organization.tracking}
                            variant="outline"
                            size="sm"
                            className="group rounded-xl h-8 text-xs gap-1"
                          >
                            Track Live{" "}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </LinkButton>
                        )}

                        {req.status === "delivered" && (
                          <button
                            onClick={() => setRatingDelivery(req)}
                            className="rounded-xl bg-secondary text-white text-xs font-bold px-3 py-1.5 hover:bg-secondary/90 transition-colors flex items-center gap-1"
                          >
                            Rate Driver <Star className="h-3.5 w-3.5 fill-white text-white" />
                          </button>
                        )}

                        <p className="text-[10px] text-muted-foreground mt-1">
                          Posted:{" "}
                          {new Date(req.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation Panel — inline expandable */}
                <AnimatePresence>
                  {isAIPanelOpen && session && (
                    <RecommendationPanel
                      key={`ai-panel-${req.id}`}
                      session={session}
                      onClose={() => setOpenAIPanel(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Delivery details modal */}
      {selectedDelivery && (
        <DeliveryDetailsModal
          isOpen={!!selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          delivery={deliveries.find((d) => d.id === selectedDelivery.id) || selectedDelivery}
          portal="org"
          onPublish={(id) => {
            handlePublish(id);
            setSelectedDelivery(null);
          }}
          onRate={(id) => {
            const del = deliveries.find((d) => d.id === id) || selectedDelivery;
            setRatingDelivery(del);
            setSelectedDelivery(null);
          }}
          onTrack={() => {
            router.push(ROUTES.organization.tracking);
          }}
        />
      )}

      {/* Driver rating overlay */}
      {ratingDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setRatingDelivery(null)}
          />
          <div className="relative w-full max-w-sm z-10">
            <DeliveryRatingCard
              title={`Rate Driver: ${ratingDelivery.driverName}`}
              description={`Please provide rating feedback for delivery ${ratingDelivery.deliveryNumber}.`}
              onSubmit={handleRatingSubmit}
              submitLabel="Submit Driver Review"
            />
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toast.current && (
        <NotificationToast
          visible={!!toast.current}
          type={toast.current.type}
          title={toast.current.title}
          message={toast.current.message}
          onClose={() => toast.dismiss(toast.current!.id)}
        />
      )}
    </div>
  );
}
