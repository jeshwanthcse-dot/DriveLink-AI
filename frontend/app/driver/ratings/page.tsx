"use client";

import * as React from "react";
import { Star, MessageSquare, ThumbsUp, Award, Clock } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/cards/card-variants";
import { useTrustStore } from "@/store/trust-store";
import { RatingsReviewsFeed } from "@/components/trust/RatingsReviewsFeed";

export default function DriverRatingsPage() {
  const { currentDriverId } = useDrivers();
  const { deliveries } = useDeliveries();
  const getProfile = useTrustStore((state) => state.getProfile);
  const getReviews = useTrustStore((state) => state.getReviews);

  React.useEffect(() => {
    useTrustStore.getState().loadFromStorage();
  }, []);

  const driverId = currentDriverId || "DRV-001";
  const profile = getProfile(driverId);
  const reviews = getReviews(driverId);

  const completedJobs = React.useMemo(() => {
    return deliveries.filter(
      (d) => d.driverId === driverId && d.status === "delivered"
    );
  }, [deliveries, driverId]);

  // Dynamic rating value calculation
  const ratingVal = React.useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return parseFloat((total / reviews.length).toFixed(2));
  }, [reviews]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vetted Safety Ratings"
        subtitle="Review feedback scores and comments logged by logistics coordinators."
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Average Safety Rating"
          value={`${ratingVal.toFixed(2)} / 5.0`}
          icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
          trend={{ value: 100, isPositive: true, label: "Top 5% of fleet" }}
          className="border-l-4 border-l-amber-500"
        />
        <StatsCard
          title="Client Vetted Reviews"
          value={reviews.length}
          icon={<MessageSquare className="h-5 w-5" />}
          trend={{ value: completedJobs.length, isPositive: true, label: "Total reviews logged" }}
        />
        <StatsCard
          title="Completed Deliveries"
          value={completedJobs.length}
          icon={<ThumbsUp className="h-5 w-5" />}
          trend={{ value: 100, isPositive: true, label: "100% safety match" }}
        />
      </div>

      {/* Interactive Breakdown & Feed */}
      <RatingsReviewsFeed driverId={driverId} />
    </div>
  );
}
