import React from 'react';

/**
 * Pixel-Accurate Cinematic Planetary Arc & Constellation Background
 * Recreates the exact warm burnt-orange crescent and delicate constellation lines from the reference.
 */
export default function CinematicBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* 1. Deep Space Base Radial Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-[#e4783b]/10 via-[#4a251b]/15 to-transparent" style={{ backgroundPosition: '42% 35%', backgroundSize: '120% 120%' }} />

      {/* 2. Large Glowing Planetary Crescent Arc */}
      <svg
        className="absolute inset-0 w-full h-full opacity-80"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Warm Rust/Orange Crescent Gradient */}
          <linearGradient id="arcGlow" x1="45%" y1="0%" x2="55%" y2="100%">
            <stop offset="0%" stopColor="#E4783B" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#C85A27" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#7A301A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#171311" stopOpacity="0.0" />
          </linearGradient>

          {/* Diffuse Shadow Gradient */}
          <radialGradient id="planetGlow" cx="45%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#E4783B" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#4A251B" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#0D0B0A" stopOpacity="0" />
          </radialGradient>

          <filter id="crescentBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Ambient Warm Halo behind the Crescent */}
        <circle cx="620" cy="380" r="420" fill="url(#planetGlow)" />

        {/* The Giant Curved Planetary Silhouette Arc */}
        <path
          d="M 640 -50 C 670 280, 580 620, 380 920"
          stroke="url(#arcGlow)"
          strokeWidth="38"
          strokeLinecap="round"
          filter="url(#crescentBlur)"
          opacity="0.9"
        />
        <path
          d="M 640 -50 C 670 280, 580 620, 380 920"
          stroke="#FFA566"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 3. Delicate Constellation Lines & Star Nodes (matching reference right-of-crescent) */}
        <g stroke="rgba(240, 235, 229, 0.15)" strokeWidth="0.75">
          <line x1="720" y1="360" x2="890" y2="330" />
          <line x1="890" y1="330" x2="980" y2="380" />
          <line x1="720" y1="360" x2="760" y2="440" />
          <line x1="760" y1="440" x2="840" y2="480" />
          <line x1="680" y1="380" x2="720" y2="360" strokeDasharray="3 3" opacity="0.6" />
        </g>

        {/* Constellation Star Dots */}
        {[
          [720, 360, 2.5],
          [890, 330, 2],
          [980, 380, 2.5],
          [760, 440, 1.8],
          [840, 480, 2.2],
          [680, 380, 1.5]
        ].map(([cx, cy, r], idx) => (
          <g key={idx}>
            <circle cx={cx} cy={cy} r={r * 2} fill="#E4783B" opacity="0.3" />
            <circle cx={cx} cy={cy} r={r} fill="#F0EBE5" opacity="0.9" />
          </g>
        ))}

        {/* Subtle Ambient Cosmic Particles */}
        {[
          [280, 140, 1], [420, 80, 1.2], [520, 220, 0.8], [920, 160, 1.2], [1120, 240, 1],
          [1050, 480, 0.9], [1180, 380, 1.4], [1280, 520, 1], [860, 620, 1.2], [740, 720, 0.8]
        ].map(([px, py, pr], pIdx) => (
          <circle key={`star-${pIdx}`} cx={px} cy={py} r={pr} fill="#F0EBE5" opacity={0.25 + (pIdx % 3) * 0.2} />
        ))}
      </svg>

      {/* 4. Soft Vignette Overlay along edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-[#0D0B0A]/40 opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B0A]/50 via-transparent to-[#0D0B0A]/60 opacity-60" />
    </div>
  );
}
