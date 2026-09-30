import React from 'react'

export function BlueprintCallout({ label, value, unit, subtext, className = "", style = {} }) {
  return (
    <div className={`flex flex-col ${className}`} style={style}>
      <div className="flex items-baseline gap-2 mb-1 pl-1">
        <span className="font-mono text-primary font-bold text-lg tracking-tight">{value}</span>
        {unit && <span className="font-mono text-primary/70 text-xs uppercase tracking-widest">{unit}</span>}
      </div>
      <div className="blueprint-line w-full"></div>
      <div className="mt-1 pl-1 flex flex-col">
        <span className="font-mono text-text-muted text-[10px] uppercase tracking-widest">{label}</span>
        {subtext && <span className="font-mono text-primary/70 text-[9px] tracking-wide mt-0.5">{subtext}</span>}
      </div>
    </div>
  )
}

