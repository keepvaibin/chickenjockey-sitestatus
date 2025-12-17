"use client";

import { formatShortTimeRange } from "@/lib/statusMath";

const COLORS = {
  up: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]",
  mostly: "bg-emerald-400/80",
  partial: "bg-emerald-300/45 dark:bg-emerald-400/25",
  down: "bg-zinc-400 dark:bg-zinc-600"
};

function stateLabel(state) {
  if (state === "up") return "Online";
  if (state === "mostly") return "Mostly online";
  if (state === "partial") return "Partial";
  return "Down";
}

export default function HistoryStrip({ dots }) {
  if (!dots) {
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Past 7 days</span>
          <span className="mono">Each dot = 1 hour</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-[2px] opacity-70">
          {Array.from({ length: 168 }).map((_, i) => (
            <span
              key={i}
              className="h-[7px] w-[7px] animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Past 7 days</span>
        <span className="mono">Each dot = 1 hour</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-[2px]">
        {dots.map((d, i) => {
          const cls = COLORS[d.state] ?? COLORS.down;
          const label = stateLabel(d.state);
          const range = formatShortTimeRange(d.startMinuteKey, d.endMinuteKey);

          return (
            <div key={i} className="group relative">
              <span
                className={[
                  "block h-[7px] w-[7px] rounded-full",
                  "md:h-[8px] md:w-[8px]",
                  cls
                ].join(" ")}
              />

              <div
                className={[
                  "pointer-events-none absolute z-50",
                  "-top-2 left-1/2 -translate-x-1/2 -translate-y-full",
                  "whitespace-nowrap rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-lg",
                  "opacity-0 scale-95 transition duration-150",
                  "group-hover:opacity-100 group-hover:scale-100",
                  "dark:border-zinc-800 dark:bg-zinc-950"
                ].join(" ")}
              >
                <div className="text-xs font-semibold">{range}</div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  <span className="font-medium">{label}</span>
                  <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="mono">{d.upPct.toFixed(1)}%</span>
                  <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="mono">{d.upMinutes}m up</span>
                  <span className="mx-1">/</span>
                  <span className="mono">{d.downMinutes}m down</span>
                </div>

                <div
                  className={[
                    "absolute left-1/2 top-full -translate-x-1/2",
                    "h-2 w-2 rotate-45",
                    "border-b border-r border-zinc-200 bg-white",
                    "dark:border-zinc-800 dark:bg-zinc-950"
                  ].join(" ")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}