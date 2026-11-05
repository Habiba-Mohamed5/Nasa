import React from 'react';

export default function CockpitInteriorFrame({ isAlert = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {/* 1. Cinematic GIF Layer blended with Space Stars */}
      <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
        <img
          src="/hero-bg.gif"
          alt="Space Cinematic Atmosphere"
          className="w-full h-full object-cover scale-110 filter hue-rotate-15 contrast-125"
        />
      </div>

      {/* 2. Red Alert Ambient Lighting (when Comm Blackout or Emergency is active) */}
      {isAlert && (
        <div className="absolute inset-0 bg-red-600/15 animate-pulse pointer-events-none z-10 mix-blend-overlay" />
      )}

      {/* 3. Spaceship Cupola Window Struts (Titanium Hull Arch) */}
      <svg
        className="w-full h-full absolute inset-0 opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Top Cockpit Beam */}
        <polygon points="0,0 1920,0 1840,45 80,45" fill="url(#metalGradient)" stroke="#334155" strokeWidth="1" />

        {/* Left Window Strut */}
        <polygon points="0,0 80,45 40,1035 0,1080" fill="url(#metalGradient)" stroke="#334155" strokeWidth="1" />

        {/* Right Window Strut */}
        <polygon points="1920,0 1840,45 1880,1035 1920,1080" fill="url(#metalGradient)" stroke="#334155" strokeWidth="1" />

        {/* Bottom Console Deck Beam */}
        <polygon points="0,1080 1920,1080 1880,1035 40,1035" fill="url(#metalGradient)" stroke="#334155" strokeWidth="1" />

        {/* Subtle Cockpit Horizon Reticles */}
        <line x1="120" y1="540" x2="300" y2="540" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.3" />
        <line x1="1620" y1="540" x2="1800" y2="540" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.3" />
      </svg>

      {/* 4. Cockpit Status Blinking Beacons */}
      <div className="absolute top-2 left-10 flex items-center gap-1.5 z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
          CABIN 1 ATM • LIFE SUPPORT NOMINAL
        </span>
      </div>

      <div className="absolute top-2 right-10 flex items-center gap-1.5 z-20">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
          AI FLIGHT SURGEON NEURAL CORE • ACTIVE
        </span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </div>
    </div>
  );
}
