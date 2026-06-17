/**
 * NotificationIcon — Bell icon with optional unread badge count
 * Server component — count prop passed from parent
 */

import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";

interface NotificationIconProps {
  count?: number;
  className?: string;
}

export function NotificationIcon({ count = 0, className }: NotificationIconProps) {
  const hasUnread = count > 0;

  return (
    <div className={cn("relative inline-flex", className)} aria-label={`${count} notifications`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted">
        <Bell className="h-4.5 w-4.5 text-muted-foreground" aria-hidden />
      </div>
      {hasUnread && (
        <span
          className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground"
          aria-hidden
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}
