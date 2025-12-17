export const API_HISTORY = "https://api.chickenjockey.lol/history";
export const API_LATEST = "https://api.chickenjockey.lol/latest";

export function minuteKeyFromSeconds(tsSeconds) {
  return Math.floor(tsSeconds / 60);
}

export function buildMinuteStatusMap(historyArray, targetId) {
  const map = new Map();
  for (const row of historyArray || []) {
    if (!row || row.target_id !== targetId) continue;
    const mk = minuteKeyFromSeconds(row.timestamp);
    const up = String(row.status).toUpperCase() === "UP";
    map.set(mk, up);
  }
  return map;
}

/**
 * 7 days -> 10080 minutes -> 168 hourly dots.
 * Missing minutes are treated as offline.
 * Each dot includes upMinutes/downMinutes so we can show precise tooltip + partial meaning.
 */
export function build7DayHourlyDots(historyArray, targetId, nowMs = Date.now()) {
  const totalMinutes = 7 * 24 * 60;      // 10080
  const intervalMinutes = 60;            // 1 hour
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
      else downMinutes++; // down OR missing => offline
    }

    let state = "down";
    const upPct = (upMinutes / intervalMinutes) * 100;

    if (upPct >= 97) state = "up";
    else if (upPct >= 85) state = "mostly";
    else if (upPct >= 50) state = "partial";
    else state = "down";

    dots.push({
      state,
      startMinuteKey: m,
      endMinuteKey: m + intervalMinutes - 1,
      upMinutes,
      downMinutes,
      upPct
    });
  }

  return dots; // length 168
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

export function normalizeLatest(latestObj, targetId) {
  const raw = latestObj?.[targetId];
  if (!raw) return null;

  const up = String(raw.status).toUpperCase() === "UP";

  return {
    targetId,
    up,
    latencyMs: raw.latency_ms ?? null,
    playersOnline: raw.players_online ?? null,
    playersMax: raw.players_max ?? null,
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
    // missing => offline
    if (v === true) up++;
    total++;
  }

  if (total === 0) return 0;
  return (up / total) * 100;
}

export function formatPercent(p) {
  if (!Number.isFinite(p)) return "—";
  if (p >= 99.995) return "100.00%";
  if (p >= 99.95) return p.toFixed(2) + "%";
  if (p >= 10) return p.toFixed(2) + "%";
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
