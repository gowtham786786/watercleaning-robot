import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, Radio, Target } from 'lucide-react'
import { BlueprintCallout } from './BlueprintCallout'
import { SystemArchitecture } from './SystemArchitecture'

const architectureCards = [
  { 
    title: "Navigation & Perception", 
    desc: "Four HC-SR04 ultrasonic sensors maintain real-time obstacle clearance, achieving 95.6 ± 2.1% avoidance reliability across static, dynamic, and debris-field test scenarios (97.8% / 91.2% / 95.4% success rates respectively).", 
    icon: Radio,
    metric: "95.6 ± 2.1% Reliability"
  },
  { 
    title: "Hybrid Control System", 
    desc: "Raspberry Pi 4 with an OV5647 camera handles vision and high-level planning, issuing commands to an ESP32 over UART — 8.2ms average latency, 99.2% packet reliability, 1.2 kbps throughput.", 
    icon: Cpu,
    metric: "8.2 ms Latency"
  },
  { 
    title: "Material Segregation", 
    desc: "A KY-036 inductive sensor flags metallic debris, triggering an MG996R servo gate that diverts items into separate metallic/non-metallic bins — 94.5 ± 1.6% sorting accuracy, with ferrous-metal recovery exceeding 91%.", 
    icon: Target,
    metric: "94.5 ± 1.6% Sorting"
  },
  { 
    title: "Continuous Collection & Transfer", 
    desc: "Main conveyor (47×22 cm, 28° incline, 15° V-shaped ramp) and secondary separation conveyor (18×14 cm) lift waterborne debris into dual bins (29×41×19 cm, ~2.5 kg capacity each) at 1.23 kg/hr throughput.", 
    icon: Zap,
    metric: "1.23 kg/hr Throughput"
  }
]

export function Engineering() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-border bg-marine w-full">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-text-main">System Architecture</h2>
        <p className="text-text-muted max-w-3xl mx-auto text-lg leading-relaxed">
          A distributed hybrid control architecture combining high-level vision processing with real-time low-level actuation, achieving sub-10ms inter-processor latency.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
        {/* System Architecture Workflow Diagram */}
        <div className="glass-panel p-1.5 flex flex-col items-center justify-center relative w-full h-[640px] lg:h-[680px] shadow-2xl">
          <SystemArchitecture />
        </div>

        <div className="flex flex-col justify-between h-full">
          {/* Hardware Quick Summary Callouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border-b border-border pb-8">
            <BlueprintCallout 
              label="Dimensions" 
              value="88×41×34" 
              unit="cm" 
            />
            <BlueprintCallout 
              label="Platform Mass" 
              value="3.75" 
              unit="kg" 
            />
            <BlueprintCallout 
              label="Buoyancy Reserve" 
              value="4.8" 
              unit="kg" 
            />
            <BlueprintCallout 
              label="Steady Draw" 
              value="~38.4" 
              unit="W" 
            />
          </div>

          <div className="space-y-6">
            {architectureCards.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex gap-4 group p-4 rounded-lg bg-surface/60 border border-border/70 hover:border-primary/50 transition-all"
              >
                <div className="shrink-0 mt-1 w-11 h-11 bg-marine border border-border group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all rounded-md flex items-center justify-center text-text-muted group-hover:text-primary">
                  <step.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-text-main">{step.title}</h4>
                    <span className="text-[11px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {step.metric}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

