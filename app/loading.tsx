'use client';

// FanverseDaily Logo SVG
const FanverseLogo = () => (
  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary">
    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
  </svg>
);

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Top progress bar simulation */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[110] overflow-hidden">
        <div className="h-full bg-primary animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20 flex items-center justify-center">
          {/* Pulsing glow background */}
          <div className="absolute inset-[-10px] rounded-full bg-primary/10 animate-pulse blur-xl"></div>

          {/* Main outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>

          {/* Spinning ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

          {/* Center logo */}
          <FanverseLogo />
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xl font-black tracking-tight text-primary uppercase animate-pulse">
            FanverseDaily
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Loading the latest stories...
          </p>
        </div>
      </div>
    </div>
  );
}

