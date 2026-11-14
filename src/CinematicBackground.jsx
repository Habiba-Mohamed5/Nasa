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
          Provides cosmic depth while keeping negative space calm & dark
      ───────────────────────────────────────────────────────────── */}
      {/* Primary Radial Cosmic Gradient */}
      <div
        className="absolute inset-0 bg-radial from-[#7E78C9]/10 via-[#0D1728]/40 to-[#07111F]"
        style={{ backgroundPosition: '45% 35%', backgroundSize: '110% 110%' }}
      />

      {/* Calming Atmospheric Nebula (Upper Center) */}
      <div
        className="absolute w-[600px] h-[480px] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.15) 45%, transparent 70%)',
          top: '10%',
          right: '15%',
        }}
      />

      {/* Deep Cosmic Purple Nebula (Upper Right) */}
      <div
        className="absolute w-[500px] h-[420px] rounded-full opacity-[0.09] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7E78C9 0%, rgba(126, 120, 201, 0.20) 45%, transparent 70%)',
          top: '-15%',
          right: '25%',
        }}
      />

      {/* Left Cosmic Glow framing Astronaut silhouette */}
      <div
        className="absolute w-[460px] h-[460px] rounded-full opacity-[0.10] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.12) 40%, transparent 70%)',
          bottom: '-10%',
          left: '5%',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          Layer 3: Static Authentic Starfield Artwork (Tuned Density +25%)
          Controlled 25% increase in visible star presence for rich astronomical depth
      ───────────────────────────────────────────────────────────── */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <source srcSet={assetPath('cosmic_deep_space_starfield.webp')} type="image/webp" />
        <img
          src={assetPath('cosmic_deep_space_starfield.jpg')}
          alt=""
          className="w-full h-full object-cover object-center opacity-52 mix-blend-screen"
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* Dark Readability Vignette directly behind Headline and Copy (Center-Right) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 72% 45%, rgba(7, 17, 31, 0.88) 0%, rgba(7, 17, 31, 0.55) 55%, transparent 85%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          Layer 4: Subtle Decorative Accents (Preserving Astronaut separation)
          Orbital lines stay strictly away from crossing important text
      ───────────────────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Warm Edge Accent framing Astronaut on the left */}
          <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4783B" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#C85A27" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#7E78C9" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
          </linearGradient>

          {/* Diffuse Atmospheric Halo Gradient */}
          <radialGradient id="planetGlow" cx="30%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#7AD7EA" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#7E78C9" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Diffuse Glow behind astronaut */}
        <circle cx="320" cy="480" r="320" fill="url(#planetGlow)" />

        {/* Gentle Planetary Crescent Arc - positioned strictly behind Astronaut on the left */}
        <path
          d="M 160 880 C 260 620, 310 380, 480 120"
          stroke="url(#arcGlow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Delicate Constellation Star Nodes in deep background */}
        {[
          [820, 220, 1.8], [940, 180, 1.5], [1080, 240, 1.8], [1180, 190, 1.4], [1280, 230, 1.6]
        ].map(([cx, cy, r], idx) => (
          <g key={`constel-node-${idx}`}>
            <circle cx={cx} cy={cy} r={r * 1.8} fill="#7AD7EA" opacity="0.15" />
            <circle cx={cx} cy={cy} r={r} fill="#F4F7FC" opacity="0.7" />
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
