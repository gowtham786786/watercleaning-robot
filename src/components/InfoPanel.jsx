import React from 'react'
import { useStore } from '../store/useStore'
import { X, Info, Pause, Play } from 'lucide-react'

export function InfoPanel() {
  const { 
    activeComponent, 
    setActiveComponent, 
    explodedView, 
    toggleExplodedView, 
    transparentChassis, 
    toggleTransparentChassis,
    isPaused,
    togglePause,
    nightMode,
    toggleNightMode,
    audioMuted,
    toggleAudio,
    showHudLabels,
    toggleHudLabels
  } = useStore()

  return (
    <div className="flex flex-col gap-4 w-full pointer-events-auto select-none">
      
      {/* Controls */}
      <div className="bg-card/90 backdrop-blur border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Viewer Controls
          </h4>
          {isPaused && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 font-bold tracking-wider uppercase animate-pulse">
              <Pause size={10} /> Motion Frozen
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Pause Option (Freeze robot and floating objects in place) */}
          <label className="flex items-center justify-between cursor-pointer group py-0.5">
            <span className="text-sm group-hover:text-primary transition-colors flex items-center gap-2">
              {isPaused ? <Pause size={15} className="text-amber-400" /> : <Play size={15} className="text-primary" />}
              <span className={isPaused ? "text-amber-400 font-semibold" : ""}>Pause Robot</span>
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isPaused} 
                onChange={togglePause} 
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isPaused ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPaused ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          {/* 1. Exploded View */}
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Exploded View</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={explodedView} onChange={toggleExplodedView} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${explodedView ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${explodedView ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          {/* 2. Transparent Chassis */}
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Transparent Chassis</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={transparentChassis} onChange={toggleTransparentChassis} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${transparentChassis ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${transparentChassis ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          {/* 3. Night Mode */}
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Night Mode</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={nightMode} onChange={toggleNightMode} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${nightMode ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${nightMode ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          {/* 4. Sound / Ambient */}
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Sound / Ambient</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={!audioMuted} onChange={toggleAudio} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${!audioMuted ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!audioMuted ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          {/* 5. HUD Labels */}
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">HUD Labels</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={showHudLabels} onChange={toggleHudLabels} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${showHudLabels ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHudLabels ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {/* Component Details */}
      {activeComponent && (
        <div className="bg-primary/10 backdrop-blur border border-primary/30 p-5 rounded-xl shadow-lg relative animate-in fade-in slide-in-from-right-8 duration-300">
          <button 
            onClick={() => setActiveComponent(null)}
            className="absolute top-3 right-3 text-text-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Info size={18} />
            <h3 className="font-bold">{activeComponent.name}</h3>
          </div>
          <p className="text-sm text-text-main/80 leading-relaxed">
            {activeComponent.description}
          </p>
        </div>
      )}
    </div>
  )
}
