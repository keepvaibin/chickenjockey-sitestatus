// src/lib/statusMath.js
export const API_HISTORY = "https://api.ucscmc.com/history";
export const API_LATEST = "https://api.ucscmc.com/latest";

export function minuteKeyFromSeconds(tsSeconds) {
  return Math.floor(tsSeconds / 60);
}

export function buildMinuteStatusMap(historyArray, targetId) {
  const map = new Map();

  // historyArray is DESC (newest first). Keep the newest sample per minute.
  for (const row of historyArray || []) {
    if (!row || row.target_id !== targetId) continue;

    const mk = minuteKeyFromSeconds(row.timestamp);

    // Because we're reading newest->oldest, the first value we see for a minute is the newest.
    // So if it's already present, skip (don't let older samples overwrite newer ones).
    if (map.has(mk)) continue;

    const s = String(row.status || "").toUpperCase();

    // Match UI promise: missing/invalid treated as offline.
    // UP => true, everything else => false
    map.set(mk, s === "UP");
  }

  return map;
}


export function build7DayHourlyDots(historyArray, targetId, nowMs = Date.now()) {
  const totalMinutes = 7 * 24 * 60;
  const intervalMinutes = 60;
  const nowSeconds = nowMs / 1000;

  const endMinute = minuteKeyFromSeconds(nowSeconds);
  const startMinute = endMinute - totalMinutes + 1;

  const statusByMinute = buildMinuteStatusMap(historyArray, targetId);

  const dots = [];
  for (let m = startMinute; m <= endMinute; m += intervalMinutes) {
    let upMinutes = 0;
    let downMinutes = 0;

    for (let mm = m; mm < m + intervalMinutes; mm++) {
      const v = statusByMinute.get(mm);
      if (v === true) upMinutes++;
      else downMinutes++;
    }

    const upPct = (upMinutes / intervalMinutes) * 100;

    let state = "down";
    if (upPct >= 97) state = "up";
    else if (upPct >= 85) state = "mostly";
    else if (upPct >= 50) state = "partial";

    dots.push({
      state,
      startMinuteKey: m,
      endMinuteKey: m + intervalMinutes - 1,
      upMinutes,
      downMinutes,
      upPct
    });
  }

  return dots;
}

export function formatShortTimeRange(startMinuteKey, endMinuteKey) {
  const start = new Date(startMinuteKey * 60 * 1000);
  const end = new Date((endMinuteKey + 1) * 60 * 1000);

  const optsDate = { month: "short", day: "numeric" };
  const optsTime = { hour: "numeric", minute: "2-digit" };

  const d1 = start.toLocaleDateString(undefined, optsDate);
  const t1 = start.toLocaleTimeString(undefined, optsTime);
  const d2 = end.toLocaleDateString(undefined, optsDate);
  const t2 = end.toLocaleTimeString(undefined, optsTime);

  if (d1 === d2) return `${d1} ${t1}–${t2}`;
  return `${d1} ${t1} → ${d2} ${t2}`;
}

// If latest is INVALID, fall back to last known non-INVALID in history
export function normalizeLatest(latestObj, targetId, historyArray = []) {
  const raw = latestObj?.[targetId];
  if (!raw) return null;

  const s = String(raw.status).toUpperCase();

  // 1) If status is valid (UP/DOWN/ERR-*), return it
  if (s !== "INVALID") {
    return {
      targetId,
      up: s === "UP",
      latencyMs: raw.latency_ms ?? null,
      playersOnline: raw.players_online ?? null,
      playersMax: raw.players_max ?? null,
      timestamp: raw.timestamp ?? null
    };
  }

  // 2) INVALID -> search history for the last known non-INVALID row
  let fallbackRow = null;
  if (historyArray && Array.isArray(historyArray)) {
    fallbackRow = historyArray.find(
      (r) => r.target_id === targetId && String(r.status).toUpperCase() !== "INVALID"
    );
  }

  if (fallbackRow) {
    const fallbackStatus = String(fallbackRow.status).toUpperCase();
    return {
      targetId,
      up: fallbackStatus === "UP",
      latencyMs: fallbackRow.latency_ms ?? null,
      playersOnline: fallbackRow.players_online ?? null,
      playersMax: fallbackRow.players_max ?? null,
      // keep the OLD timestamp to be honest
      timestamp: fallbackRow.timestamp ?? null
    };
  }

  // 3) No usable history -> offline
  return {
    targetId,
    up: false,
    latencyMs: null,
    playersOnline: null,
    playersMax: null,
    timestamp: raw.timestamp ?? null
  };
}

export function computeUptimePercent(historyArray, targetId, minutesWindow, nowMs = Date.now()) {
  const nowSeconds = nowMs / 1000;
  const endMinute = minuteKeyFromSeconds(nowSeconds);
  const startMinute = endMinute - minutesWindow + 1;

  const statusByMinute = buildMinuteStatusMap(historyArray, targetId);

  let up = 0;
  let total = 0;

  for (let m = startMinute; m <= endMinute; m++) {
    const v = statusByMinute.get(m);
    if (v === true) up++;
    total++;
  }

  if (total === 0) return 0;
  return (up / total) * 100;
}

export function formatPercent(p) {
  if (!Number.isFinite(p)) return "—";
  if (p >= 99.995) return "100.00%";
  return p.toFixed(2) + "%";
}

export function formatRelativeTimeFromSeconds(tsSeconds, nowMs = Date.now()) {
  if (!tsSeconds) return "—";
  const thenMs = tsSeconds * 1000;
  const diff = Math.max(0, nowMs - thenMs);

  const sec = Math.floor(diff / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
