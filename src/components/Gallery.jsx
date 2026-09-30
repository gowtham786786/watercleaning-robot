import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, X, Camera } from 'lucide-react'

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    { 
      id: 1, 
      label: "Field Pool Validation", 
      desc: "USV undergoing debris capture trials in 16×12 m test facility", 
      src: "/gallery/page6_1_Image27.jpg" 
    },
    { 
      id: 2, 
      label: "Top-Down Conveyor Configuration", 
      desc: "47×22 cm primary conveyor with 15° V-shaped ramp", 
      src: "/gallery/top-down-view.jpg" 
    },
    { 
      id: 3, 
      label: "Catamaran Hull Architecture", 
      desc: "HDPE foam pontoons delivering 4.8 kg buoyancy reserve", 
      src: "/gallery/side-angle.jpg" 
    },
    { 
      id: 4, 
      label: "Surface Debris Ingestion", 
      desc: "Sustained 1.23 kg/hr continuous surface harvesting", 
      src: "/gallery/water-collection-1.jpg" 
    },
    { 
      id: 5, 
      label: "Differential Propulsion Drive", 
      desc: "Twin thruster propulsion modules for precision maneuvering", 
      src: "/gallery/propulsion-system.jpg" 
    },
    { 
      id: 6, 
      label: "Mechanical Blueprint & Layout", 
      desc: "Published side-elevation and sub-assembly layout", 
      src: "/gallery/page6_0_Image26.jpg" 
    }
  ]

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto w-full border-t border-border bg-marine">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-surface border border-border text-primary text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
          <Camera size={14} /> Field Documentation
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-text-main">
          Hardware & Field Testing
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Photographic records of the USV prototype during assembly, mechanical calibration, and aquatic validation trials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.div 
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-video bg-surface border border-border/80 rounded-lg overflow-hidden cursor-pointer shadow-md hover:border-primary/50 transition-all"
          >
            {/* Ambient hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300"></div>
            
            <img 
              src={img.src} 
              alt={img.label} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-marine/90 backdrop-blur p-1.5 rounded-md border border-border text-primary">
                <Maximize2 size={14} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 z-20">
              <h4 className="text-white font-bold text-sm mb-0.5">{img.label}</h4>
              <p className="text-text-muted text-xs font-mono leading-tight">
                {img.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-marine border border-border rounded-xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-border/70 text-white">
              <div>
                <h3 className="font-bold text-sm text-white">{selectedImage.label}</h3>
                <p className="text-xs text-text-muted font-mono">{selectedImage.desc}</p>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1.5 text-text-muted hover:text-white bg-surface hover:bg-border rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-2 flex items-center justify-center bg-black/50">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.label} 
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
