import React, { useMemo } from 'react';

/**
 * GlobalCosmicBackground
 * Site-wide immersive deep space atmosphere:
 * - Deep Space Navy (#07111F) & Midnight Blue (#0D1728) gradient base
 * - Soft Cosmic Purple (#7E78C9) & Soft Cyan (#7AD7EA) nebula hazes
 * - Multi-layered distributed star fields with subtle twinkling
 * - Low-opacity orbital trajectory arcs
 * - Non-intrusive, high-performance, responsive across all viewports
 */
export default function GlobalCosmicBackground() {
  // Generate deterministic stars across the canvas
  const stars = useMemo(() => {
    const list = [];
    // Seeded pseudo-random generation for stable rendering
    for (let i = 0; i < 90; i++) {
      const x = ((i * 37 + 13) % 100);
      const y = ((i * 73 + 29) % 100);
      const size = (i % 7 === 0) ? 2 : (i % 3 === 0) ? 1.5 : 1;
      const opacity = 0.2 + ((i * 17) % 50) / 100;
      const color = (i % 5 === 0) ? '#7AD7EA' : (i % 8 === 0) ? '#7E78C9' : '#F4F7FC';
      const twinkle = (i % 4 === 0);
      list.push({ id: i, x, y, size, opacity, color, twinkle });
    }
    return list;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Deep Space Navy to Midnight Blue Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#0D1728] to-[#07111F]" />

      {/* 2. Soft Nebula Haze Blooms (Layered Atmospheric Depth) */}
      {/* Cosmic Purple Nebula Bloom (Top-Center) */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[140px] opacity-[0.14] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E78C9 0%, rgba(126, 120, 201, 0.4) 40%, transparent 70%)',
          top: '5%',
          left: '35%',
          transform: 'translate(-50%, -20%)',
        }}
      />

      {/* Soft Cyan Nebula Bloom (Right-Center) */}
      <div
        className="absolute w-[560px] h-[560px] rounded-full blur-[120px] opacity-[0.12] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.3) 45%, transparent 70%)',
          top: '42%',
          right: '-5%',
        }}
      />

      {/* Deep Indigo/Cyan Base Bloom (Bottom-Left) */}
      <div
        className="absolute w-[640px] h-[640px] rounded-full blur-[150px] opacity-[0.10] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E78C9 0%, #132238 60%, transparent 80%)',
          bottom: '2%',
          left: '-8%',
        }}
      />

      {/* 3. Global SVG Orbital Trajectory Lines & Constellation Arcs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="globalOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7AD7EA" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#7E78C9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="globalOrbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7E78C9" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#7AD7EA" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Global Sweeping Orbital Arc 1 */}
        <path
          d="M -100 200 C 500 120, 1200 450, 2050 320"
          stroke="url(#globalOrbitGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />

        {/* Global Sweeping Orbital Arc 2 */}
        <path
          d="M 100 950 C 750 820, 1350 1020, 2000 780"
          stroke="url(#globalOrbitGrad2)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />

        {/* Subtle Constellation Links across the Global Sky */}
        <g stroke="rgba(199, 210, 227, 0.12)" strokeWidth="0.8">
          <line x1="220" y1="180" x2="310" y2="240" />
          <line x1="310" y1="240" x2="420" y2="210" />
          <line x1="1540" y1="620" x2="1620" y2="570" />
          <line x1="1620" y1="570" x2="1740" y2="640" />
          <line x1="1740" y1="640" x2="1830" y2="600" />
        </g>
      </svg>

      {/* 4. Multi-Layered Star Field */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`absolute rounded-full transition-opacity ${
            s.twinkle ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
            boxShadow: s.size > 1.5 ? `0 0 4px ${s.color}` : 'none',
            animationDuration: s.twinkle ? `${3 + (s.id % 4)}s` : undefined,
          }}
        />
      ))}

      {/* 5. Subtle Cinematic Vignette (Preserves text readability at margins) */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#07111F]/30 to-[#07111F]/85" />
    </div>
  );
}
