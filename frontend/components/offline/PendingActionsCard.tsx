"use client";

/**
 * components/offline/PendingActionsCard.tsx
 * Details exact actions buffered in offlineQueue
 * Sprint 8 — DriveLink AI
 */

import * as React from "react";
import { useOfflineStore } from "@/store/offline-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Image as ImageIcon, MapPin, Milestone, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

export function PendingActionsCard() {
  const queue = useOfflineStore((state) => state.offlineQueue);
  const [expanded, setExpanded] = React.useState(false);

  if (queue.length === 0) return null;

  const getActionIcon = (type: string) => {
    switch (type) {
      case "gps": return <MapPin className="h-3.5 w-3.5 text-blue-500" />;
      case "photo": return <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />;
      case "status": return <Milestone className="h-3.5 w-3.5 text-amber-500" />;
      case "timeline": return <Milestone className="h-3.5 w-3.5 text-orange-500" />;
      case "note": return <FileText className="h-3.5 w-3.5 text-violet-500" />;
      default: return <ClipboardList className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getActionDescription = (item: any) => {
    switch (item.type) {
      case "gps":
        return `GPS Coordinate (${item.payload.point.lat.toFixed(4)}, ${item.payload.point.lng.toFixed(4)}) at ${item.payload.point.speed} km/h`;
      case "photo":
        return "Proof of Delivery Photo Upload queued";
      case "status":
        return `Delivery status update queued: ${item.payload.status}`;
      case "timeline":
        return `Milestone transition queued: ${item.payload.milestone}`;
      case "note":
        return `Check-in note logged: "${item.payload.note.length > 28 ? item.payload.note.substring(0, 25) + '...' : item.payload.note}"`;
      default:
        return "General sync log queued";
    }
  };

  return (
    <Card className="rounded-2xl border-border bg-card shadow-soft overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <ClipboardList className="h-4 w-4 text-violet-500" />
            Pending Action Logs
          </CardTitle>
          <CardDescription className="text-[11px]">
            Inspect items scheduled for sync replay
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className="bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold border-violet-400/30 text-[10px]">
            {queue.length} items
          </Badge>
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardContent className="pt-2 pb-4 border-t border-border/40">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {queue.map((item) => (
                  <div key={item.id} className="flex gap-2.5 p-2 bg-muted/40 rounded-lg border border-border/40 hover:border-primary/20 transition-all">
                    <div className="mt-0.5 shrink-0">{getActionIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[11px] text-slate-700 dark:text-slate-300 truncate">
                        {getActionDescription(item)}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5" suppressHydrationWarning>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
