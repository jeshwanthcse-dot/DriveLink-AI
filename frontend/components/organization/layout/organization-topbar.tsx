"use client";

/**
 * OrganizationTopbar — Reusable top bar for the Organization portal
 * Includes search inputs, dynamic breadcrumbs, notification feeds, theme toggle, and create delivery shortcut.
 */

import * as React from "react";
import { useState } from "react";
import { Menu, Search, Sun, Moon, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { OrganizationBreadcrumb } from "../navigation/organization-breadcrumb";
import { Avatar } from "@/components/common/avatar";
import { NotificationIcon } from "@/components/ui/notification-icon";
import { LinkButton } from "@/components/ui/link-button";
import { MOCK_ORGANIZATION } from "@/constants/org-nav";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

import { useAppStore } from "@/store/app-store";

interface OrganizationTopbarProps {
  onMobileMenuOpen: () => void;
}

export function OrganizationTopbar({ onMobileMenuOpen }: OrganizationTopbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const allNotifications = useAppStore((state) => state.notifications);
  const notifications = React.useMemo(() => {
    return allNotifications.filter((n) => n.portal === "org");
  }, [allNotifications]);
  const markNotificationsAsRead = useAppStore((state) => state.markNotificationsAsRead);
  
  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left section: mobile hamburger + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted lg:hidden"
          aria-label="Open mobile navigation sidebar"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <div className="hidden sm:block">
          <OrganizationBreadcrumb />
        </div>
      </div>

      {/* Middle: search bar */}
      <div className="hidden max-w-xs flex-1 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search deliveries, drivers..."
            className="h-9 w-full rounded-xl border border-border bg-background/50 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Right side: quick actions & user info */}
      <div className="flex items-center gap-3">
        {/* Quick Action: Create Delivery shortcut */}
        <LinkButton
          href={ROUTES.organization.createDelivery}
          size="sm"
          className="h-9 px-3 gap-1 hidden sm:flex bg-primary hover:bg-primary/95 text-xs text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Delivery
        </LinkButton>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Toggle theme mode"
        >
          {isDark ? <Sun className="h-4.5 w-4.5 text-foreground" /> : <Moon className="h-4.5 w-4.5 text-muted-foreground" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications dropdown menu"
          >
            <NotificationIcon count={unreadCount} />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2.5 z-50 w-72 origin-top-right rounded-2xl border border-border bg-card p-4 shadow-elevated">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="text-xs font-bold text-foreground">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markNotificationsAsRead("org")}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="text-xs text-center text-muted-foreground py-4">No notifications yet.</li>
                  ) : (
                    notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className={cn(
                          "rounded-xl p-2.5 transition-colors border",
                          notif.read ? "bg-muted/10 border-transparent" : "bg-primary/5 border-primary/10 font-medium"
                        )}
                      >
                        <p className="text-xs text-foreground leading-normal">{notif.message}</p>
                        <span className="text-[9px] text-muted-foreground mt-1.5 block" suppressHydrationWarning>
                          {new Date(notif.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Organization avatar */}
        <div className="flex items-center gap-2 border-l pl-3">
          <Avatar initials={MOCK_ORGANIZATION.avatarInitials} size="sm" />
          <div className="hidden text-left xl:block">
            <p className="text-xs font-semibold leading-tight">{MOCK_ORGANIZATION.name}</p>
            <span className="text-[10px] text-muted-foreground">{MOCK_ORGANIZATION.industry}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
