import React, { useMemo } from 'react';

/**
 * Pixel-Accurate Unified Cinematic Hero Cosmic Background
 * Extends the rich, realistic starry space atmosphere across the ENTIRE Hero card:
 * - Seamless cosmic starfield across Left (astronaut), Center, and Right (headline & CTAs)
 * - Fine micro-star dust (150+ deterministic stars with realistic magnitudes)
 * - Subtle open star clusters & constellation nodes extending behind the typography
 * - Soft diffuse cosmic purple & cyan nebula haze
 * - Delicate orbital trajectory arcs and futuristic deep space coordinate vectors
 * - Calibrated contrast for AAA text legibility
 */
export default function CinematicBackground() {
  // Deterministic starfield across the entire hero canvas (0% to 100% width and height)
  const heroStars = useMemo(() => {
    const list = [];
    // 140 realistic stars distributed across the whole hero viewport
    for (let i = 0; i < 140; i++) {
      // Golden ratio pseudo-distribution for natural astronomical clustering
      const x = ((i * 37.7 + 11) % 98) + 1;
      const y = ((i * 61.3 + 19) % 96) + 2;
      const size = (i % 11 === 0) ? 2.2 : (i % 5 === 0) ? 1.6 : (i % 2 === 0) ? 1.1 : 0.8;
      const opacity = (i % 11 === 0) ? 0.85 : 0.25 + ((i * 17) % 55) / 100;
      
      // Stellar temperature colors: Blue-white (cyan), Pure White, Soft Violet, Warm Gold
      const color = (i % 6 === 0) ? '#7AD7EA' : (i % 8 === 0) ? '#7E78C9' : (i % 13 === 0) ? '#FFE4B5' : '#F4F7FC';
      const twinkle = (i % 3 === 0) ? 'fast' : (i % 5 === 0) ? 'slow' : null;
      const hasDiffraction = (i % 11 === 0);

      list.push({ id: `hero-star-${i}`, x, y, size, opacity, color, twinkle, hasDiffraction });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* ─────────────────────────────────────────────────────────────
          1. Continuous Deep Space Cosmic Gradients (Left to Right)
      ───────────────────────────────────────────────────────────── */}
      {/* Primary Radial Cosmic Base */}
      <div
        className="absolute inset-0 bg-radial from-[#7E78C9]/15 via-[#0D1728]/60 to-[#07111F]"
        style={{ backgroundPosition: '45% 35%', backgroundSize: '110% 110%' }}
      />

      {/* Atmospheric Soft Cyan Nebula (Center-Right behind Title) */}
      <div
        className="absolute w-[680px] h-[550px] rounded-full blur-[140px] opacity-[0.14] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.25) 45%, transparent 70%)',
          top: '20%',
          right: '5%',
        }}
      />

      {/* Deep Cosmic Purple Nebula (Upper-Right) */}
      <div
        className="absolute w-[580px] h-[500px] rounded-full blur-[130px] opacity-[0.15] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E78C9 0%, rgba(126, 120, 201, 0.25) 45%, transparent 70%)',
          top: '-10%',
          right: '15%',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. Planetary Crescent & Orbital Trajectory Curves
      ───────────────────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-90"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Warm Rust/Orange Crescent Edge Accent for Astronaut Contrast */}
          <linearGradient id="arcGlow" x1="45%" y1="0%" x2="55%" y2="100%">
            <stop offset="0%" stopColor="#E4783B" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#C85A27" stopOpacity="0.70" />
            <stop offset="65%" stopColor="#7E78C9" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
          </linearGradient>

          {/* Secondary Delicate Trajectory Gradient (Connecting Left to Right) */}
          <linearGradient id="orbitAcross" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4783B" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#7AD7EA" stopOpacity="0.20" />
            <stop offset="75%" stopColor="#7E78C9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7AD7EA" stopOpacity="0.0" />
          </linearGradient>

          {/* Diffuse Atmospheric Halo Gradient */}
          <radialGradient id="planetGlow" cx="45%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#7AD7EA" stopOpacity="0.16" />
            <stop offset="35%" stopColor="#7E78C9" stopOpacity="0.12" />
            <stop offset="75%" stopColor="#07111F" stopOpacity="0" />
          </radialGradient>

          <filter id="crescentBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Ambient Halo behind the Planetary Crescent */}
        <circle cx="620" cy="380" r="420" fill="url(#planetGlow)" />

        {/* The Giant Curved Planetary Silhouette Arc */}
        <path
          d="M 640 -50 C 670 280, 580 620, 380 920"
          stroke="url(#arcGlow)"
          strokeWidth="38"
          strokeLinecap="round"
          filter="url(#crescentBlur)"
          opacity="0.85"
        />
        <path
          d="M 640 -50 C 670 280, 580 620, 380 920"
          stroke="#FFA566"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Sweeping Upper Orbital Trajectory Arc extending across Right Canvas */}
        <path
          d="M 320 80 C 650 20, 1100 160, 1460 110"
          stroke="url(#orbitAcross)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />

        {/* Sweeping Lower Trajectory Arc */}
        <path
          d="M 500 780 C 850 680, 1200 820, 1480 740"
          stroke="url(#orbitAcross)"
          strokeWidth="1.0"
          strokeDasharray="5 7"
        />

        {/* ─────────────────────────────────────────────────────────────
            3. Delicate Constellation Lines & Star Nodes (Left, Center, Right)
        ───────────────────────────────────────────────────────────── */}
        {/* Constellation Cluster 1 (Center to Right) */}
        <g stroke="rgba(122, 215, 234, 0.22)" strokeWidth="0.8">
          <line x1="720" y1="360" x2="890" y2="330" />
          <line x1="890" y1="330" x2="980" y2="380" />
          <line x1="720" y1="360" x2="760" y2="440" />
          <line x1="760" y1="440" x2="840" y2="480" />
          <line x1="680" y1="380" x2="720" y2="360" strokeDasharray="3 3" opacity="0.6" />
        </g>

        {/* Constellation Cluster 2 (Upper-Right behind/above Title) */}
        <g stroke="rgba(199, 210, 227, 0.18)" strokeWidth="0.75">
          <line x1="1020" y1="180" x2="1140" y2="150" />
          <line x1="1140" y1="150" x2="1240" y2="210" />
          <line x1="1240" y1="210" x2="1320" y2="170" />
          <line x1="1140" y1="150" x2="1180" y2="90" strokeDasharray="2 3" opacity="0.5" />
        </g>

        {/* Constellation Star Nodes */}
        {[
          [720, 360, 2.5], [890, 330, 2.0], [980, 380, 2.5], [760, 440, 1.8], [840, 480, 2.2], [680, 380, 1.5],
          [1020, 180, 2.0], [1140, 150, 2.4], [1240, 210, 2.2], [1320, 170, 2.0], [1180, 90, 1.6]
        ].map(([cx, cy, r], idx) => (
          <g key={`constel-node-${idx}`}>
            <circle cx={cx} cy={cy} r={r * 2.2} fill="#7AD7EA" opacity="0.28" />
            <circle cx={cx} cy={cy} r={r} fill="#F4F7FC" opacity="0.95" />
          </g>
        ))}
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          4. Full-Span Realistic Starfield Layers across the Entire Hero
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {heroStars.map((s) => (
          <div
            key={s.id}
            className={`absolute pointer-events-none ${
              s.twinkle === 'fast'
                ? 'animate-twinkle-fast'
                : s.twinkle === 'slow'
                ? 'animate-twinkle-slow'
                : ''
            }`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
            }}
          >
            {/* Focal Beacon Star Diffraction Halo */}
            {s.hasDiffraction && (
              <>
                <span
                  className="absolute -inset-1.5 rounded-full blur-[2px] opacity-60"
                  style={{ backgroundColor: s.color }}
                />
                {/* Micro 4-point diffraction spike */}
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-[0.5px] bg-white/40 pointer-events-none"
                />
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-[0.5px] bg-white/40 pointer-events-none"
                />
              </>
            )}

            {/* Core Star Body */}
            <span
              className="block rounded-full"
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: s.color,
                opacity: s.opacity,
                boxShadow: s.size > 1.8 ? `0 0 6px ${s.color}` : 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. Floating Deep Space Coordinate Markers (Creative Subtle Touch)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block absolute top-20 right-16 text-[9px] font-mono-tech text-[#7AD7EA]/40 tracking-widest select-none pointer-events-none space-y-1 text-right">
        <div>ORBIT // 28.5721° N, 80.6480° W</div>
        <div>APOGEE: 408 KM • PERIGEE: 402 KM</div>
        <div className="text-[#98A7BD]/30">DSN KA-BAND: LOCK ACQUIRED</div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. Contrast-Preserving Soft Vignette
          Tapers softly along extreme borders to blend with #07111F
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#07111F]/15 to-[#07111F]/75 pointer-events-none" />
    </div>
  );
}
