"use client";

/**
 * app/driver/deliveries/page.tsx
 * Driver — Available Deliveries (Sprint 6: AI Match Engine integrated)
 * Shows AI-enhanced delivery cards with match score, explanation, and countdown
 */

import * as React from "react";
import { Package, DollarSign, MapPin, Sparkles, SlidersHorizontal } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useMatching } from "@/hooks/useMatching";
import { useMatchingStore } from "@/store/matching-store";
import { formatCurrency, formatDistance } from "@/utils/formatters";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/cards/card-variants";
import { EmptyState } from "@/components/empty-state/empty-states";
import { Input, Select } from "@/components/forms/form-inputs";
import { Grid } from "@/components/layout/layouts";
import { AIMatchCard } from "@/components/ai/AIMatchCard";
import { NotificationToast, useToastQueue } from "@/components/ai/NotificationToast";
import { BaseModal, SuccessModal } from "@/components/modals/modal-dialogs";
import { ReusableButton } from "@/components/buttons/button-variants";
import { MockDelivery } from "@/mock/deliveries";

export default function AvailableDeliveriesPage() {
  const { activeDriver, currentDriverId } = useDrivers();
  const { deliveries } = useDeliveries();
  const { acceptMatchedDelivery, getDriverMatchResult } = useMatching();
  const sessions = useMatchingStore((state) => state.sessions);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("score-desc");

  // Toast system
  const toast = useToastQueue();

  // Success modal
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  // Detail modal
  const [selectedJob, setSelectedJob] = React.useState<MockDelivery | null>(null);

  // Available deliveries
  const availableDeliveries = React.useMemo(() => {
    return deliveries.filter((d) => d.status === "available");
  }, [deliveries]);

  // Processed list with search, filter, sort
  const processedDeliveries = React.useMemo(() => {
    let result = [...availableDeliveries];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.deliveryNumber.toLowerCase().includes(term) ||
          d.organizationName.toLowerCase().includes(term) ||
          d.pickup.toLowerCase().includes(term) ||
          d.drop.toLowerCase().includes(term)
      );
    }

    if (selectedPriority !== "all") {
      result = result.filter((d) => d.priority === selectedPriority);
    }

    // Sort by AI score (default) or fallback sorts
    result.sort((a, b) => {
      if (sortBy === "score-desc") {
        const scoreA = sessions[a.id]?.rankedResults.find(r => r.driver.id === currentDriverId)?.score ?? 0;
        const scoreB = sessions[b.id]?.rankedResults.find(r => r.driver.id === currentDriverId)?.score ?? 0;
        return scoreB - scoreA;
      }
      if (sortBy === "distance-asc") return a.distance - b.distance;
      if (sortBy === "payout-desc") return b.payment - a.payment;
      if (sortBy === "payout-asc") return a.payment - b.payment;
      return 0;
    });

    return result;
  }, [availableDeliveries, searchTerm, selectedPriority, sortBy, sessions, currentDriverId]);

  const totalPotentialEarnings = processedDeliveries.reduce((sum, d) => sum + d.payment, 0);
  const avgDistance = processedDeliveries.length > 0
    ? processedDeliveries.reduce((sum, d) => sum + d.distance, 0) / processedDeliveries.length
    : 0;

  // Count AI-scored deliveries
  const aiScoredCount = processedDeliveries.filter(
    (d) => !!sessions[d.id]?.rankedResults.find(r => r.driver.id === currentDriverId)
  ).length;

  const handleAcceptJob = (job: MockDelivery) => {
    if (!activeDriver) return;

    acceptMatchedDelivery(job.id, currentDriverId, activeDriver.name);
    setSelectedJob(null);

    toast.push(
      "assignment_confirmed",
      "Job Accepted!",
      `${job.deliveryNumber} has been assigned to you. Head to Active Delivery.`
    );

    setSuccessMessage(
      `Job ${job.deliveryNumber} accepted! Navigate to Active Delivery to begin.`
    );
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Cargo Matches"
        subtitle="AI-ranked freight dispatches matching your logistics profile. Accept the best match now."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="AI-Matched Dispatches"
          value={processedDeliveries.length}
          icon={<Sparkles className="h-5 w-5" />}
          trend={{ value: aiScoredCount, isPositive: true, label: "AI scored" }}
        />
        <StatsCard
          title="Total Cargo Value"
          value={formatCurrency(totalPotentialEarnings)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true, label: "average payout" }}
          className="border-l-4 border-l-emerald-500"
        />
        <StatsCard
          title="Average Distance"
          value={formatDistance(avgDistance)}
          icon={<MapPin className="h-5 w-5" />}
          trend={{ value: 0, isPositive: true, label: "shortest route" }}
        />
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search city, cargo, order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Priority:</span>
            <Select
              className="h-10 text-xs py-0 w-[130px]"
              options={[
                { value: "all", label: "All Priorities" },
                { value: "standard", label: "Standard" },
                { value: "express", label: "Express" },
                { value: "overnight", label: "Overnight" },
              ]}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <Select
              className="h-10 text-xs py-0 w-[170px]"
              options={[
                { value: "score-desc", label: "AI Score: Best First" },
                { value: "distance-asc", label: "Distance: Shortest" },
                { value: "payout-desc", label: "Payout: High to Low" },
                { value: "payout-asc", label: "Payout: Low to High" },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Delivery Cards */}
      {processedDeliveries.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No available dispatches"
          description="The AI engine found no pending matches in your zone right now. Check back soon!"
        />
      ) : (
        <Grid cols={3} colsTablet={2} colsMobile={1} gap="md">
          {processedDeliveries.map((job) => {
            const matchResult = getDriverMatchResult(job.id, currentDriverId);
            return (
              <AIMatchCard
                key={job.id}
                delivery={job}
                matchResult={matchResult}
                onAccept={() => handleAcceptJob(job)}
                onReject={() => {
                  toast.push(
                    "warning",
                    "Job Skipped",
                    `You passed on ${job.deliveryNumber}. It remains in the exchange.`
                  );
                }}
                expireInSeconds={300}
              />
            );
          })}
        </Grid>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Delivery Job Accepted!"
        message={successMessage}
      />

      {/* Toast */}
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
