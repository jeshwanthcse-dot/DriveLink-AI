"use client";

import { useMemo } from "react";
import { Calendar, ArrowRight, User, Building, Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import { MockDelivery } from "@/mock/deliveries";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";

interface DeliveryHistoryCardProps {
  delivery: MockDelivery;
  portal: "driver" | "org";
  onDetailClick?: () => void;
}

export function DeliveryHistoryCard({ delivery, portal, onDetailClick }: DeliveryHistoryCardProps) {
  const isDriver = portal === "driver";

  const formattedDate = useMemo(() => {
    return new Date(delivery.updatedAt || delivery.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }, [delivery.createdAt, delivery.updatedAt]);

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft hover:shadow-elevated transition-all overflow-hidden">
      <CardContent className="p-4 space-y-3.5">
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{delivery.deliveryNumber}</span>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
        </div>

        {/* Route visualization */}
        <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex-1 truncate text-left">{delivery.pickup.split(",")[0]}</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 truncate text-right">{delivery.drop.split(",")[0]}</div>
        </div>

        {/* Load parameters */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-t border-b border-border/40 py-2">
          <span>{formatWeight(delivery.weight)} · {formatDistance(delivery.distance)}</span>
          <span className="uppercase text-foreground">{delivery.vehicleType}</span>
        </div>

        {/* Details and Payout */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Party Details */}
          {isDriver ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate max-w-[120px]">{delivery.organizationName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <User className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span className="truncate max-w-[120px]">{delivery.driverName || "Awaiting Match"}</span>
            </div>
          )}

          {/* Earnings / Payouts */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground uppercase leading-none font-bold">
                {isDriver ? "Earnings" : "Payout"}
              </p>
              <p className="text-sm font-black text-secondary mt-0.5">{formatCurrency(delivery.payment)}</p>
            </div>
            {onDetailClick && (
              <button
                onClick={onDetailClick}
                className="rounded-lg border border-border hover:bg-muted text-foreground text-[10px] font-bold px-2.5 py-1 transition-colors h-7"
              >
                Receipt
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
