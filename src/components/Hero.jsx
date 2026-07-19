import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ChevronRight, Video, Cpu, Activity, ShieldCheck } from 'lucide-react'
import { useStore } from '../store/useStore'

export function Hero() {
  const { setCinematicMode } = useStore()
  
  const scrollToViewer = () => {
    document.getElementById('digital-twin').scrollIntoView({ behavior: 'smooth' })
  }
  
  const playCinematic = () => {
    setCinematicMode(true)
    scrollToViewer()
  }

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden bg-marine">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-5xl w-full"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-surface border border-border text-text-muted text-xs font-mono tracking-widest uppercase mb-8 shadow-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-sm h-2 w-2 bg-secondary shadow-[0_0_8px_rgba(245,166,35,0.8)]"></span>
          </span>
          Pi4 / ESP32 Hybrid Architecture
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-text-main pb-2">
          Autonomous Surface<br />Remediation USV
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted mb-16 max-w-3xl mx-auto leading-relaxed">
          An intelligent aquatic robotics platform integrating a continuous conveyor-based collection mechanism with real-time inductive-sensor-driven waste segregation.
        </p>

        {/* Data Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
           <div className="glass-panel p-6 flex flex-col items-center justify-center">
              <Cpu size={24} className="text-secondary mb-3 opacity-80" />
              <div className="text-3xl font-mono font-bold text-white mb-1">94.5<span className="text-lg text-primary/80">%</span></div>
              <div className="text-xs text-text-muted uppercase tracking-widest font-mono">Segregation Accuracy</div>
           </div>
           <div className="glass-panel p-6 flex flex-col items-center justify-center">
              <Activity size={24} className="text-primary mb-3 opacity-80" />
              <div className="text-3xl font-mono font-bold text-white mb-1">1.23<span className="text-lg text-primary/80">kg/hr</span></div>
              <div className="text-xs text-text-muted uppercase tracking-widest font-mono">Collection Throughput</div>
           </div>
           <div className="glass-panel p-6 flex flex-col items-center justify-center">
              <ShieldCheck size={24} className="text-primary mb-3 opacity-80" />
              <div className="text-3xl font-mono font-bold text-white mb-1">8.2<span className="text-lg text-primary/80">ms</span></div>
              <div className="text-xs text-text-muted uppercase tracking-widest font-mono">Control Latency</div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={scrollToViewer}
            className="group relative px-8 py-4 bg-primary text-marine font-mono font-bold text-sm tracking-widest uppercase transition-all hover:bg-primary/90 flex items-center gap-2 border-2 border-primary"
          >
            <span className="relative z-10">Explore Digital Twin</span>
            <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={playCinematic}
            className="px-8 py-4 glass-panel text-text-main font-mono font-semibold text-sm tracking-widest uppercase transition-all hover:bg-surface flex items-center gap-2"
          >
            <Video size={16} className="text-primary" />
            Cinematic Fly-Through
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={scrollToViewer}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  )
}
