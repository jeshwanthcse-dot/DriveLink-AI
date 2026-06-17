/**
 * components/trust/ExpiryAlertsDashboard.tsx
 * Grid-layout renewal alerts showing countdown days remaining for all documents.
 * Sprint 9 — DriveLink AI
 */

"use client";

import * as React from "react";
import { DriverDocument, DocumentType } from "@/types/trust";
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpiryAlertsDashboardProps {
  documents: Record<DocumentType, DriverDocument>;
}

const documentLabels: Record<DocumentType, string> = {
  license: "Driving License",
  insurance: "Commercial Insurance",
  rc: "Vehicle RC (Registration)",
  puc: "PUC Certificate",
  photo: "Profile photo",
};

export function ExpiryAlertsDashboard({ documents }: ExpiryAlertsDashboardProps) {
  // Expirable documents
  const expirableTypes: DocumentType[] = ["license", "insurance", "rc", "puc"];

  const getDaysRemaining = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const diffTime = new Date(expiryDate).getTime() - Date.now();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAlertLevel = (days: number | null, status: string) => {
    if (status === "missing") return "missing";
    if (status === "rejected") return "rejected";
    if (status === "pending") return "pending";
    if (days === null) return "none";
    if (days <= 0) return "critical";
    if (days <= 7) return "urgent";
    if (days <= 30) return "warning";
    return "safe";
  };

  const activeAlerts = expirableTypes
    .map((type) => {
      const doc = documents[type];
      const days = getDaysRemaining(doc.expiryDate);
      const level = getAlertLevel(days, doc.status);
      return { type, doc, days, level };
    })
    .filter((alert) => alert.level !== "none" && alert.level !== "safe");

  return (
    <div className="space-y-6">
      {/* Active Alerts List banner */}
      {activeAlerts.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Action Required: {activeAlerts.length} Renewal Alert{activeAlerts.length > 1 ? "s" : ""}
              </h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                Some credentials are expiring soon or require upload to ensure compliance. Avoid service interruption by updating them.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid of Expirable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expirableTypes.map((type) => {
          const doc = documents[type];
          const days = getDaysRemaining(doc.expiryDate);
          const level = getAlertLevel(days, doc.status);

          let levelBadge = null;
          let progressColor = "bg-emerald-500";
          let progressPct = 100;
          let cardBorder = "border-border";

          if (level === "critical") {
            levelBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 uppercase">
                Expired
              </span>
            );
            progressColor = "bg-red-500";
            progressPct = 0;
            cardBorder = "border-red-500/30";
          } else if (level === "urgent") {
            levelBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                {days} Days Left
              </span>
            );
            progressColor = "bg-red-500 animate-pulse";
            progressPct = Math.max(5, Math.min(100, ((days || 0) / 30) * 100));
            cardBorder = "border-red-400/30";
          } else if (level === "warning") {
            levelBadge = (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                {days} Days Left
              </span>
            );
            progressColor = "bg-amber-500";
            progressPct = ((days || 0) / 30) * 100;
            cardBorder = "border-amber-400/20";
          } else if (level === "pending") {
            levelBadge = (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                In Review
              </span>
            );
            progressColor = "bg-blue-400 animate-pulse";
            progressPct = 50;
          } else if (level === "missing") {
            levelBadge = (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 border border-slate-200 dark:border-slate-700 uppercase">
                Missing
              </span>
            );
            progressColor = "bg-slate-300 dark:bg-slate-700";
            progressPct = 0;
            cardBorder = "border-dashed border-slate-300 dark:border-slate-800";
          } else if (level === "rejected") {
            levelBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 uppercase">
                Rejected
              </span>
            );
            progressColor = "bg-red-500";
            progressPct = 0;
            cardBorder = "border-red-500/20";
          } else {
            levelBadge = (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                {days} Days Left
              </span>
            );
            progressColor = "bg-emerald-500";
            progressPct = 100;
          }

          return (
            <Card key={type} className={`shadow-sm bg-white dark:bg-slate-900/60 overflow-hidden ${cardBorder}`} suppressHydrationWarning>
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {documentLabels[type]}
                    </h5>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {doc.fileName ? doc.fileName : "No file uploaded"}
                    </p>
                  </div>
                  {levelBadge}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-550 ${progressColor}`} style={{ width: `${progressPct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-450">
                    <span>
                      {doc.expiryDate
                        ? `Expires: ${new Date(doc.expiryDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : doc.status === "missing"
                        ? "Needs initial upload"
                        : "Verification pending"}
                    </span>
                    {days !== null && days > 0 && (
                      <span className="font-medium text-slate-650 dark:text-slate-350">
                        {days} day{days > 1 ? "s" : ""} left
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
