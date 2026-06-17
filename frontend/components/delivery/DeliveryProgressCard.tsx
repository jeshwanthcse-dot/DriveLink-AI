"use client";

import { useMemo } from "react";
import { Truck, Navigation, Calendar, User, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import { MockDelivery } from "@/mock/deliveries";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";
import { motion } from "framer-motion";

const STATUS_PROGRESS: Record<MockDelivery["status"], number> = {
  draft: 5,
  published: 10,
  available: 15,
  accepted: 30,
  assigned: 35,
  pickup_started: 50,
  in_transit: 70,
  near_destination: 85,
  delivered: 95,
  completed: 100,
  rated: 100,
  cancelled: 100,
  pending: 15,
};

interface DeliveryProgressCardProps {
  delivery: MockDelivery;
  onTrackClick?: () => void;
  onActionClick?: () => void;
  actionLabel?: string;
}

export function DeliveryProgressCard({
  delivery,
  onTrackClick,
  onActionClick,
  actionLabel,
}: DeliveryProgressCardProps) {
  const progressPercent = useMemo(() => {
    return STATUS_PROGRESS[delivery.status] || 0;
  }, [delivery.status]);

  const vehicleIcon = useMemo(() => {
    return <Truck className="h-5 w-5 text-primary" />;
  }, []);

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft hover:shadow-elevated transition-all overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header line */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{delivery.deliveryNumber}</span>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <span className="text-xs font-black text-secondary">{formatCurrency(delivery.payment)}</span>
        </div>

        {/* Route addresses */}
        <div className="space-y-1.5 py-1">
          <div className="flex items-start gap-2 text-xs">
            <div className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
            <p className="text-muted-foreground font-semibold truncate flex-1">{delivery.pickup}</p>
          </div>
          <div className="pl-1 h-3 w-px border-l border-dashed border-border" />
          <div className="flex items-start gap-2 text-xs">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
            <p className="text-muted-foreground font-semibold truncate flex-1">{delivery.drop}</p>
          </div>
        </div>

        {/* Progress percent line */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Overall Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Telemetry info */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-semibold text-muted-foreground gap-3 border-t border-border pt-3.5">
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            <span>{formatWeight(delivery.weight)} · {formatDistance(delivery.distance)}</span>
          </div>
          {delivery.driverName ? (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-foreground" />
              <span className="text-foreground font-bold">{delivery.driverName}</span>
            </div>
          ) : (
            <span className="italic text-slate-400">No driver assigned</span>
          )}
        </div>

        {/* Custom Actions */}
        {(onTrackClick || onActionClick) && (
          <div className="flex gap-2.5 pt-1 border-t border-border">
            {onTrackClick && (
              <button
                onClick={onTrackClick}
                className="flex-1 rounded-xl border border-primary/20 text-primary text-xs font-bold py-2 bg-primary/5 hover:bg-primary/10 transition-colors h-9"
              >
                Track Shipment
              </button>
            )}
            {onActionClick && actionLabel && (
              <button
                onClick={onActionClick}
                className="flex-1 rounded-xl bg-primary text-primary-foreground text-xs font-bold py-2 hover:bg-primary/95 transition-colors h-9"
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
