import React, { useEffect } from 'react'
import { 
  X, ChevronLeft, ChevronRight, Cpu, Zap, Layers, RotateCw, 
  Compass, Radio, Video, Target, Trash2, BatteryCharging, 
  ShieldCheck, CheckCircle2, Wrench, Activity
} from 'lucide-react'

// Icon mapping helper
const ICONS = {
  Cpu,
  Microchip: Cpu,
  BatteryCharging,
  Zap,
  Layers,
  RotateCw,
  Compass,
  Radio,
  Video,
  Target,
  Trash2
}

export function WorkflowNodeModal({ node, allNodes, onClose, onSelectNode }) {
  const currentIndex = node ? allNodes.findIndex((n) => n.id === node.id) : 0
  const prevNode = allNodes[(currentIndex - 1 + allNodes.length) % allNodes.length]
  const nextNode = allNodes[(currentIndex + 1) % allNodes.length]

  // Keyboard navigation: Escape to close, arrows to browse
  useEffect(() => {
    if (!node) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onSelectNode(prevNode)
      if (e.key === 'ArrowRight') onSelectNode(nextNode)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [node, prevNode, nextNode, onClose, onSelectNode])

  if (!node) return null

  const IconComponent = ICONS[node.iconName] || Cpu

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-[#09111E] border border-cyan-500/30 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent Line */}
        <div 
          className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
          style={{ background: `linear-gradient(90deg, ${node.color} 0%, #2DD4BF 50%, #38BDF8 100%)` }}
        />

        {/* --- MODAL TOP BAR --- */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#0D1829]/95 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0 border"
              style={{ 
                backgroundColor: `${node.color}15`, 
                borderColor: `${node.color}50`,
                color: node.color 
              }}
            >
              <IconComponent size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${node.color}15`,
                    borderColor: `${node.color}40`,
                    color: node.color
                  }}
                >
                  {node.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Node {currentIndex + 1} of {allNodes.length}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white truncate mt-0.5">
                {node.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">
                Diagram Label: <span className="text-cyan-400 font-medium">{node.label}</span>
              </p>
            </div>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              onClick={() => onSelectNode(prevNode)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title={`Previous: ${prevNode.name} (Left Arrow)`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onSelectNode(nextNode)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title={`Next: ${nextNode.name} (Right Arrow)`}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition-colors ml-1"
              title="Close (Escape)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* --- MODAL SCROLLABLE BODY --- */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* --- SECTION 1: WHAT IT WILL DO --- */}
          <div className="bg-slate-900/80 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold mb-2">
              <Activity size={15} />
              <span>Operational Role & What It Will Do</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans mb-4">
              {node.whatItDoes}
            </p>

            {/* Key Operational Capabilities */}
            {node.keyFeatures && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Key Functions in the Cleaning Mission:
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {node.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 bg-[#060D17] p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- SECTION 2: HARDWARE SPECIFICATIONS --- */}
          {node.specs && (
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
                <Wrench size={15} />
                <span>Technical Specifications & Operating Parameters</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {Object.entries(node.specs).map(([param, value]) => (
                  <div 
                    key={param}
                    className="bg-[#0B1524] p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      {param}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-100 font-mono mt-1">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SECTION 3: WORKFLOW ARCHITECTURE CONNECTIONS --- */}
          <div className="bg-[#081220] rounded-xl p-4 border border-slate-800/90">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
              <ShieldCheck size={15} />
              <span>Signal & Power Workflow Connections</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-3 items-center text-xs">
              {/* Upstream Source */}
              <div className="bg-[#0D1B2E] p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  ⬆ Inputs & Upstream
                </span>
                <span className="text-xs text-slate-200 font-medium leading-snug block">
                  {node.upstream}
                </span>
              </div>

              {/* Active Component */}
              <div className="bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/40 text-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <span className="text-[10px] font-mono text-cyan-300 uppercase block mb-1">
                  ★ Selected Node
                </span>
                <span className="text-xs text-white font-bold block truncate">
                  {node.name}
                </span>
              </div>

              {/* Downstream Destination */}
              <div className="bg-[#0D1B2E] p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  ⬇ Outputs & Downstream
                </span>
                <span className="text-xs text-slate-200 font-medium leading-snug block">
                  {node.downstream}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-sans">
              <strong className="text-slate-300 font-mono mr-1.5">Mission Sequence:</strong>
              {node.workflowRole}
            </div>
          </div>

        </div>

        {/* --- MODAL FOOTER --- */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#0A1322] border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Water Surface Cleaning Platform · Fig. 2a</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectNode(prevNode)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectNode(nextNode)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
            <span>•</span>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white underline underline-offset-4"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
