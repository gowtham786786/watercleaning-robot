import React, { useState } from 'react'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, ShieldCheck } from 'lucide-react'

export function SystemArchitecture() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalZoom, setModalZoom] = useState(1)

  return (
    <div className="w-full h-full flex flex-col justify-between bg-surface/90 border border-border/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* --- TOP HEADER TOOLBAR --- */}
      <div className="flex items-center justify-between px-4 py-3 bg-marine/95 border-b border-border/80 z-10 shrink-0">
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
            className="px-3 py-1.5 text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded flex items-center gap-1.5 transition-all shadow-sm"
            title="Expand to Fullscreen Lightbox"
          >
            <Maximize2 size={13} />
            <span>Enlarge Diagram</span>
          </button>
        </div>
      </div>

      {/* --- DIAGRAM DISPLAY CONTAINER --- */}
      <div 
        onClick={() => {
          setModalZoom(1)
          setIsModalOpen(true)
        }}
        className="flex-1 w-full relative flex items-center justify-center p-4 cursor-zoom-in group overflow-hidden bg-[#0A111C]"
      >
        {/* Crisp Engineering Display Plate */}
        <div className="relative max-h-full max-w-full flex items-center justify-center p-3 rounded-xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-slate-200/40 transition-transform duration-300 group-hover:scale-[1.01]">
          <img
            src="/assets/system_architecture.png"
            alt="Fig. 2a: System architecture of the proposed autonomous water surface cleaning robot"
            className="w-auto h-auto max-h-[520px] lg:max-h-[560px] max-w-full object-contain block select-none pointer-events-none"
            loading="eager"
          />

          {/* Hover Zoom Badge Overlay */}
          <div className="absolute inset-0 bg-marine/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
            <span className="bg-marine/90 text-primary font-mono text-xs px-3.5 py-2 rounded-full border border-primary/40 shadow-xl flex items-center gap-1.5 backdrop-blur-sm">
              <Maximize2 size={13} /> Click to Enlarge Fullscreen
            </span>
          </div>
        </div>
      </div>

      {/* --- ACADEMIC CAPTION BANNER --- */}
      <div className="px-4 py-2 bg-[#070D14] border-t border-border/60 text-center shrink-0">
        <p className="text-xs font-serif italic text-text-muted">
          <strong className="text-white font-sans not-italic font-bold mr-1.5">Fig. 2a:</strong>
          System architecture of the proposed autonomous water surface cleaning robot.
        </p>
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
                Official research document · WR-S-26-12342
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
