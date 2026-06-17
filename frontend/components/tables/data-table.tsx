"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  isLoading = false,
  emptyState,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Search Filter
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey as string];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort Filter
  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Pagination Filter
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {searchKey && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        )}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button className="h-10 px-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-muted transition-colors active:scale-95">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-400">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-semibold text-slate-700 dark:text-slate-300">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && requestSort(col.key)}
                  className={cn(
                    "px-6 py-4 select-none",
                    col.sortable ? "cursor-pointer hover:bg-muted/60" : ""
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400 dark:text-slate-500">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: itemsPerPage }).map((_, rIdx) => (
                <tr key={rIdx} className="border-b border-border last:border-b-0 animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">No records found</span>
                      <span className="text-xs text-slate-400">Try adjusting your keywords or filters.</span>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              // Standard Table Content
              paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs select-none">
          <span className="text-slate-400 font-medium">
            Showing Page <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border bg-card text-slate-600 dark:text-slate-300 hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pNum = pageIdx + 1;
              return (
                <button
                  key={pageIdx}
                  onClick={() => setCurrentPage(pNum)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-semibold transition-all",
                    currentPage === pNum
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "border border-border bg-card text-slate-600 hover:bg-muted"
                  )}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border bg-card text-slate-600 dark:text-slate-300 hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
