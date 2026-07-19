import React from 'react'
import { motion } from 'framer-motion'
import { Target, Lightbulb, AlertTriangle, Code, Mail } from 'lucide-react'

export function Content() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-32 text-lg text-text-muted leading-relaxed">
      
      {/* Problem & Solution */}
      <section id="about" className="grid md:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6 text-red-500">
            <AlertTriangle size={24} />
            <h2 className="text-3xl font-bold text-text-main">The Problem</h2>
          </div>
          <p className="mb-4">
            Urban waterways are increasingly choked by floating solid waste, plastics, and organic debris. Traditional manual cleaning is labor-intensive, hazardous, and highly inefficient.
          </p>
          <p>
            Existing large-scale skimmer boats are too large for narrow canals and too expensive for continuous deployment in small-to-medium water bodies, leaving a critical gap in environmental maintenance.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3 mb-6 text-green-500">
            <Lightbulb size={24} />
            <h2 className="text-3xl font-bold text-text-main">The Solution</h2>
          </div>
          <p className="mb-4">
            A low-cost, scalable, autonomous robotic platform designed specifically for surface waste collection. 
          </p>
          <p>
            By utilizing a lightweight PVC and acrylic chassis combined with smart sensors (ultrasonic distance and eventually computer vision), the robot can continuously patrol, identify, and scoop debris onto its inclined mesh ramp.
          </p>
        </motion.div>
      </section>

      {/* Objectives */}
      <section className="bg-dark/50 border border-slate-800 rounded-2xl p-10 md:p-16">
        <div className="flex items-center justify-center gap-3 mb-12 text-primary">
          <Target size={32} />
          <h2 className="text-4xl font-bold text-text-main text-center">Research Objectives</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-dark p-6 rounded-xl border border-slate-700/50">
             <h3 className="text-xl font-bold text-text-main mb-3">1. Autonomous Navigation</h3>
             <p className="text-sm">Develop robust obstacle avoidance and path planning using low-cost sonar sensors and microcontrollers in dynamic aquatic environments.</p>
          </div>
          <div className="bg-dark p-6 rounded-xl border border-slate-700/50">
             <h3 className="text-xl font-bold text-text-main mb-3">2. Efficient Collection</h3>
             <p className="text-sm">Design and validate an inclined mesh conveyor mechanism capable of lifting waterlogged debris without excessive power consumption.</p>
          </div>
          <div className="bg-dark p-6 rounded-xl border border-slate-700/50">
             <h3 className="text-xl font-bold text-text-main mb-3">3. Scalable Deployment</h3>
             <p className="text-sm">Ensure the bill of materials (BOM) remains accessible for deployment in developing nations where waterway pollution is most severe.</p>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="text-center pb-12 border-t border-slate-800 pt-12">
        <h2 className="text-2xl font-bold text-text-main mb-6">Contact & Publications</h2>
        <p className="mb-8 max-w-xl mx-auto">
          This digital twin supports our upcoming Q1 journal submission. Full CAD models, source code, and dataset will be released upon publication.
        </p>
        <div className="flex justify-center gap-6">
          <a href="#" className="flex items-center gap-2 text-text-main hover:text-primary transition-colors">
            <Mail size={20} /> [Insert Email]
          </a>
          <a href="#" className="flex items-center gap-2 text-text-main hover:text-primary transition-colors">
            <Code size={20} /> [Insert Repository]
          </a>
        </div>
      </footer>

    </div>
  )
}
