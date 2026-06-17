"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Truck, Calendar, DollarSign, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import { DeliveryStatusTimeline } from "./DeliveryStatusTimeline";
import { MockDelivery } from "@/mock/deliveries";
import { formatCurrency, formatDistance, formatWeight } from "@/utils/formatters";

interface DeliveryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: MockDelivery | null;
  portal: "driver" | "org";
  onPublish?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartPickup?: (id: string) => void;
  onStartTransit?: (id: string) => void;
  onMarkArrived?: (id: string) => void;
  onMarkDelivered?: (id: string) => void;
  onRate?: (id: string) => void;
  onTrack?: (id: string) => void;
}

export function DeliveryDetailsModal({
  isOpen,
  onClose,
  delivery,
  portal,
  onPublish,
  onAccept,
  onReject,
  onStartPickup,
  onStartTransit,
  onMarkArrived,
  onMarkDelivered,
  onRate,
  onTrack,
}: DeliveryDetailsModalProps) {
  const isDriver = portal === "driver";

  const vehicleReadable = useMemo(() => {
    if (!delivery?.vehicleType) return "General Cargo";
    return delivery.vehicleType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [delivery?.vehicleType]);

  if (!delivery) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-elevated border border-border flex flex-col gap-4 text-left my-8"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Shipment Details</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-base font-bold text-foreground">{delivery.deliveryNumber}</h3>
                  <DeliveryStatusBadge status={delivery.status} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {/* Timeline animation */}
              <div className="rounded-xl border border-border/40 p-3 bg-muted/20">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 px-1">Tracking Timeline</p>
                <DeliveryStatusTimeline status={delivery.status} />
              </div>

              {/* Pickup & Drop Addresses */}
              <div className="space-y-2.5 rounded-xl border border-border/40 p-3.5 bg-card">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Route</p>
                <div className="space-y-3 mt-2">
                  <div className="flex gap-2">
                    <div className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-black text-[9px]">P</div>
                    <div>
                      <p className="text-[9px] text-muted-foreground leading-none font-bold">Pickup Origin</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{delivery.pickup}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center font-black text-[9px]">D</div>
                    <div>
                      <p className="text-[9px] text-muted-foreground leading-none font-bold">Dropoff Destination</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{delivery.drop}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs & Vehicle Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/40 p-3 bg-muted/20">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Vehicle Required</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">{vehicleReadable}</span>
                </div>
                <div className="rounded-xl border border-border/40 p-3 bg-muted/20">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Cargo Weight</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">{formatWeight(delivery.weight)}</span>
                </div>
                <div className="rounded-xl border border-border/40 p-3 bg-muted/20">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Distance Tier</span>
                  <span className="text-xs font-bold text-foreground mt-0.5 block">{formatDistance(delivery.distance)}</span>
                </div>
                <div className="rounded-xl border border-border/40 p-3 bg-muted/20">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Payout</span>
                  <span className="text-xs font-bold text-secondary mt-0.5 block">{formatCurrency(delivery.payment)}</span>
                </div>
              </div>

              {/* Organization or Driver specifics */}
              <div className="rounded-xl border border-border/40 p-3.5 bg-card text-xs space-y-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Stakeholders</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground">Logistics Provider:</span>
                  <span className="font-bold text-foreground">{delivery.organizationName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned Driver:</span>
                  <span className="font-bold text-foreground">{delivery.driverName || "Awaiting Driver Match"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priority Level:</span>
                  <span className="font-bold text-red-500 uppercase">{delivery.priority}</span>
                </div>
              </div>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex gap-2.5 border-t border-border pt-4">
              {/* Organization Portal Actions */}
              {!isDriver && (
                <>
                  {delivery.status === "draft" && onPublish && (
                    <Button onClick={() => onPublish(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Publish Shipment
                    </Button>
                  )}
                  {(delivery.status === "in_transit" || delivery.status === "near_destination" || delivery.status === "accepted") && onTrack && (
                    <Button onClick={() => onTrack(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Track Shipment Route
                    </Button>
                  )}
                  {delivery.status === "delivered" && onRate && (
                    <Button onClick={() => onRate(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-secondary hover:bg-secondary/90 text-white">
                      Rate Assigned Driver
                    </Button>
                  )}
                </>
              )}

              {/* Driver Portal Actions */}
              {isDriver && (
                <>
                  {delivery.status === "available" && onAccept && (
                    <Button onClick={() => onAccept(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Accept Delivery
                    </Button>
                  )}
                  {delivery.status === "accepted" && onStartPickup && (
                    <Button onClick={() => onStartPickup(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Start Pickup
                    </Button>
                  )}
                  {delivery.status === "pickup_started" && onStartTransit && (
                    <Button onClick={() => onStartTransit(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Start Transit
                    </Button>
                  )}
                  {delivery.status === "in_transit" && onMarkArrived && (
                    <Button onClick={() => onMarkArrived(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Flag Near Destination
                    </Button>
                  )}
                  {delivery.status === "near_destination" && onMarkDelivered && (
                    <Button onClick={() => onMarkDelivered(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-primary hover:bg-primary/95 text-primary-foreground">
                      Mark Completed (POD)
                    </Button>
                  )}
                  {delivery.status === "delivered" && onRate && (
                    <Button onClick={() => onRate(delivery.id)} className="flex-1 rounded-xl text-xs h-10 font-bold bg-secondary hover:bg-secondary/90 text-white">
                      Rate Logistics Partner
                    </Button>
                  )}
                </>
              )}

              {/* Cancel Reject Trigger */}
              {isDriver && (delivery.status === "accepted" || delivery.status === "assigned") && onReject && (
                <Button variant="outline" onClick={() => onReject(delivery.id)} className="rounded-xl text-xs h-10 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 shrink-0">
                  Reject
                </Button>
              )}

              <Button variant="outline" onClick={onClose} className="rounded-xl text-xs h-10 shrink-0">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
