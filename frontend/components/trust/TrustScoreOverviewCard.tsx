/**
 * components/trust/TrustScoreOverviewCard.tsx
 * Trust score SVG gauge, tier level descriptors, and achievement icons.
 * Sprint 9 — DriveLink AI
 */

"use client";

import * as React from "react";
import { TrustProfile } from "@/types/trust";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Award, Trophy, Zap, Star, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface TrustScoreOverviewCardProps {
  profile: TrustProfile;
  driverRating?: number;
  completedDeliveries?: number;
}

export function TrustScoreOverviewCard({
  profile,
  driverRating = 4.9,
  completedDeliveries = 118,
}: TrustScoreOverviewCardProps) {
  const score = profile.trustScore;
  const level = profile.verificationLevel;

  // SVG configuration
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Level Styling
  let tierLabel = "Unverified";
  let tierDesc = "Needs documents uploaded for verification.";
  let tierBadgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
  let gaugeColor = "stroke-slate-400 dark:stroke-slate-700";

  if (level === "elite") {
    tierLabel = "Elite Carrier";
    tierDesc = "All documents verified. High rating and runs record.";
    tierBadgeClass = "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50";
    gaugeColor = "stroke-indigo-500 dark:stroke-indigo-400";
  } else if (level === "vetted") {
    tierLabel = "Vetted Carrier";
    tierDesc = "Credentials validated. Compliance audits approved.";
    tierBadgeClass = "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
    gaugeColor = "stroke-emerald-500 dark:stroke-emerald-400";
  } else if (level === "basic") {
    tierLabel = "Basic Verified";
    tierDesc = "Initial setup approved. Upload all files for Elite tier.";
    tierBadgeClass = "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50";
    gaugeColor = "stroke-blue-500 dark:stroke-blue-400";
  }

  // Count verified documents
  const totalDocs = Object.keys(profile.documents).length;
  const verifiedDocs = Object.values(profile.documents).filter(
    (d) => d.status === "verified" || d.status === "expires_soon"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* Left pane: Circular Trust Score Gauge */}
      <Card className="md:col-span-5 bg-white dark:bg-slate-900 border-border">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trust Reliability Score</h4>
          
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Highlight circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={cn("transition-all duration-750 ease-out", gaugeColor)}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Centered text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none font-mono">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                Score
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm select-none",
              tierBadgeClass
            )}>
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              {tierLabel}
            </div>
            <p className="text-[10px] text-slate-450 mt-1 leading-relaxed max-w-[200px]">
              {tierDesc}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Right pane: Details & Achievements */}
      <Card className="md:col-span-7 bg-white dark:bg-slate-900 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">Trust Statistics & Badges</CardTitle>
          <CardDescription className="text-xs">Formula breakdown and achievements scorecard</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-5">
          {/* Trust Score Factors */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
              <div className="flex justify-center text-amber-500 mb-1">
                <Star className="h-4 w-4 fill-amber-500" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Driver Rating</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{driverRating.toFixed(2)}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
              <div className="flex justify-center text-primary mb-1">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Completed Runs</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{completedDeliveries}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-border/50 text-center">
              <div className="flex justify-center text-emerald-500 mb-1">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Documents Verified</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{verifiedDocs}/{totalDocs}</div>
            </div>
          </div>

          {/* Unlocked Achievements list */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-150 uppercase tracking-wide">
                Unlocked Carrier Achievements
              </h5>
            </div>

            {profile.achievements.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-dashed border-border/60 text-center text-[10px] text-slate-400">
                No achievements unlocked yet. Upload and verify documents to claim badges.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-center gap-2.5 p-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-border/50 rounded-xl hover:shadow-sm transition-all duration-200"
                  >
                    <div className="text-xl p-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-border/25">
                      {ach.icon}
                    </div>
                    <div>
                      <h6 className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{ach.title}</h6>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
