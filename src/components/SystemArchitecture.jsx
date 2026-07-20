import React, { useState } from 'react'

// Define the 16 nodes symmetrically, bringing Power supplies to the top to fix left-edge clipping
const nodes = [
  // Row 1 (Power) - y: 20
  { id: 'pb', title: 'Power bank', sub: '5V to 12.5V', type: 'power', x: 140, y: 20, w: 240, h: 70 },
  { id: 'bat', title: 'Li-ion Battery pack', sub: 'ESP32 & sensor power', type: 'power', x: 640, y: 20, w: 240, h: 70 },

  // Row 2 (RPi) - y: 130
  { id: 'rpi', title: 'Raspberry Pi 4', sub: 'Main controller & camera vision', type: 'compute_main', x: 330, y: 130, w: 360, h: 70 },

  // Row 3 (ESP32) - y: 240
  { id: 'esp', title: 'ESP32', sub: 'Motor & sensor hub', type: 'compute_sub', x: 330, y: 240, w: 360, h: 70 },

  // Row 4 (Drivers) - y: 360
  { id: 'l298_1', title: 'L298N #1', sub: 'Conveyor & separation belt', type: 'driver_1', x: 100, y: 360, w: 300, h: 70 },
  { id: 'l298_2', title: 'L298N #2', sub: 'Wheel drive motors', type: 'driver_2', x: 620, y: 360, w: 300, h: 70 },

  // Row 5 (Motors) - y: 470
  { id: 'm_conv', title: 'Conveyor belt', sub: 'Motor', type: 'motor', x: 40, y: 470, w: 180, h: 60 },
  { id: 'm_sep', title: 'Separation belt', sub: 'Motor', type: 'motor', x: 240, y: 470, w: 180, h: 60 },
  { id: 'm_lw', title: 'Left wheel', sub: 'Motor', type: 'motor', x: 600, y: 470, w: 180, h: 60 },
  { id: 'm_rw', title: 'Right wheel', sub: 'Motor', type: 'motor', x: 800, y: 470, w: 180, h: 60 },

  // Row 6 (Sensors) - y: 600
  { id: 's_us', title: 'Ultrasonic sensor', sub: 'Obstacle avoidance', type: 'sensor', x: 40, y: 600, w: 240, h: 70 },
  { id: 's_cam', title: 'Camera module', sub: 'Robot location / vision', type: 'sensor', x: 390, y: 600, w: 240, h: 70 },
  { id: 's_met', title: 'Metal detector', sub: 'Identifies metal waste', type: 'sensor', x: 740, y: 600, w: 240, h: 70 },

  // Row 7 (Servo) - y: 730
  { id: 'servo', title: 'Servo motor', sub: 'Directs waste to correct bin', type: 'servo', x: 340, y: 730, w: 340, h: 70 },

  // Row 8 (Bins) - y: 860
  { id: 'b_met', title: 'Metal bin', sub: 'Metal waste collected', type: 'bin', x: 140, y: 860, w: 320, h: 80 },
  { id: 'b_nmet', title: 'Non-metal bin', sub: 'Other waste collected', type: 'bin', x: 560, y: 860, w: 320, h: 80 },
]

// Connections mapping with exact 16 connections
const connections = [
  // Power (Dashed Yellow/Brown)
  { from: 'pb', to: 'rpi', type: 'power', fromOffset: 0.5, toOffset: 0.2 }, 
  { from: 'bat', to: 'esp', type: 'power', fromOffset: 0.5, channelX: 760, splitY: 220, toOffset: 0.8 }, 
  
  // Control (Solid Blue)
  { from: 'rpi', to: 'esp', type: 'control' }, 
  { from: 'esp', to: 'l298_1', type: 'control', fromOffset: 0.1 },
  { from: 'esp', to: 'l298_2', type: 'control', fromOffset: 0.9 },
  { from: 'l298_1', to: 'm_conv', type: 'control', fromOffset: 0.2 },
  { from: 'l298_1', to: 'm_sep', type: 'control', fromOffset: 0.8 },
  { from: 'l298_2', to: 'm_lw', type: 'control', fromOffset: 0.2 },
  { from: 'l298_2', to: 'm_rw', type: 'control', fromOffset: 0.8 },
  
  // Sensor Data (Dashed Red)
  { from: 'esp', to: 's_us', type: 'sensor_data', fromOffset: 0.42, channelX: 481, splitY: 570 },
  { from: 'esp', to: 's_cam', type: 'sensor_data', fromOffset: 0.5, channelX: 510, splitY: 580 },
  { from: 'esp', to: 's_met', type: 'sensor_data', fromOffset: 0.58, channelX: 539, splitY: 570 },
  
  // Metal Signal (Dashed Orange)
  { from: 's_met', to: 'servo', type: 'metal_signal', toOffset: 0.85, midY: 710 },

  // Action / Decision (Solid Red/Pink)
  { from: 's_cam', to: 'servo', type: 'decision' }, 
  { from: 'servo', to: 'b_met', type: 'decision', fromOffset: 0.2, toOffset: 0.5, midY: 830 },
  { from: 'servo', to: 'b_nmet', type: 'decision', fromOffset: 0.8, toOffset: 0.5, midY: 830 },
]

// Exact labels from reference
const labels = [
  { text: 'UART/USB', x: 570, y: 220, color: 'text-slate-300' },
  { text: 'Waste sorting decision', x: 510, y: 715, bg: true },
  { text: 'Metal signal', x: 740, y: 715, color: 'text-orange-400' },
  { text: 'Metal detected', x: 300, y: 845, color: 'text-rose-400' },
  { text: 'No metal', x: 720, y: 845, color: 'text-rose-400' },
]

export function SystemArchitecture() {
  const [hoveredNode, setHoveredNode] = useState(null)

  const typeStyles = {
    power: 'border-yellow-600 bg-yellow-600/10 text-yellow-500 shadow-yellow-600/20',
    compute_main: 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20',
    compute_sub: 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-blue-500/20',
    driver_1: 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20',
    driver_2: 'border-teal-500 bg-teal-500/10 text-teal-400 shadow-teal-500/20',
    motor: 'border-slate-400 bg-slate-400/10 text-slate-300 shadow-slate-400/20',
    sensor: 'border-orange-600 bg-orange-600/10 text-orange-500 shadow-orange-600/20',
    servo: 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-pink-500/20',
    bin: 'border-slate-600 bg-slate-800/50 text-slate-400 shadow-black/40',
  }

  const renderConnections = () => {
    return connections.map((conn, idx) => {
      const n1 = nodes.find(n => n.id === conn.from)
      const n2 = nodes.find(n => n.id === conn.to)
      if (!n1 || !n2) return null

      // Removed opacity fading entirely so no connections ever appear missing
      const opacity = 1

      let strokeColor = '#3b82f6'
      let strokeDash = ''
      let strokeWidth = '5'

      if (conn.type === 'power') {
        strokeColor = '#ca8a04'
        strokeDash = '12 8'
      } else if (conn.type === 'sensor_data') {
        strokeColor = '#dc2626'
        strokeDash = '12 8'
      } else if (conn.type === 'metal_signal') {
        strokeColor = '#ea580c'
        strokeDash = '12 8'
      } else if (conn.type === 'decision') {
        strokeColor = '#e11d48'
        strokeWidth = '4'
      }

      let d = ""

      if (Math.abs(n1.y - n2.y) < 20) {
        let x1, x2;
        if (n1.x < n2.x) { x1 = n1.x + n1.w; x2 = n2.x; }
        else { x1 = n1.x; x2 = n2.x + n2.w; }
        const y = n1.y + n1.h / 2;
        d = `M ${x1} ${y} L ${x2} ${y}`
      } 
      else {
        const x1 = n1.x + n1.w * (conn.fromOffset !== undefined ? conn.fromOffset : 0.5);
        const y1 = n1.y + n1.h;
        const x2 = n2.x + n2.w * (conn.toOffset !== undefined ? conn.toOffset : 0.5);
        const y2 = n2.y;

        if (conn.channelX !== undefined) {
          const cx = conn.channelX;
          const sy = conn.splitY;
          d = `M ${x1} ${y1} L ${x1} ${y1 + 15} L ${cx} ${y1 + 15} L ${cx} ${sy} L ${x2} ${sy} L ${x2} ${y2}`;
        } else {
          const midY = conn.midY !== undefined ? conn.midY : (y1 + y2) / 2;
          d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }
      }

      return (
        <path 
          key={idx} 
          d={d}
          fill="none"
          stroke={strokeColor} 
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDash}
          opacity={opacity}
          className="transition-opacity duration-300"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )
    })
  }

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-dark/40 rounded-sm relative overflow-hidden group">
      
      <div 
        className="absolute transition-transform duration-700 ease-out"
        style={{
          width: '1000px',
          height: '1000px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotateX(55deg) rotateZ(-35deg) scale(0.52)',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(-4px)' }}>
           {renderConnections()}
        </svg>

        {labels.map((lbl, i) => (
          <div 
            key={i}
            className={`absolute text-[16px] italic tracking-wide font-medium ${lbl.color || 'text-slate-400'} ${lbl.bg ? 'bg-dark/80 px-3 py-1 rounded backdrop-blur border border-border/50' : ''}`}
            style={{ 
              left: lbl.x, top: lbl.y, 
              transform: 'translate(-50%, -50%) translateZ(1px)',
              opacity: 1 // Keep labels fully visible
            }}
          >
            {lbl.text}
          </div>
        ))}

        {nodes.map(n => {
          const isHovered = hoveredNode === n.id
          
          return (
            <div
              key={n.id}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`absolute flex flex-col items-center justify-center border-2 backdrop-blur-md rounded-lg transition-all duration-300 cursor-pointer 
                ${typeStyles[n.type]}
                opacity-100
              `}
              style={{
                left: n.x,
                top: n.y,
                width: n.w,
                height: n.h,
                transform: `translateZ(${isHovered ? 35 : 20}px)`,
                transformStyle: 'preserve-3d',
                boxShadow: isHovered 
                  ? '12px 12px 24px rgba(0,0,0,0.7)' 
                  : '6px 6px 12px rgba(0,0,0,0.5)'
              }}
            >
              <div className="absolute top-full left-0 w-full h-[8px] bg-black/50 origin-top rounded-b-sm" style={{ transform: 'rotateX(-90deg)' }} />
              <div className="absolute top-0 right-full w-[8px] h-full bg-black/30 origin-right rounded-l-sm" style={{ transform: 'rotateY(-90deg)' }} />
              
              <span className="text-[20px] font-bold tracking-wider" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.9)' }}>
                {n.title}
              </span>
              <span className="text-[13px] mt-1.5 opacity-90 uppercase tracking-widest font-mono text-center px-4 font-semibold">
                {n.sub}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
