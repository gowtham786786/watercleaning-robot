import React from 'react'
import { useStore } from '../store/useStore'
import { X, Info } from 'lucide-react'

export function InfoPanel() {
  const { activeComponent, setActiveComponent, explodedView, toggleExplodedView, transparentChassis, toggleTransparentChassis } = useStore()

  return (
    <div className="flex flex-col gap-4 w-full pointer-events-auto">
      
      {/* Controls */}
      <div className="bg-card/90 backdrop-blur border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <h4 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Viewer Controls</h4>
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Exploded View</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={explodedView} onChange={toggleExplodedView} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${explodedView ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${explodedView ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Transparent Chassis</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={transparentChassis} onChange={toggleTransparentChassis} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${transparentChassis ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${transparentChassis ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Night Mode</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={useStore((s) => s.nightMode)} onChange={useStore((s) => s.toggleNightMode)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${useStore((s) => s.nightMode) ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useStore((s) => s.nightMode) ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">Sound / Ambient</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={!useStore((s) => s.audioMuted)} onChange={useStore((s) => s.toggleAudio)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${!useStore((s) => s.audioMuted) ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!useStore((s) => s.audioMuted) ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm group-hover:text-primary transition-colors">HUD Labels</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={useStore((s) => s.showHudLabels)} onChange={useStore((s) => s.toggleHudLabels)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${useStore((s) => s.showHudLabels) ? 'bg-primary' : 'bg-slate-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useStore((s) => s.showHudLabels) ? 'transform translate-x-4' : ''}`}></div>
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
