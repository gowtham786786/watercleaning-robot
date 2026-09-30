import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Award, Zap, ShieldCheck, Target, ArrowUpRight, Sparkles } from 'lucide-react'

const keyMetrics = [
  {
    title: "Source Recycling Yield",
    value: "86.2%",
    comparison: "+43.2% vs conventional",
    desc: "Achieved through real-time at-source sorting, compared to only 43.0% recovery in non-sorting skimmers.",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {keyMetrics.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="glass-panel p-6 border border-border/70 hover:border-primary/50 transition-all flex flex-col justify-between group"
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

      {/* Clean Executive Comparison Spotlight */}
      <div className="glass-panel p-6 md:p-8 border border-border/70 overflow-hidden relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
              The Selective Advantage
            </span>
            <h3 className="text-2xl font-bold text-text-main leading-snug">
              Why Sorting at the Water Surface Changes Recycling Economics
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Conventional surface skimmers collect all debris into a single mixed mass. Wet, contaminated plastics mixed with metals and biomass require hazardous manual separation and degrade recycling value.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface/40 border border-border/60">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-2">
                Conventional Skimmer
              </span>
              <div className="text-2xl font-mono font-bold text-text-muted mb-2">
                43.0%
              </div>
              <p className="text-xs text-text-muted/80 leading-relaxed">
                Bulk collection without sorting. High cross-contamination caps downstream recycling yield.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/40 shadow-[0_0_20px_rgba(45,212,191,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                  Our Proposed USV
                </span>
                <CheckCircle2 size={15} className="text-primary" />
              </div>
              <div className="text-2xl font-mono font-bold text-primary mb-2">
                86.2%
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Autonomous real-time segregation doubles the usable recycling yield straight from the water.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
