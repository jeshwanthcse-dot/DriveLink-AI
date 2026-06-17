/**
 * components/trust/RatingsReviewsFeed.tsx
 * Interactive ratings breakdown, stats distribution, and comments log feed.
 * Sprint 9 — DriveLink AI
 */

"use client";

import * as React from "react";
import { SafetyReview } from "@/types/trust";
import { useTrustStore } from "@/store/trust-store";
import { Star, MessageSquare, ShieldAlert, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface RatingsReviewsFeedProps {
  driverId: string;
}

export function RatingsReviewsFeed({ driverId }: RatingsReviewsFeedProps) {
  const getReviews = useTrustStore((state) => state.getReviews);
  const reviews = getReviews(driverId);

  const [ratingFilter, setRatingFilter] = React.useState<number | "all">("all");

  // Calculate statistics
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2)) 
    : 5.00;

  // Star distributions
  const distributions = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = ratingFilter === "all"
    ? reviews
    : reviews.filter((r) => r.rating === ratingFilter);

  // Helper to render stars
  const renderStars = (rating: number, size = 14) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{ width: size, height: size }}
            className={cn(
              star <= rating 
                ? "text-amber-500 fill-amber-500" 
                : "text-slate-200 dark:text-slate-700"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Rating statistics summary panel */}
        <Card className="md:col-span-5 bg-white dark:bg-slate-900 border-border">
          <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
            <div className="text-center py-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aggregate Safety Rating</h4>
              <div className="text-4xl font-extrabold text-slate-800 dark:text-white leading-none font-mono">
                {averageRating.toFixed(2)}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(averageRating), 18)}
              </div>
              <div className="text-[10px] text-slate-400 mt-2 font-medium">
                Based on {reviewCount} organization reports
              </div>
            </div>

            {/* Distributions bars */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = distributions[star];
                const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

                return (
                  <button
                    key={star}
                    onClick={() => setRatingFilter(ratingFilter === star ? "all" : star)}
                    className={cn(
                      "flex items-center gap-3 w-full text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-850 p-1 rounded transition-colors duration-150 group",
                      ratingFilter === star ? "bg-primary/5 text-primary" : "text-slate-650"
                    )}
                  >
                    <span className="w-3 font-semibold text-slate-550 group-hover:text-primary">{star}★</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filtered feedback reviews list */}
        <Card className="md:col-span-7 bg-white dark:bg-slate-900 border-border">
          <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">Safety Reviews Feed</CardTitle>
              <CardDescription className="text-xs">Cargo handling and dispatch safety performance reports</CardDescription>
            </div>
            {ratingFilter !== "all" && (
              <button
                onClick={() => setRatingFilter("all")}
                className="text-[10px] font-bold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-full"
              >
                Clear Filter ({ratingFilter}★)
              </button>
            )}
          </CardHeader>
          <CardContent className="p-6 pt-5">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                <h5 className="text-xs font-bold text-slate-600 dark:text-slate-400">No matching reviews</h5>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                  No safety ratings matching {ratingFilter}★ were found.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-border/40 rounded-xl space-y-2 hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rev.orgName}
                        </h5>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{rev.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {renderStars(rev.rating)}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          Vetted Run
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
