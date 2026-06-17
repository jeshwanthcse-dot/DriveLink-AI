"use client";

import { motion } from "framer-motion";
import { CloudOff, RefreshCw, Smartphone, Wifi, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { SectionContainer } from "@/components/layout/section-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OFFLINE_CAPABILITIES } from "@/constants/landing";

export function OfflineSyncSection() {
  return (
    <SectionContainer id="offline-sync">
      <SectionHeader
        badge="Offline Sync"
        title="Keep moving,"
        highlight="even offline"
        description="Drivers never lose progress. GPS, status updates, and delivery photos are stored locally and synced automatically when connectivity returns."
      />

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        <SyncPhaseCard
          icon={CloudOff}
          phase="Disconnected"
          description="Internet drops mid-route. DriveLink continues capturing data locally on the device."
          status="offline"
          index={0}
        />
        <SyncPhaseCard
          icon={Smartphone}
          phase="Local Storage"
          description="GPS coordinates, delivery status, progress, and proof-of-delivery images are queued securely."
          status="storing"
          index={1}
        />
        <SyncPhaseCard
          icon={RefreshCw}
          phase="Auto Sync"
          description="When the connection restores, everything uploads automatically. No manual intervention required."
          status="synced"
          index={2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Stored locally while offline</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {OFFLINE_CAPABILITIES.join(" · ")}
                </p>
              </div>
            </div>
            <Badge variant="default" className="shrink-0 px-4 py-1.5 text-sm">
              Zero data loss
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </SectionContainer>
  );
}

function SyncPhaseCard({
  icon: Icon,
  phase,
  description,
  status,
  index,
}: {
  icon: LucideIcon;
  phase: string;
  description: string;
  status: "offline" | "storing" | "synced";
  index: number;
}) {
  const statusColors = {
    offline: "text-amber-600 bg-amber-50 border-amber-200",
    storing: "text-primary bg-primary/5 border-primary/20",
    synced: "text-secondary bg-secondary/5 border-secondary/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.45 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status]}`}
            >
              {status}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{phase}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
