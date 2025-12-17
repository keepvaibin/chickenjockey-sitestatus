"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const shouldBeDark = stored ? stored === "dark" : true; // default DARK
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
      aria-label="Toggle theme"
    >
      <span className="mono">{isDark ? "DARK" : "LIGHT"}</span>
      <span
        className={[
          "relative inline-flex h-5 w-9 items-center rounded-full transition",
          isDark ? "bg-emerald-500/60" : "bg-zinc-300"
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 rounded-full bg-white shadow transition",
            isDark ? "translate-x-4" : "translate-x-1"
          ].join(" ")}
        />
      </span>
    </button>
  );
}
