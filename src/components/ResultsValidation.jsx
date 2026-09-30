import React from 'react'
import { motion } from 'framer-motion'
import { Award, Zap, ShieldCheck, Target, ArrowUpRight, Sparkles } from 'lucide-react'

const keyMetrics = [
  {
    title: "Source Recycling Yield",
    value: "86.2%",
    comparison: "+43.2% vs conventional (43.0%)",
    desc: "Achieved through real-time at-source segregation, elevating usable recovery compared to non-sorting skimmers.",
    icon: Award,
    highlight: "Primary Impact Metric"
  },
  {
    title: "Segregation Accuracy",
    value: "94.5%",
    comparison: "± 1.6% margin",
    desc: "KY-036 inductive sensor paired with an MG996R gate reliably routes metallic and polymer waste to isolated bins.",
    icon: Target,
    highlight: "Automated Sorting"
  },
  {
    title: "Collection Throughput",
    value: "1.23",
    unit: "kg/hr",
    comparison: "Peak trial: 91.7% capture",
    desc: "Continuous 28° conveyor with 15° V-ramp harvests floating bottles, cans, and organic matter without clogging.",
    icon: Zap,
    highlight: "Sustained Harvesting"
  },
  {
    title: "Obstacle Avoidance",
    value: "95.6%",
    comparison: "8.2 ms loop latency",
    desc: "Four HC-SR04 ultrasonic sensors maintain reliable clearance across static, dynamic, and dense debris fields.",
    icon: ShieldCheck,
    highlight: "Autonomous Safety"
  }
]

export function ResultsValidation() {
  return (
    <section id="results" className="py-28 px-6 max-w-7xl mx-auto border-t border-border bg-marine w-full">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-surface border border-border text-primary text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles size={14} /> Empirical Validation
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-text-main">
          Field Results & Performance
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Rigorous benchmarking across 12 trials in a 16×12 m controlled water environment, validating selective recovery against conventional bulk collection.
        </p>
      </div>

      {/* 4 Sleek Impact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="glass-panel p-6 border border-border/70 hover:border-primary/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-surface border border-border/80 flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:shadow-[0_0_12px_rgba(45,212,191,0.25)] transition-all">
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider bg-surface px-2 py-0.5 rounded border border-border/50">
                    {item.highlight}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-mono font-bold text-white tracking-tight">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-sm font-mono text-primary font-semibold">
                        {item.unit}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold mt-1">
                    <ArrowUpRight size={13} /> {item.comparison}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-main mb-2 mt-4">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
