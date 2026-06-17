"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

interface ChartDataItem {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartDataItem[];
  title?: string;
  description?: string;
  height?: number;
  className?: string;
}

export function BarChart({ data, title, description, height = 200, className }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-soft select-none", className)}>
      {(title || description) && (
        <div className="flex flex-col mb-6">
          {title && <h4 className="font-bold text-slate-900 dark:text-white text-base">{title}</h4>}
          {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>}
        </div>
      )}

      {/* Chart Canvas */}
      <div className="flex items-end gap-3 justify-between" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg absolute translate-y-[-40px] pointer-events-none shadow-soft z-10">
                {item.value}
              </div>

              {/* Bar Column */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                className="w-full max-w-[40px] rounded-t-lg bg-primary hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-soft"
              />

              {/* Label */}
              <span className="text-[10px] font-semibold text-slate-400 uppercase truncate max-w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LineChart({ data, title, description, height = 200, className }: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-soft select-none", className)}>
      {(title || description) && (
        <div className="flex flex-col mb-6">
          {title && <h4 className="font-bold text-slate-900 dark:text-white text-base">{title}</h4>}
          {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>}
        </div>
      )}

      {/* Chart Canvas */}
      <div className="flex flex-col justify-between" style={{ height: `${height}px` }}>
        {/* Mock Line Graph grid rows */}
        <div className="flex-1 flex flex-col justify-between border-b border-l border-slate-200 dark:border-slate-800 pl-2 pb-2 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800/40 w-full h-0" />
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800/40 w-full h-0" />
            <div className="border-t border-dashed border-slate-100 dark:border-slate-800/40 w-full h-0" />
          </div>

          {/* Points display */}
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {data.map((item, idx) => {
              const heightPercent = (item.value / maxValue) * 100;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end h-full relative group"
                  style={{ width: `${100 / data.length}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg absolute pointer-events-none shadow-soft z-10" style={{ bottom: `${heightPercent + 10}%` }}>
                    {item.value}
                  </div>

                  {/* Dot Point */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 bg-primary hover:bg-blue-600 shadow-soft transition-transform group-hover:scale-125 z-10 cursor-pointer"
                    style={{ bottom: `calc(${heightPercent}% - 7px)`, absolute: "true" } as any}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Labels Row */}
        <div className="flex justify-between items-center pl-2 pt-2 text-[10px] font-semibold text-slate-400 uppercase">
          {data.map((item, idx) => (
            <div key={idx} className="text-center truncate" style={{ width: `${100 / data.length}%` }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
