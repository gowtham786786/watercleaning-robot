import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, Radio, Target } from 'lucide-react'
import { BlueprintCallout } from './BlueprintCallout'

const steps = [
  { title: "Navigation & Perception", desc: "Four HC-SR04 ultrasonic sensors maintain a 0.5m obstacle clearance yielding a 95.6% avoidance success rate.", icon: Radio },
  { title: "Hybrid Control System", desc: "Raspberry Pi 4 handles high-level processing via an OV5647 camera, sending commands to an ESP32 via UART with 8.2ms latency.", icon: Cpu },
  { title: "Material Segregation", desc: "A KY-036 inductive sensor detects metals, triggering an MG996R servo to sort waste with 94.5% purity.", icon: Target },
  { title: "Continuous Collection", desc: "A 28° inclined conveyor powered by N20 gearmotors and L298N drivers captures 1.23 kg/hr of floating debris.", icon: Zap }
]

export function Engineering() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-border bg-marine w-full">
      <div className="mb-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-text-main">System Architecture</h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          A distributed hybrid control architecture combining high-level vision processing with real-time low-level actuation, achieving sub-10ms inter-processor latency.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Actual Architectural Diagram Image */}
        <div className="glass-panel p-2 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none z-10"></div>
          {/* Replace src with whichever image is the exact one, defaulting to the first uploaded */}
          <img src="/assets/media__1784373476132.jpg" alt="Control Architecture Diagram" className="w-full h-auto rounded object-contain relative z-20" />
          
          <div className="absolute bottom-4 left-4 z-30">
            <div className="bg-marine/80 backdrop-blur px-3 py-1.5 border border-border">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Fig 1. Node Diagram</span>
            </div>
          </div>
        </div>

        <div>
          {/* Hardware Specs Callouts */}
          <div className="grid grid-cols-2 gap-8 mb-12 border-b border-border pb-12">
            <BlueprintCallout 
              label="Platform Dimensions" 
              value="88×41×34" 
              unit="cm" 
            />
            <BlueprintCallout 
              label="Total Displacement" 
              value="3.75" 
              unit="kg" 
            />
          </div>

          <div className="space-y-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-6 group"
              >
                <div className="shrink-0 mt-1 w-12 h-12 bg-surface border border-border group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all rounded-sm flex items-center justify-center text-text-muted group-hover:text-primary">
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-main mb-2">{step.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
