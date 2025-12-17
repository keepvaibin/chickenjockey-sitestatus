import DarkModeToggle from "./components/DarkModeToggle";
import StatusCard from "./components/StatusCard";
import PartialHelp from "./components/PartialHelp";
import McBanner from "./components/McBanner";

// This is the new Legend component using your exact colors
function StatusLegend() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
        <span>Online (≥ 97%)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span>Mostly online (85–97%)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/45 dark:bg-emerald-400/25" />
        <span>Partial (50–85%)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        <span>Down (&lt; 50%)</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-grid overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            ChickenJockey Status
          </h1>

          <p className="mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
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

        <section className="mt-5 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-3 md:justify-items-stretch">
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

        <footer className="mt-0 flex flex-col items-center gap-4 text-center">
            {/* The Legend is now placed here */}
            <StatusLegend />
            
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
                The site status updates every minute.{" "}
            </div>
        </footer>
      </div>
    </main>
  );
}