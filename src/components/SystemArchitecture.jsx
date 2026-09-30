import React, { useState } from 'react'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, Info, Sparkles } from 'lucide-react'
import { WORKFLOW_NODES } from './workflowNodesData'
import { WorkflowNodeModal } from './WorkflowNodeModal'

export function SystemArchitecture() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNodeId, setHoveredNodeId] = useState(null)

  return (
    <div className="w-full h-full flex flex-col justify-between bg-surface/90 border border-border/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* --- TOP HEADER TOOLBAR --- */}
      <div className="flex items-center justify-between px-4 py-3 bg-marine/95 border-b border-border/80 z-10 shrink-0 flex-wrap gap-2">
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
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/50">
            <Sparkles size={12} className="animate-spin text-cyan-300" style={{ animationDuration: '6s' }} />
            Click any node to inspect
          </span>
          <button
            onClick={() => {
              setLightboxZoom(1)
              setIsLightboxOpen(true)
            }}
            className="px-3 py-1.5 text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Expand to Fullscreen Lightbox"
          >
            <Maximize2 size={13} />
            <span>Enlarge Diagram</span>
          </button>
        </div>
      </div>

      {/* --- INTERACTIVE HINT BANNER --- */}
      <div className="bg-[#081321] px-4 py-1.5 border-b border-border/50 flex items-center justify-between text-[11px] font-mono text-text-muted">
        <div className="flex items-center gap-1.5 text-slate-300 truncate">
          <Info size={13} className="text-primary shrink-0" />
          <span className="truncate">
            Interactive Workflow: Click any tool (Raspberry Pi, ESP32, Motors, Sensors, Bins) to view specs & actions.
          </span>
        </div>
        <span className="hidden lg:inline-block text-primary/80 font-bold shrink-0 ml-2">
          16 Active Nodes
        </span>
      </div>

      {/* --- DIAGRAM DISPLAY CONTAINER --- */}
      <div 
        onClick={() => {
          setLightboxZoom(1)
          setIsLightboxOpen(true)
        }}
        className="flex-1 w-full relative flex items-center justify-center p-3 sm:p-4 cursor-zoom-in overflow-hidden bg-[#0A111C]"
      >
        {/* Crisp Engineering Display Plate with exact aspect-fit wrapper */}
        <div 
          className="relative max-h-full max-w-full flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-slate-200/40"
        >
          {/* Inner relative box matching the image dimensions strictly */}
          <div className="relative inline-block leading-none select-none">
            <img
              src="/assets/system_architecture.png"
              alt="Fig. 2a: System architecture of the proposed autonomous water surface cleaning robot"
              className="w-auto h-auto max-h-[460px] sm:max-h-[500px] lg:max-h-[540px] max-w-full object-contain block pointer-events-none"
              loading="eager"
            />

            {/* --- INTERACTIVE HOTSPOT OVERLAY LAYER --- */}
            <div className="absolute inset-0 pointer-events-none">
              {WORKFLOW_NODES.map((node) => {
                const isHovered = hoveredNodeId === node.id
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNode(node)
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{
                      left: `${node.coords.cx}%`,
                      top: `${node.coords.cy}%`,
                      width: `${node.coords.r * 2}%`,
                      // Height normalized to image aspect ratio (798 / 970) so button is circular
                      height: `${node.coords.r * 2 * (798 / 970)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute rounded-full pointer-events-auto transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                      isHovered
                        ? 'border-2 border-primary bg-primary/25 shadow-[0_0_20px_rgba(45,212,191,0.85)] scale-105 z-30'
                        : 'border border-primary/20 hover:border-primary/80 bg-transparent hover:bg-primary/15'
                    }`}
                    title={`Click to inspect ${node.name}`}
                    aria-label={`Inspect ${node.name}`}
                  >
                    {/* Pulsing Target Dot on Hover */}
                    {isHovered && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/40 pointer-events-none" />
                    )}

                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div 
                        className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950/95 text-white text-[10px] font-mono rounded shadow-2xl border border-primary whitespace-nowrap pointer-events-none z-40 flex items-center gap-1.5 ${
                          node.coords.cy > 75 ? '-top-8' : '-bottom-8'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-bold">{node.name}</span>
                        <span className="text-primary text-[9px]">(Click)</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- QUICK COMPONENT PILLS BAR --- */}
      <div className="px-3 py-2 bg-[#08101A] border-t border-border/70 overflow-x-auto custom-scrollbar flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider shrink-0 font-bold mr-1">
          Quick Inspect:
        </span>
        {WORKFLOW_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface/80 hover:bg-primary/20 hover:text-primary text-text-muted border border-border/60 hover:border-primary/40 whitespace-nowrap transition-all shrink-0 cursor-pointer"
          >
            {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
          </button>
        ))}
      </div>

      {/* --- ACADEMIC CAPTION BANNER --- */}
      <div className="px-4 py-2 bg-[#070D14] border-t border-border/60 text-center shrink-0">
        <p className="text-xs font-serif italic text-text-muted">
          <strong className="text-white font-sans not-italic font-bold mr-1.5">Fig. 2a:</strong>
          System architecture of the proposed autonomous water surface cleaning robot.
        </p>
      </div>

      {/* --- COMPONENT DETAIL POP-UP MODAL --- */}
      {selectedNode && (
        <WorkflowNodeModal
          node={selectedNode}
          allNodes={WORKFLOW_NODES}
          onClose={() => setSelectedNode(null)}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      )}

      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between pb-3 border-b border-border/80 text-white z-10 flex-wrap gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Fig. 2a: System Architecture Diagram (High-Resolution)
              </h3>
              <p className="text-xs text-text-muted font-mono">
                Official research schematic · Click any component node to open technical specifications
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.25))}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setLightboxZoom((z) => Math.max(0.75, z - 0.25))}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setLightboxZoom(1)}
                className="p-2 bg-surface hover:bg-border rounded text-text-muted hover:text-white border border-border cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded font-mono text-xs flex items-center gap-1.5 ml-2 cursor-pointer"
              >
                <Minimize2 size={14} /> Close
              </button>
            </div>
          </div>

          {/* Lightbox Image Body with interactive hotspots preserved */}
          <div 
            className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="p-4 bg-white rounded-2xl shadow-2xl transition-transform duration-200 relative inline-block select-none"
              style={{ transform: `scale(${lightboxZoom})` }}
            >
              <div className="relative inline-block leading-none">
                <img
                  src="/assets/system_architecture.png"
                  alt="Fig. 2a: System architecture of the proposed autonomous water surface cleaning robot (High-Resolution)"
                  className="max-h-[75vh] w-auto object-contain select-none pointer-events-none block"
                />

                {/* Hotspots in lightbox mode */}
                <div className="absolute inset-0 pointer-events-none">
                  {WORKFLOW_NODES.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNode(node)
                      }}
                      style={{
                        left: `${node.coords.cx}%`,
                        top: `${node.coords.cy}%`,
                        width: `${node.coords.r * 2}%`,
                        height: `${node.coords.r * 2 * (798 / 970)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute rounded-full pointer-events-auto border border-primary/30 hover:border-primary bg-primary/10 hover:bg-primary/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(45,212,191,0.4)]"
                      title={`Click to inspect ${node.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lightbox Footer */}
          <div 
            className="w-full max-w-5xl text-center text-xs font-mono text-text-muted/80 pt-2 border-t border-border/60"
            onClick={(e) => e.stopPropagation()}
          >
            Autonomous Surface Cleaning Platform · Fig. 2a Signal & Power Flow Hierarchy · Click any node for specs
          </div>
        </div>
      )}
    </div>
  )
}

