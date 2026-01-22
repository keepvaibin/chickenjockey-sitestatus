// src/app/components/McBanner.js
"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { API_LATEST, normalizeLatest, formatRelativeTimeFromSeconds } from "@/lib/statusMath";

const fetcher = (url) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
    return r.json();
  });

export default function McBanner() {
  // tick every 5s so the “updated … ago” stays accurate
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const latest = useSWR(API_LATEST, fetcher, {
    refreshInterval: 60 * 1000,
    dedupingInterval: 10 * 1000,
    revalidateOnFocus: true
  });

  const mc = normalizeLatest(latest.data, "mc");
  const up = mc?.up === true;

  const bg = up ? "bg-emerald-600 text-white" : "bg-red-600 text-white";
  const msg = up ? "The server is currently up!" : "The server is currently down!";

  const updated = mc?.timestamp ? formatRelativeTimeFromSeconds(mc.timestamp, nowMs) : "—";

  return (
    <div className={`w-full rounded-2xl ${bg} px-4 py-3 shadow-sm`}>
      <div className="flex flex-col items-center justify-center gap-1 text-center md:flex-row md:gap-3">
        <span className="text-sm font-semibold">{msg}</span>
        <span className="text-xs opacity-90">
          (updated <span className="mono">{updated}</span>)
        </span>
      </div>
    </div>
  );
}
