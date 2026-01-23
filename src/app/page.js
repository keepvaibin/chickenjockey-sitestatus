import DarkModeToggle from "./components/DarkModeToggle";
import StatusCard from "./components/StatusCard";
import PartialHelp from "./components/PartialHelp";
import McBanner from "./components/McBanner";

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
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            UCSCMC Status
          </h1>

          <p className="mt-5 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Live status + 7-day history (missing data is treated as offline).
          </p>

          <p className="mt-1 max-w-xl text-xs text-zinc-500 dark:text-zinc-500">
            (if you are unable to see a status, assume the server is currently down)
          </p>

          <div className="mt-4 w-full max-w-3xl">
            <McBanner />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <PartialHelp />
            <DarkModeToggle />
          </div>
        </header>

        {/* LAYOUT LOGIC:
            - Mobile (default): Stacked in DOM order (Minecraft -> Map -> Website)
            - Desktop (md): Visually reordered using 'order' classes (Map -> Minecraft -> Website)
        */}
        <section className="mt-5 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-3 md:justify-items-stretch">
          
          {/* 1. Minecraft (Mobile: Top / Desktop: Middle) */}
          <div className="w-full max-w-md md:max-w-none md:order-2">
            <StatusCard 
              targetId="mc" 
              title="Minecraft Server" 
              subtitle="ucscmc.com" 
            />
          </div>

          {/* 2. Map (Mobile: Middle / Desktop: Left) */}
          <div className="w-full max-w-md md:max-w-none md:order-1">
            <StatusCard 
              targetId="map" 
              title="Map" 
              subtitle="map.ucscmc.com" 
            />
          </div>

          {/* 3. Website (Mobile: Bottom / Desktop: Right) */}
          <div className="w-full max-w-md md:max-w-none md:order-3">
            <StatusCard 
              targetId="site" 
              title="Website" 
              subtitle="site.ucscmc.com" 
            />
          </div>

        </section>

        <footer className="mt-0 flex flex-col items-center gap-4 text-center">
            <StatusLegend />
            
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
                Data updates every minute. Data might not be up-to-date immediately.
            </div>
        </footer>
      </div>
    </main>
  );
}