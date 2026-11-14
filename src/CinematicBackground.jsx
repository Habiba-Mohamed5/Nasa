import React from 'react';
import { assetPath } from './utils/assetPath';

/**
 * Pixel-Accurate Unified Cinematic Hero Cosmic Background
 * Strict 6-Layer Architecture:
 * - Layer 1: Deep-space blue background base (#07111F / #0D1728)
 * - Layer 2: Static realistic starfield artwork (cosmic_deep_space_starfield.webp)
 *            Seamlessly extends fine, realistic pinpoint stars, stellar clusters,
 *            and interstellar cosmic dust across Left (astronaut), Center, and Right (headline & CTAs).
 * - Layer 3: Subtle atmospheric nebula gradients (soft cyan #7AD7EA & cosmic purple #7E78C9)
 * - Layer 4: Decorative orbital lines and planetary crescent with warm rust rim lighting
 * - Layer 5: (Mounted above in HomePage: Transparent isolated astronaut image)
 * - Layer 6: (Mounted above in HomePage: Hero headline, buttons, and navigation)
 *
 * Performance: 100% hardware-accelerated static imagery and SVG, zero procedural star loops, zero scrolling lag.
 */
export default function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ─────────────────────────────────────────────────────────────
          Layer 1: Deep-Space Blue Background Base
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#07111F]" />

      {/* ─────────────────────────────────────────────────────────────
          Layer 2: Subtle Atmospheric Gradients & Nebula Haze
          Provides cosmic color depth (soft cyan & purple) underneath stars
      ───────────────────────────────────────────────────────────── */}
      {/* Primary Radial Cosmic Gradient */}
      <div
        className="absolute inset-0 bg-radial from-[#7E78C9]/20 via-[#0D1728]/60 to-[#07111F]"
        style={{ backgroundPosition: '45% 35%', backgroundSize: '110% 110%' }}
      />

      {/* Atmospheric Soft Cyan Nebula (Center-Right behind Title) */}
      <div
        className="absolute w-[680px] h-[550px] rounded-full opacity-[0.16] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.20) 45%, transparent 70%)',
          top: '15%',
          right: '5%',
        }}
      />

      {/* Deep Cosmic Purple Nebula (Upper-Right behind Nav & Metrics) */}
      <div
        className="absolute w-[580px] h-[500px] rounded-full opacity-[0.18] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E78C9 0%, rgba(126, 120, 201, 0.25) 45%, transparent 70%)',
          top: '-10%',
          right: '15%',
        }}
      />

      {/* Left Cosmic Glow balancing Astronaut silhouette */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full opacity-[0.14] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.15) 40%, transparent 70%)',
          bottom: '-10%',
          left: '5%',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          Layer 3: Static Authentic Starfield Artwork (Full-Hero Span)
          Spans Left, Center, and Right seamlessly behind Astronaut,
          Headline, CTAs, and Navigation with high visual fidelity.
      ───────────────────────────────────────────────────────────── */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source srcSet={assetPath('cosmic_deep_space_starfield.webp')} type="image/webp" />
        <img
          src={assetPath('cosmic_deep_space_starfield.jpg')}
          alt=""
          className="w-full h-full object-cover object-center opacity-95 mix-blend-screen"
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* ─────────────────────────────────────────────────────────────
          Layer 4: Decorative Orbital Lines & Planetary Crescent
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
        </defs>

        {/* Diffuse Atmospheric Glow behind the crescent */}
        <circle cx="580" cy="420" r="380" fill="url(#planetGlow)" />

        {/* Majestic Planetary Crescent Arc */}
        <path
          d="M 260 880 C 420 540, 520 280, 840 80"
          stroke="url(#arcGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Secondary Thin Trajectory Line Crossing from Astronaut to Title */}
        <path
          d="M 120 720 C 400 480, 820 440, 1380 240"
          stroke="url(#orbitAcross)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Tertiary Distant Orbital Arc */}
        <path
          d="M 620 900 C 800 680, 1060 480, 1420 380"
          stroke="url(#orbitAcross)"
          strokeWidth="1.0"
          strokeDasharray="6 8"
          opacity="0.6"
        />

        {/* Constellation Cluster 1 (Left behind Astronaut shoulder) */}
        <g stroke="rgba(199, 210, 227, 0.20)" strokeWidth="0.75">
          <line x1="720" y1="360" x2="890" y2="330" />
          <line x1="890" y1="330" x2="980" y2="380" />
          <line x1="890" y1="330" x2="840" y2="480" />
          <line x1="720" y1="360" x2="760" y2="440" />
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
            <circle cx={cx} cy={cy} r={r * 2.0} fill="#7AD7EA" opacity="0.25" />
            <circle cx={cx} cy={cy} r={r} fill="#F4F7FC" opacity="0.9" />
          </g>
        ))}
      </svg>

      {/* Floating Deep Space Navigation Coordinates */}
      <div className="hidden lg:block absolute top-20 right-16 text-[9px] font-mono-tech text-[#7AD7EA]/40 tracking-widest select-none pointer-events-none space-y-1 text-right">
        <div>ORBIT // 28.5721° N, 80.6480° W</div>
        <div>APOGEE: 408 KM • PERIGEE: 402 KM</div>
        <div className="text-[#98A7BD]/30">DSN KA-BAND: LOCK ACQUIRED</div>
      </div>
    </div>
  );
}
