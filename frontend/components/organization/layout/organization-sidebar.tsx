"use client";

/**
 * OrganizationSidebar — Collapsible desktop sidebar & mobile slide-out drawer
 * Handles active route highlights, smooth animations, organization status center, and mock actions.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  MapPin,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Avatar } from "@/components/common/avatar";
import { ORG_NAV_ITEMS, MOCK_ORGANIZATION } from "@/constants/org-nav";
import { cn } from "@/lib/cn";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useDeliveries } from "@/hooks/useDeliveries";

// Resolve icon name strings to actual Lucide component references
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  PlusCircle,
  Package,
  MapPin,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  HelpCircle,
};

interface OrganizationSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function OrganizationSidebar({ isMobileOpen, onMobileClose }: OrganizationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (visible on large screen) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0 h-screen sticky top-0 overflow-y-auto",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          pathname={pathname}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Mobile Sidebar Slide-Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
              aria-hidden
            />
            {/* Drawer body */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card lg:hidden"
            >
              <button
                onClick={onMobileClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent
                isCollapsed={false}
                pathname={pathname}
                onToggleCollapse={() => {}}
                isMobile
                onLinkClick={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Internal Sidebar Content Layout ──────────────────────────────────────────

interface SidebarContentProps {
  isCollapsed: boolean;
  pathname: string;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

function SidebarContent({
  isCollapsed,
  pathname,
  onToggleCollapse,
  isMobile = false,
  onLinkClick,
}: SidebarContentProps) {
  const { activeOrganization, currentOrgId } = useOrganizations();
  const { deliveries } = useDeliveries();

  const activeCount = deliveries.filter(
    (d) =>
      d.organizationId === currentOrgId &&
      ["published", "available", "accepted", "assigned", "pickup_started", "in_transit", "near_destination"].includes(d.status)
  ).length;

  const orgName = activeOrganization?.name || MOCK_ORGANIZATION.name;
  const orgIndustry = activeOrganization?.industry || MOCK_ORGANIZATION.industry;
  const orgInitials = activeOrganization?.avatarInitials || MOCK_ORGANIZATION.avatarInitials;

  const navItems = ORG_NAV_ITEMS.map((item) => {
    if (item.label === "Active Deliveries") {
      return { ...item, badge: activeCount };
    }
    return item;
  });

  const handleLogout = () => {
    alert("Logout is disabled in static mock phase.");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header / Logo */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border px-4",
          isCollapsed ? "justify-center px-0" : ""
        )}
      >
        <Logo showText={!isCollapsed} />
      </div>

      {/* Organization status summary (expanded only) */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Market Status</span>
            <span className="flex items-center gap-1 text-secondary font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              Live Connected
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-foreground">
            {orgIndustry}
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sidebar navigation menu">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.iconName] ?? HelpCircle;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed ? "justify-center px-0" : ""
                  )}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
                  {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!isCollapsed && item.badge != null && item.badge > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Organization profile footer */}
      <div className={cn("border-t border-border p-3", isCollapsed ? "flex flex-col items-center gap-2" : "")}>
        {isCollapsed ? (
          <div className="relative">
            <Avatar initials={orgInitials} size="sm" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-secondary" />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-2.5">
            <div className="relative">
              <Avatar initials={orgInitials} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{orgName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{orgIndustry}</p>
            </div>
          </div>
        )}

        {/* Mock Logout button */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors mt-2",
            isCollapsed ? "justify-center px-0 text-red-500" : ""
          )}
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* Collapse arrow toggle button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className="flex h-10 w-full items-center justify-center border-t border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
