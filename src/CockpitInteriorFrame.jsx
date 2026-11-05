import React from 'react';

/**
 * First-Person Cupola Cockpit Window Frame (POV)
 * Simulates looking directly through the reinforced panoramic glass window of an Orion/Dragon spacecraft.
 */
export default function CockpitInteriorFrame({ isAlert = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {/* 1. Curved Aerospace Glass Window Sheen & Reflections */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/[0.02] to-white/[0.05] pointer-events-none" />

      {/* Diagonal Cockpit Glass Glare Reflection */}
      <div className="absolute -inset-x-20 top-0 h-[120%] bg-gradient-to-r from-transparent via-cyan-400/[0.03] to-transparent rotate-[35deg] pointer-events-none" />

      {/* 2. Red Alert Emergency Ambient Cockpit Flare */}
      {isAlert && (
        <div className="absolute inset-0 bg-red-600/15 animate-pulse pointer-events-none z-10 mix-blend-overlay" />
      )}

      {/* 3. Heavy Titanium Cupola Bezel & Riveted Canopy Arch (First-Person View) */}
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Carbon/Titanium Metallic Gradient */}
          <linearGradient id="bulkheadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1120" />
            <stop offset="35%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Console Glow Gradient */}
          <linearGradient id="consoleGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* --- TOP CANOPY ARCH --- */}
        <path
          d="M 0,0 L 1920,0 L 1920,40 Q 960,85 0,40 Z"
          fill="url(#bulkheadGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* --- LEFT REINFORCED HULL FRAME --- */}
        <path
          d="M 0,0 L 45,40 Q 75,540 45,1030 L 0,1080 Z"
          fill="url(#bulkheadGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* --- RIGHT REINFORCED HULL FRAME --- */}
        <path
          d="M 1920,0 L 1875,40 Q 1845,540 1875,1030 L 1920,1080 Z"
          fill="url(#bulkheadGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* --- BOTTOM FLIGHT DECK CONSOLE SILL --- */}
        <path
          d="M 0,1080 L 1920,1080 L 1875,1030 Q 960,995 45,1030 Z"
          fill="url(#bulkheadGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Structural Rivets / Aerospace Fasteners along the Window Perimeter */}
        {[
          [120, 35], [320, 48], [540, 56], [760, 60], [960, 62], [1160, 60], [1380, 56], [1600, 48], [1800, 35],
          [52, 220], [58, 440], [60, 660], [54, 880],
          [1868, 220], [1862, 440], [1860, 660], [1866, 880],
          [200, 1045], [450, 1032], [700, 1022], [960, 1018], [1220, 1022], [1470, 1032], [1720, 1045]
        ].map(([rx, ry], idx) => (
          <g key={idx}>
            <circle cx={rx} cy={ry} r="3" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <circle cx={rx - 1} cy={ry - 1} r="0.8" fill="#94a3b8" />
          </g>
        ))}

        {/* HUD Pitch Ladder & Horizon Grid Etched into the Glass */}
        <line x1="880" y1="540" x2="940" y2="540" stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="980" y1="540" x2="1040" y2="540" stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.4" />
        <circle cx="960" cy="540" r="4" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.5" />
      </svg>

      {/* 4. Bottom Cockpit Control Indicators & Backlit Switches */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-6 px-4 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CABIN PRESS: 101.3 kPa (1.0 ATM)</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>O2 CONC: 21.0% • CO2: 0.28%</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>WINDOW HEATER: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
