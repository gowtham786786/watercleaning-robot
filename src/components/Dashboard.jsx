import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Activity } from 'lucide-react'
import { BlueprintCallout } from './BlueprintCallout'

export function Dashboard() {
  const { isRunning, updateTelemetry, systemStatus } = useStore()

  // Run telemetry loop
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        updateTelemetry()
        if (!useStore.getState().isScrubbing) {
          const current = useStore.getState().timelineProgress;
          useStore.getState().setTimelineProgress((current + 0.5) % 100);
        }
      }, 500)
    }
    return () => clearInterval(interval)
  }, [isRunning, updateTelemetry])

  // Get store values or use static paper values
  const battery = useStore((s) => s.battery)

  return (
    <div className="glass-panel p-8 relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between mb-10 border-b border-border pb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-widest text-white">
          <Activity size={16} className="text-primary" /> System Telemetry
        </h3>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${systemStatus === 'Moving' ? 'bg-primary' : (systemStatus === 'Collecting' ? 'bg-secondary' : 'bg-white')}`}></span>
            <span className={`relative inline-flex h-2 w-2 ${systemStatus === 'Moving' ? 'bg-primary shadow-[0_0_8px_rgba(45,212,191,1)]' : (systemStatus === 'Collecting' ? 'bg-secondary shadow-[0_0_8px_rgba(245,166,35,1)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]')}`}></span>
          </span>
          <span className="text-xs text-text-muted uppercase tracking-widest font-mono">{systemStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 mb-10">
        <BlueprintCallout 
          label="Mission Endurance" 
          value="52.3 ± 8.1" 
          unit="min" 
        />
        <BlueprintCallout 
          label="Cruise Speed" 
          value="0.25" 
          unit="m/s" 
        />
        <BlueprintCallout 
          label="Control Latency" 
          value="8.2" 
          unit="ms" 
        />
        <BlueprintCallout 
          label="Collection Effic." 
          value="87.9 ± 3.2" 
          unit="%" 
        />
      </div>

      {/* Mission Replay Scrubber */}
      <div className="pt-6 border-t border-border relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">Mission Timeline</span>
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1">{Math.round(useStore((s) => s.timelineProgress))}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={useStore((s) => s.timelineProgress)}
          onMouseDown={() => useStore.getState().setIsScrubbing(true)}
          onMouseUp={() => useStore.getState().setIsScrubbing(false)}
          onTouchStart={() => useStore.getState().setIsScrubbing(true)}
          onTouchEnd={() => useStore.getState().setIsScrubbing(false)}
          onChange={(e) => useStore.getState().setTimelineProgress(Number(e.target.value))}
          className="w-full h-[2px] bg-border appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-4 uppercase tracking-widest font-mono">
          <span>Scan</span>
          <span>Approach</span>
          <span>Collect</span>
        </div>
      </div>
    </div>
  )
}

