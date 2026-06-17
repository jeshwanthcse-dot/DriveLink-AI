"use client";

import * as React from "react";
import {
  Package,
  MapPin,
  Weight,
  CheckCircle2,
  Calendar,
  DollarSign,
  Award,
  ArrowUpRight,
  Search,
  Camera,
  Star
} from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { formatCurrency, formatDistance, formatDate, formatWeight } from "@/utils/formatters";
import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/cards/card-variants";
import { EmptyState } from "@/components/empty-state/empty-states";
import { Badge } from "@/components/badges/badge";
import { ReusableButton } from "@/components/buttons/button-variants";
import { Input, Select } from "@/components/forms/form-inputs";
import { Grid, Stack } from "@/components/layout/layouts";
import { MockDelivery } from "@/mock/deliveries";

export default function CompletedDeliveriesPage() {
  const { currentDriverId } = useDrivers();
  const { deliveries } = useDeliveries();

  // Search & sorting state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter completed deliveries for active driver
  const completedJobs = React.useMemo(() => {
    return deliveries.filter(
      (d) => d.driverId === currentDriverId && ["delivered", "completed", "rated"].includes(d.status)
    );
  }, [deliveries, currentDriverId]);

  // Search, filter, and sort
  const processedJobs = React.useMemo(() => {
    let result = [...completedJobs];

    if (searchTerm) {
      const cleanTerm = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.deliveryNumber.toLowerCase().includes(cleanTerm) ||
          d.organizationName.toLowerCase().includes(cleanTerm) ||
          d.pickup.toLowerCase().includes(cleanTerm) ||
          d.drop.toLowerCase().includes(cleanTerm)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (sortBy === "earnings-desc") return b.payment - a.payment;
      if (sortBy === "distance-desc") return b.distance - a.distance;
      return 0;
    });

    return result;
  }, [completedJobs, searchTerm, sortBy]);

  // Paginated data
  const paginatedJobs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [processedJobs, currentPage]);

  const totalPages = Math.ceil(processedJobs.length / itemsPerPage);

  const totalEarnings = completedJobs.reduce((sum, d) => sum + d.payment, 0);

  const handleViewReceipt = (job: MockDelivery) => {
    alert(`POD Receipt for ${job.deliveryNumber}: Completed on ${formatDate(job.updatedAt)}. GPS Location verified. Payout of ${formatCurrency(job.payment)} transferred.`);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Deliveries"
        subtitle="Review your historical completed shipments, earnings payouts, and receipts."
      />

      {/* Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total completed"
          value={completedJobs.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: 100, isPositive: true, label: "All-time deliveries" }}
          className="border-l-4 border-l-emerald-500"
        />
        <StatsCard
          title="Total Earnings Payout"
          value={formatCurrency(totalEarnings)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 14.2, isPositive: true, label: "Earned on platform" }}
        />
        <StatsCard
          title="Vetted Safety Score"
          value="4.9 / 5.0"
          icon={<Award className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true, label: "Excellent Rating" }}
        />
      </div>

      {/* Filters Control Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search client, cargo, order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 text-xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
            <Select
              className="h-10 text-xs py-0 w-[180px]"
              options={[
                { value: "date-desc", label: "Date: Newest First" },
                { value: "date-asc", label: "Date: Oldest First" },
                { value: "earnings-desc", label: "Earnings: High to Low" },
                { value: "distance-desc", label: "Distance: Longest" },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {processedJobs.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No completed trips found"
          description="You haven't completed any matched deliveries yet. Check the available matching feed."
        />
      ) : (
        <Stack gap="md">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-400">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-slate-700 dark:text-slate-300">
                  <th className="px-6 py-4">Delivery #</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Completed Date</th>
                  <th className="px-6 py-4">Specs</th>
                  <th className="px-6 py-4">Earning</th>
                  <th className="px-6 py-4">POD Photo</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{job.deliveryNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{job.organizationName}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[180px]">{job.pickup.split(",")[0]} ➔ {job.drop.split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{formatDate(job.updatedAt)}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-col">
                        <span>{formatWeight(job.weight)}</span>
                        <span className="text-slate-400">{formatDistance(job.distance)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(job.payment)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-400 text-xs select-none">
                        <Camera className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>Verified</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReusableButton variant="outline" size="sm" className="h-8" onClick={() => handleViewReceipt(job)}>
                        Receipt
                      </ReusableButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {paginatedJobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl border border-border bg-card shadow-card space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{job.deliveryNumber}</span>
                  <Badge variant="success">Completed</Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{job.organizationName}</p>
                  <p className="text-slate-400">{job.pickup.split(",")[0]} ➔ {job.drop.split(",")[0]}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Earning</span>
                    <span className="font-bold text-emerald-600 text-sm">{formatCurrency(job.payment)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{new Date(job.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <ReusableButton variant="outline" size="sm" className="w-full" onClick={() => handleViewReceipt(job)}>
                    View Receipt Details
                  </ReusableButton>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-slate-400">
                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <ReusableButton
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </ReusableButton>
                <ReusableButton
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </ReusableButton>
              </div>
            </div>
          )}
        </Stack>
      )}
    </div>
  );
}
