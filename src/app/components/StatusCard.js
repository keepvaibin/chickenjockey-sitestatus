"use client";

import useSWR from "swr";
import { useMemo } from "react";
import HistoryStrip from "./HistoryStrip";
import {
  API_HISTORY,
  API_LATEST,
  build7DayHourlyDots,
  computeUptimePercent,
  formatPercent,
  formatRelativeTimeFromSeconds,
  normalizeLatest
} from "@/lib/statusMath";

const fetcher = (url) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
    return r.json();
  });

function pillClass(up) {
  return up
    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-800"
    : "bg-zinc-50 text-zinc-800 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-200 dark:ring-zinc-800";
}

export default function StatusCard({ targetId, title, subtitle }) {
  const history = useSWR(API_HISTORY, fetcher, {
    refreshInterval: 5 * 60 * 1000,
    dedupingInterval: 30 * 1000
  });

  const latest = useSWR(API_LATEST, fetcher, {
    refreshInterval: 60 * 1000,
    dedupingInterval: 10 * 1000
  });

  // UPDATED: Pass history.data as the 3rd argument
  const latestNorm = normalizeLatest(latest.data, targetId, history.data);
  const isUp = latestNorm?.up === true;

  const dots = useMemo(() => {
    if (!history.data) return null;
    return build7DayHourlyDots(history.data, targetId);
  }, [history.data, targetId]);

  const uptime24h = useMemo(() => {
    if (!history.data) return null;
    return computeUptimePercent(history.data, targetId, 24 * 60);
  }, [history.data, targetId]);

  const uptime7d = useMemo(() => {
    if (!history.data) return null;
    return computeUptimePercent(history.data, targetId, 7 * 24 * 60);
  }, [history.data, targetId]);

  const updatedRel = latestNorm?.timestamp
    ? formatRelativeTimeFromSeconds(latestNorm.timestamp)
    : "—";

  const updatedExact = latestNorm?.timestamp
    ? new Date(latestNorm.timestamp * 1000).toLocaleString()
    : "—";

  return (
    <div
      className={[
        "animate-fade-up",
        "rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100",
        "p-5"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <span
          className={[
            "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
            pillClass(isUp)
          ].join(" ")}
        >
          <span className={["h-2 w-2 rounded-full", isUp ? "bg-emerald-500" : "bg-zinc-500"].join(" ")} />
          {latestNorm ? (isUp ? "Online" : "Offline") : "Loading…"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
        <Pill label="Uptime 24h">{uptime24h == null ? "—" : formatPercent(uptime24h)}</Pill>
        <Pill label="Uptime 7d">{uptime7d == null ? "—" : formatPercent(uptime7d)}</Pill>

        <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

        <span className="inline-flex items-center gap-2" title={updatedExact}>
          <span className="text-zinc-500 dark:text-zinc-400">Updated:</span>
          <span className="mono">{updatedRel}</span>
        </span>
      </div>

      <div className="mt-4">
        {targetId === "mc" ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <Metric label="Latency">
              {latestNorm?.latencyMs != null ? (
                <span className="mono">{latestNorm.latencyMs}ms</span>
              ) : (
                <span className="text-zinc-400">—</span>
              )}
            </Metric>
            <Metric label="Players">
              {latestNorm?.playersOnline != null && latestNorm?.playersMax != null ? (
                <span className="mono">
                  {latestNorm.playersOnline}/{latestNorm.playersMax}
                </span>
              ) : (
                <span className="text-zinc-400">—</span>
              )}
            </Metric>
          </div>
        ) : (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {latestNorm?.latencyMs != null ? (
              <>Latency: <span className="mono">{latestNorm.latencyMs}ms</span></>
            ) : (
              <>Latency: <span className="text-zinc-400">—</span></>
            )}
          </div>
        )}

        {(history.error || latest.error) && (
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
            Trouble reaching the API. Showing what we can.
          </div>
        )}

        <HistoryStrip dots={dots} />
      </div>
    </div>
  );
}

function Metric({ label, children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-zinc-500 dark:text-zinc-400">{label}:</span>
      <span>{children}</span>
    </span>
  );
}

function Pill({ label, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="mono">{children}</span>
    </span>
  );
}