import React from 'react';

/**
 * Modern Aerospace Glass HUD Canopy
 * Inspired by SpaceX Crew Dragon & NASA Orion Glass Cockpit.
 * Replaces heavy rivets with clean HUD reticles, subtle corner brackets, and atmospheric emergency flare.
 */
export default function CockpitInteriorFrame({ isAlert = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {/* 1. Subtle High-Tech Starship HUD Corner Brackets */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg" />

      {/* 2. Glass Sheen & Aerospace Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/[0.02] to-white/[0.04]" />

      {/* 3. Subtle Cybernetic Crosshair Reticle in Center-Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/10 rounded-full opacity-60 hidden md:block" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/5 rounded-full opacity-40 hidden md:block" />

      {/* 4. Emergency Ambient Flare */}
      {isAlert && (
        <div className="absolute inset-0 bg-rose-600/15 animate-pulse mix-blend-overlay z-10" />
      )}
    </div>
  );
}
