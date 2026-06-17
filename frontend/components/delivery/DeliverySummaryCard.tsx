"use client";

import { useMemo } from "react";
import { Truck, MapPin, Package, ArrowRight, Layers, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MockDelivery } from "@/mock/deliveries";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";

interface DeliverySummaryCardProps {
  delivery: Partial<MockDelivery>;
  className?: string;
}

export function DeliverySummaryCard({ delivery, className }: DeliverySummaryCardProps) {
  const vehicleReadable = useMemo(() => {
    if (!delivery.vehicleType) return "General Cargo";
    return delivery.vehicleType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [delivery.vehicleType]);

  return (
    <Card className={className}>
      <CardContent className="p-5 space-y-4">
        {/* Route Details */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Route Summary</p>
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <MapPin className="h-3 w-3" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none font-bold">Pickup Origin</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{delivery.pickup || "Not set"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-3 w-3" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none font-bold">Dropoff Destination</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{delivery.drop || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Cargo specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/40 p-2.5 border border-border/40">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Weight Load</span>
            </div>
            <p className="text-xs font-bold text-foreground mt-0.5">{formatWeight(delivery.weight || 0)}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5 border border-border/40">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Vehicle Class</span>
            </div>
            <p className="text-xs font-bold text-foreground mt-0.5">{vehicleReadable}</p>
          </div>
        </div>

        {/* Additional specs */}
        <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground font-semibold gap-3">
          <div className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            <span>Priority: <strong className="text-red-500 uppercase">{delivery.priority || "standard"}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
            <span>Distance: <strong>{formatDistance(delivery.distance || 0)}</strong></span>
          </div>
        </div>

        {/* Total Cost card */}
        {delivery.payment && (
          <div className="rounded-2xl bg-secondary/10 p-3.5 border border-secondary/20 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-widest leading-none">Calculated Payout</p>
              <p className="text-xs text-muted-foreground mt-0.5">Corporate matches fee covered</p>
            </div>
            <span className="text-lg font-black text-secondary">{formatCurrency(delivery.payment)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
