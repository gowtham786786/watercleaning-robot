import React from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Maximize2 } from 'lucide-react'

export function Gallery() {
  const images = [
    { id: 1, label: "Top-down View", desc: "47×22 cm primary conveyor configuration" },
    { id: 2, label: "Side Angle", desc: "HDPE foam catamaran hull with PVC modules" },
    { id: 3, label: "Water Collection", desc: "Demonstrating 1.23 kg/hr throughput" },
    { id: 4, label: "Obstacle Avoidance", desc: "Static and dynamic obstacle testing" },
    { id: 5, label: "Main PCB", desc: "Raspberry Pi 4 and ESP32 integration" },
    { id: 6, label: "Propulsion System", desc: "Differential drive with L298N control" }
  ]

  return (
    <section className="py-32 px-6 max-w-screen-2xl mx-auto w-full border-t border-border bg-marine">
      <div className="mb-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-text-main">System Documentation</h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          High-resolution captures of the prototype, field validation in the 16×12 m test facility, and detailed component architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <motion.div 
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative aspect-video bg-surface border border-border rounded-lg overflow-hidden cursor-pointer"
          >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-marine via-transparent to-transparent opacity-100 z-10 transition-opacity duration-500 group-hover:opacity-50"></div>
            
            {/* Replace this with actual image tag later */}
            <div className="absolute inset-0 bg-marine/40 flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105">
              <ImageIcon size={40} className="text-text-muted/40 mb-2 group-hover:text-primary transition-colors duration-500" />
            </div>

            <div className="absolute top-4 right-4 z-20 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               <div className="bg-marine/80 backdrop-blur p-2 rounded-full border border-border">
                 <Maximize2 size={16} className="text-white" />
               </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="text-text-main font-bold mb-1">{img.label}</h4>
              <p className="text-primary text-xs font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {img.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
