import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Lightbulb, ExternalLink, Code, BookOpen } from 'lucide-react'

export function Content() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-24 text-base text-text-muted leading-relaxed">
      
      {/* Problem & Solution */}
      <section id="about" className="grid md:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="glass-panel p-8 border border-border/80"
        >
          <div className="flex items-center gap-3 mb-5 text-amber-400">
            <AlertTriangle size={22} />
            <h2 className="text-2xl font-bold text-text-main">The Ecological Challenge</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed">
            Floating waste — composed primarily of plastic packaging (~35%), discarded metal cans (~24%), and floating foliage (~41%) — severely impacts urban water bodies, wetlands, and river mouths.
          </p>
          <p className="text-sm leading-relaxed">
            Traditional cleaning involves slow, hazardous manual harvesting or bulky skimmers that collect debris in an unsorted bulk mass. Mixed waste cross-contamination drops effective downstream recycling yield to roughly 43%.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.15 }}
          className="glass-panel p-8 border border-primary/40 shadow-[0_0_25px_rgba(45,212,191,0.06)]"
        >
          <div className="flex items-center gap-3 mb-5 text-primary">
            <Lightbulb size={22} />
            <h2 className="text-2xl font-bold text-text-main">The Robotic Solution</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed">
            An autonomous, sensor-guided surface remediation platform integrating a continuous conveyor collection mechanism with real-time selective solid-waste segregation.
          </p>
          <p className="text-sm leading-relaxed">
            By pairing a 15° V-ramp and 28° inclined conveyor with an inductive metal sensor and an automated diverter gate, the USV isolates metallic items from non-metallic debris at source — lifting recycling yield to 86.2% with 94.5% sorting accuracy.
          </p>
        </motion.div>
      </section>

      {/* Publication Citation & Resources */}
      <footer className="pt-12 border-t border-border/80">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-surface border border-border text-primary text-xs font-mono tracking-widest uppercase mb-6 shadow-sm">
            <BookOpen size={14} /> Academic Manuscript
          </div>
          
          <div className="glass-panel p-6 md:p-8 text-left border border-border/80 mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block mb-2">
              Research Publication
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug">
              “Autonomous Water-Surface Remediation and Resource Recovery through Sensor-Guided Detection, Conveyor-Assisted Collection and Selective Solid-Waste Separation”
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mb-4 leading-relaxed">
              <span className="font-semibold text-text-main">Authors: </span>
              Karri Gowtham Venkata Reddy, Ganpisetti Dhanya, Abdullah Alrashidi, Abdullah Alghafis, Mahmoud S. El-Sebaey, S. Shanmugan
            </p>
            <div className="text-xs font-mono text-primary/80 bg-marine/90 px-3.5 py-2.5 rounded border border-border/80 flex items-center justify-between flex-wrap gap-2">
              <span>Target: Water Research (Elsevier)</span>
              <span className="text-text-muted">Status: Submitted Manuscript</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <a 
            href="https://watercleaning-robot.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-marine font-mono font-bold text-xs tracking-wider uppercase rounded hover:bg-primary/90 transition-colors shadow-lg"
          >
            <ExternalLink size={14} /> Live Project
          </a>
          <a 
            href="https://github.com/gowtham786786/watercleaning-robot" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-5 py-2.5 glass-panel text-text-main hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors"
          >
            <Code size={14} /> GitHub Repository
          </a>
        </div>
      </footer>

    </div>
  )
}
