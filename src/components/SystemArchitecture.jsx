import React, { useState } from 'react'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, Cpu, Zap, Radio, Target, Layers } from 'lucide-react'

const SUBSYSTEM_HIGHLIGHTS = [
  {
    id: 'compute',
    label: 'Hybrid Compute',
    icon: Cpu,
    stat: '8.2 ms Latency',
    desc: 'Raspberry Pi 4 (Vision) & ESP32 (Sensors) via UART @ 115200 baud'
  },
  {
    id: 'power',
    label: 'Dual Power Rail',
    icon: Zap,
    stat: '~38.4 W Steady',
    desc: 'Power Bank (Pi4 5V/3A) + 3S Li-ion (ESP32 & 12V Drive Motors)'
  },
  {
    id: 'propulsion',
    label: 'Dual L298N Drives',
    icon: Layers,
    stat: '1.23 kg/hr',
    desc: 'L298N #1 (Dual Belts) & L298N #2 (Differential Wheel Propulsion)'
  },
  {
    id: 'perception',
    label: 'Sensors & Sonar',
    icon: Radio,
    stat: '95.6% Avoidance',
    desc: '4× HC-SR04 Ultrasonic + OV5647 Camera + KY-036 Inductive Detector'
  },
  {
    id: 'sorting',
    label: 'Segregation Gate',
    icon: Target,
    stat: '94.5% Accuracy',
    desc: 'MG996R Servo diverts debris into Metal (0.89L) & Non-Metal (7.8L) bins'
  }
]

export function SystemArchitecture() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalZoom, setModalZoom] = useState(1)
  const [activeTab, setActiveTab] = useState('compute')

  const currentSubsystem = SUBSYSTEM_HIGHLIGHTS.find((s) => s.id === activeTab) || SUBSYSTEM_HIGHLIGHTS[0]

  return (
    <div className="w-full h-full flex flex-col justify-between bg-surface/90 border border-border/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* --- TOP HEADER TOOLBAR --- */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-marine/95 border-b border-border/80 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            System Architecture
          </span>
          <span className="hidden sm:inline-block text-border">|</span>
          <span className="hidden sm:inline-block text-xs font-mono text-text-muted">
            Signal & Power Flow Schematic
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalZoom(1)
              setIsModalOpen(true)
            }}
            className="px-2.5 py-1 text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded flex items-center gap-1.5 transition-all"
            title="Expand to Fullscreen Lightbox"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Enlarge Diagram</span>
          </button>
        </div>
      </div>

      {/* --- DIAGRAM DISPLAY CONTAINER (100% visible, no cutoffs, no 3D distortion) --- */}
      <div 
        onClick={() => {
          setModalZoom(1)
          setIsModalOpen(true)
        }}
        className="flex-1 w-full relative flex items-center justify-center p-3 cursor-zoom-in group overflow-hidden bg-[#0A111C]"
      >
        {/* Crisp Engineering Display Plate */}
        <div className="relative max-h-full max-w-full flex items-center justify-center p-2 rounded-xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-slate-200/40 transition-transform duration-300 group-hover:scale-[1.01]">
          <img
            src="/assets/system_architecture.png"
            alt="Fig. 2a: System architecture of the proposed autonomous water surface cleaning robot"
            className="w-auto h-auto max-h-[460px] lg:max-h-[500px] max-w-full object-contain block select-none pointer-events-none"
            loading="eager"
          />

          {/* Hover Zoom Badge Overlay */}
          <div className="absolute inset-0 bg-marine/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
            <span className="bg-marine/90 text-primary font-mono text-xs px-3 py-1.5 rounded-full border border-primary/40 shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <Maximize2 size={13} /> Click to Enlarge Diagram
            </span>
          </div>
        </div>
      </div>

      {/* --- ACADEMIC CAPTION BANNER --- */}
      <div className="px-4 py-1.5 bg-[#070D14] border-t border-border/60 text-center shrink-0">
        <p className="text-[11.5px] font-serif italic text-text-muted">
          <strong className="text-white font-sans not-italic font-bold mr-1.5">Fig. 2a:</strong>
          System architecture of the proposed autonomous water surface cleaning robot.
        </p>
      </div>

      {/* --- FIXED-HEIGHT SUBSYSTEM HIGHLIGHT BAR (Zero layout shift, no jitter) --- */}
      <div className="bg-marine/95 border-t border-border/80 px-4 py-2.5 shrink-0 h-[88px] flex flex-col justify-between">
        {/* Subsystem Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SUBSYSTEM_HIGHLIGHTS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-marine font-bold shadow-[0_0_10px_rgba(45,212,191,0.3)]'
                    : 'text-text-muted hover:text-white bg-surface/50 border border-border/40'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Subsystem Detail (Fixed 1-line display to prevent ANY height change) */}
        <div className="flex items-center justify-between gap-4 text-xs font-mono pt-1 border-t border-border/40">
          <span className="text-text-muted truncate flex-1">
            <span className="text-white font-semibold mr-1.5">{currentSubsystem.label}:</span>
            {currentSubsystem.desc}
          </span>
          <span className="text-primary font-bold text-[11px] bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shrink-0">
            {currentSubsystem.stat}
          </span>
        </div>
      </div>

      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Header Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between pb-3 border-b border-border/80 text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Fig. 2a: System Architecture Diagram
              </h3>
              <p className="text-xs text-text-muted font-mono">
                Published in official research document · WR-S-26-12342
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalZoom((z) => Math.min(2.5, z + 0.25))}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setModalZoom((z) => Math.max(0.75, z - 0.25))}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setModalZoom(1)}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded font-mono text-xs flex items-center gap-1.5 ml-2"
              >
                <Minimize2 size={14} /> Close
              </button>
            </div>
          </div>

          {/* Modal Image Body with smooth Zoom */}
          <div 
            className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="p-4 bg-white rounded-2xl shadow-2xl transition-transform duration-200"
              style={{ transform: `scale(${modalZoom})` }}
            >
              <img
                src="/assets/system_architecture.png"
                alt="Fig. 2a: System architecture of the proposed autonomous water surface cleaning robot (High-Resolution)"
                className="max-h-[75vh] w-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div 
            className="w-full max-w-5xl text-center text-xs font-mono text-text-muted/80 pt-2 border-t border-border/60"
            onClick={(e) => e.stopPropagation()}
          >
            Autonomous Surface Cleaning Platform · Fig. 2a Signal & Power Flow Hierarchy
          </div>
        </div>
      )}
    </div>
  )
}
