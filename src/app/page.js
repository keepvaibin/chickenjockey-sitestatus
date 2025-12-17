import DarkModeToggle from "./components/DarkModeToggle";
import StatusCard from "./components/StatusCard";
import PartialHelp from "./components/PartialHelp";
import McBanner from "./components/McBanner";

export default function Page() {
  return (
    <main className="min-h-screen bg-grid overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            ChickenJockey Status
          </h1>

          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Live status + 7-day history (missing data is treated as offline).
          </p>

          <div className="mt-4 w-full max-w-3xl">
            <McBanner />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <PartialHelp />
            <DarkModeToggle />
          </div>
        </header>

        <section className="mt-10 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-3 md:justify-items-stretch">
          <div className="w-full max-w-md md:max-w-none">
            <StatusCard targetId="site" title="Website" subtitle="chickenjockey.lol" />
          </div>
          <div className="w-full max-w-md md:max-w-none">
            <StatusCard targetId="map" title="Map" subtitle="map.chickenjockey.lol" />
          </div>
          <div className="w-full max-w-md md:max-w-none">
            <StatusCard targetId="mc" title="Minecraft" subtitle="mc.chickenjockey.lol" />
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-500">
          <span className="mono">/latest</span> refreshes every minute.{" "}
          <span className="mono">/history</span> refreshes every 5 minutes.
        </footer>
      </div>
    </main>
  );
}
