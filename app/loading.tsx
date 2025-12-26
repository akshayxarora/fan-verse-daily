'use client';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Top progress bar simulation */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[110] overflow-hidden">
        <div className="h-full bg-primary animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          {/* Pulsing glow background */}
          <div className="absolute inset-[-10px] rounded-full bg-primary/5 animate-pulse blur-xl"></div>
          
          {/* Main outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
          
          {/* Spinning core */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-[0_0_20px_rgba(45,212,191,0.3)]"></div>
          
          {/* Inner static icon or dot */}
          <div className="absolute inset-[35%] rounded-full bg-primary animate-pulse"></div>
        </div>
        
        <div className="space-y-2 text-center">
          <p className="font-mono text-sm tracking-[0.3em] text-primary uppercase animate-pulse">
            Establishing Connection
          </p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
            Fetching Data Fragments
          </p>
        </div>
      </div>
    </div>
  );
}

