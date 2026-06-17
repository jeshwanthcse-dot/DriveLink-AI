"use client";

import { useState, useEffect } from "react";
import { Camera, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeliveryEvidenceCardProps {
  onSubmit: (photoUrl: string, lat: number, lng: number, timestamp: string) => void;
  deliveryNumber: string;
}

export function DeliveryEvidenceCard({ onSubmit, deliveryNumber }: DeliveryEvidenceCardProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    // Generate mock GPS coordinates and current timestamp
    setGps({ lat: 32.7767 + (Math.random() - 0.5) * 0.05, lng: -96.7970 + (Math.random() - 0.5) * 0.05 });
    setTimestamp(new Date().toISOString());
  }, []);

  const handleSimulateCapture = () => {
    // Set a simulated photo payload URL
    setPhoto("/assets/proofs/delivery-proof-mock.jpg");
  };

  const handleSubmit = () => {
    if (photo && gps) {
      onSubmit(photo, gps.lat, gps.lng, timestamp);
    }
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">Delivery Evidence</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Upload photo proof of delivery for {deliveryNumber}. GPS and timestamp are auto-logged.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Upload Area */}
        <div className="relative aspect-video rounded-xl bg-muted/40 border-2 border-dashed border-border flex flex-col items-center justify-center p-4 hover:bg-muted/60 transition-colors overflow-hidden">
          {photo ? (
            <>
              {/* Fake visual matching image */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Proof Photo Uploaded</p>
                  <p className="text-[10px] text-muted-foreground font-mono">/assets/proofs/delivery-proof-mock.jpg</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-lg px-2 py-1 text-[9px] font-bold backdrop-blur-sm hover:bg-black/80"
              >
                Reset
              </button>
            </>
          ) : (
            <button type="button" onClick={handleSimulateCapture} className="flex flex-col items-center gap-2 text-center focus:outline-none">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Click to Capture POD Photo</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Captures high-resolution recipient package details</p>
              </div>
            </button>
          )}
        </div>

        {/* GPS and Timestamp logs */}
        {gps && (
          <div className="rounded-xl bg-muted/30 border border-border/50 p-3 space-y-2 text-[11px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex justify-between flex-1">
                <span>GPS Location:</span>
                <span className="font-mono text-foreground font-bold">
                  {gps.lat.toFixed(6)}° N, {Math.abs(gps.lng).toFixed(6)}° W
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
              <div className="flex justify-between flex-1">
                <span>Timestamp:</span>
                <span className="text-foreground font-bold" suppressHydrationWarning>
                  {new Date(timestamp).toLocaleDateString("en-IN")} · {new Date(timestamp).toLocaleTimeString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Action Button */}
        <Button
          onClick={handleSubmit}
          className="w-full rounded-xl text-xs h-10 font-bold"
          disabled={!photo}
        >
          Confirm POD & Submit
        </Button>
      </CardContent>
    </Card>
  );
}
