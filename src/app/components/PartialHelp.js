"use client";

import { useEffect, useRef, useState } from "react";

export default function PartialHelp() {
  const [open, setOpen] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const ref = useRef(null);

  // Detect real hover capability after mount
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(!!mq.matches);

    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Close on outside tap/click (only needed for non-hover devices)
  useEffect(() => {
    if (hoverCapable) return;

    function onPointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [hoverCapable]);

  function handleClick() {
    // Desktop: hover-only, don't require clicking
    if (hoverCapable) return;
    // Mobile: tap toggles
    setOpen((v) => !v);
  }

  // Mobile uses `open`, desktop uses hover.
  const mobileVisible = !hoverCapable && open;

  return (
    <div ref={ref} className="group relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        What does partial mean?
      </button>

      <div
        role="dialog"
        className={[
          "absolute left-1/2 top-full z-50 mt-2 w-[min(92vw,280px)] -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0",
          "rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-700 shadow-lg",
          "duration-150 ease-out",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200",

          // Desktop hover behavior (opacity/pointer-events only, no display toggles)
          "md:opacity-0 md:translate-y-1 md:pointer-events-none",
          "md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto",

          // Mobile click behavior (same properties)
          mobileVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-1 pointer-events-none md:opacity-0"
        ].join(" ")}
      >
        <p className="leading-snug text-zinc-600 dark:text-zinc-300">
            Each dot represents <span className="font-medium">1 hour</span>, and missing data counts as down.
            The dot color is based on <span className="font-medium">uptime within that hour</span>:
            <br /><br />
            <span className="font-medium">Online</span>: ≥ 97% up<br />
            <span className="font-medium">Mostly online</span>: 85–97% up<br />
            <span className="font-medium">Partial</span>: 50–85% up<br />
            <span className="font-medium">Down</span>: &lt; 50% up
        </p>

        <div
          className={[
            "absolute -top-1 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 h-2 w-2 rotate-45",
            "border-l border-t border-zinc-200 bg-white",
            "dark:border-zinc-800 dark:bg-zinc-950"
          ].join(" ")}
        />
      </div>
    </div>
  );
}
