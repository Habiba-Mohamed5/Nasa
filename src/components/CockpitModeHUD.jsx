import React from 'react';
import {
  Compass, Radio, Zap, Volume2, VolumeX,
  Eye, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Shield, Activity, Gauge
} from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

/**
 * CockpitModeHUD — Immersive Spacecraft 404 Bridge & Observation Deck
 *
 * Inspired by modern exploration cupolas (Image 1 reference):
 * - Panoramic forward and overhead structural window pillars
 * - Flight telemetry dashboard (Velocity, Heading, DSN Link, Cabin Atmosphere)
 * - Camera mode switcher (Cockpit / External 3D Vessel / Planet Orbit)
 * - Integrated sound controls & volume slider
 * - Mobile touch flight controls (thrust & yaw)
 */
export default function CockpitModeHUD({
  cameraMode,
  onCameraModeChange,
  targetBody,
  flightVelocity = 34.8,
  isAccelerating = false,
  isMuted = true,
  onToggleMute,
  onThrustForward,
  onThrustReverse,
  onSteerLeft,
  onSteerRight
}) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between overflow-hidden">

      {/* ─────────────────────────────────────────────────────────────
          1. COCKPIT OBSERVATION WINDOW FRAME (Cockpit Mode Only)
          Panoramic structural pillars framing space like Image 1
      ───────────────────────────────────────────────────────────── */}
      {cameraMode === 'cockpit' && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="frameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#0F172A" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="frameHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7AD7EA" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#F4F7FC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7AD7EA" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Top Overhead Window Sill & Roof Canopy */}
          <path
            d="M 0 0 L 1440 0 L 1440 45 L 1150 75 L 850 50 L 590 50 L 290 75 L 0 45 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.15)"
            strokeWidth="1.5"
          />

          {/* Overhead Ceiling Structural Ribs */}
          <line x1="590" y1="0" x2="590" y2="50" stroke="#334155" strokeWidth="6" />
          <line x1="850" y1="0" x2="850" y2="50" stroke="#334155" strokeWidth="6" />

          {/* Left A-Pillar (Window divider) */}
          <path
            d="M 290 75 L 340 75 L 310 750 L 250 750 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.12)"
            strokeWidth="1.5"
          />

          {/* Right A-Pillar (Window divider) */}
          <path
            d="M 1150 75 L 1100 75 L 1130 750 L 1190 750 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.12)"
            strokeWidth="1.5"
          />

          {/* Left Far Wall Frame */}
          <path
            d="M 0 0 L 70 0 L 70 900 L 0 900 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.15)"
            strokeWidth="1.5"
          />

          {/* Right Far Wall Frame */}
          <path
            d="M 1370 0 L 1440 0 L 1440 900 L 1370 900 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.15)"
            strokeWidth="1.5"
          />

          {/* Forward Bottom Console Deck Sill */}
          <path
            d="M 0 900 L 0 770 L 250 750 L 450 775 L 990 775 L 1190 750 L 1440 770 L 1440 900 Z"
            fill="url(#frameGrad)"
            stroke="rgba(180, 210, 235, 0.20)"
            strokeWidth="2"
          />

          {/* Console Bezel Neon Edge */}
          <line x1="450" y1="775" x2="990" y2="775" stroke="url(#frameHighlight)" strokeWidth="2.5" />
        </svg>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. TOP FLIGHT HUD BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3 sm:p-5 flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Vessel Identity & Camera Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-[rgba(180,210,235,0.18)] text-xs font-mono-tech text-[#F4F7FC]">
            <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-pulse" />
            <strong className="font-titan text-sm tracking-wider">404</strong>
            <span className="text-[#7AD7EA] hidden sm:inline">// DEEP SPACE EXPLORER</span>
          </div>

          {/* 3 Camera Modes */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono-tech font-bold">
            <button
              onClick={() => {
                spaceAudio.playBeep(920, 0.05);
                onCameraModeChange('cockpit');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                cameraMode === 'cockpit'
                  ? 'bg-[#7AD7EA] text-[#07111F] shadow-[0_0_10px_rgba(122,215,234,0.4)]'
                  : 'text-[#98A7BD] hover:text-[#F4F7FC]'
              }`}
            >
              COCKPIT
            </button>
            <button
              onClick={() => {
                spaceAudio.playBeep(920, 0.05);
                onCameraModeChange('external');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                cameraMode === 'external'
                  ? 'bg-[#7AD7EA] text-[#07111F] shadow-[0_0_10px_rgba(122,215,234,0.4)]'
                  : 'text-[#98A7BD] hover:text-[#F4F7FC]'
              }`}
            >
              3D VESSEL
            </button>
            <button
              onClick={() => {
                spaceAudio.playBeep(920, 0.05);
                onCameraModeChange('orbit');
              }}
              className={`px-2.5 py-1 rounded-full transition-all ${
                cameraMode === 'orbit'
                  ? 'bg-[#7AD7EA] text-[#07111F] shadow-[0_0_10px_rgba(122,215,234,0.4)]'
                  : 'text-[#98A7BD] hover:text-[#F4F7FC]'
              }`}
            >
              PLANET ORBIT
            </button>
          </div>
        </div>

        {/* Right: Cabin Status, Audio Control & Flight Velocity */}
        <div className="flex items-center gap-2">
          {/* Cabin Life Support Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-white/10 text-[11px] font-mono-tech text-[#C7D2E3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33FF66]" />
            <span>CABIN: 14.7 PSI</span>
            <span className="text-[#98A7BD]">•</span>
            <span className="text-[#7AD7EA]">O₂ 21%</span>
          </div>

          {/* Velocity Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-white/10 text-xs font-mono-tech">
            <Gauge size={13} className="text-[#7AD7EA]" />
            <span className="text-[#98A7BD]">VELOCITY:</span>
            <strong className="text-[#F4F7FC]">{flightVelocity.toFixed(1)} KM/S</strong>
            {isAccelerating && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#E4783B] text-[#07111F] font-bold animate-pulse">
                THRUST
              </span>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono-tech transition-all shadow-md ${
              !isMuted
                ? 'bg-[#182A44] text-[#7AD7EA] border-[#7AD7EA]/40'
                : 'bg-[#0D1728]/80 text-[#98A7BD] border-white/10 hover:border-white/20'
            }`}
            title={isMuted ? 'Enable Spacecraft Audio' : 'Mute Audio'}
          >
            {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{!isMuted ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CENTER COCKPIT CROSSHAIR / TARGETING RETICLE
      ───────────────────────────────────────────────────────────── */}
      {cameraMode === 'cockpit' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="relative w-36 h-36 border border-[#7AD7EA]/30 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7AD7EA]" />
            <div className="absolute w-full h-[1px] bg-[#7AD7EA]/20" />
            <div className="absolute h-full w-[1px] bg-[#7AD7EA]/20" />
            <div className="absolute -top-4 text-[9px] font-mono-tech text-[#7AD7EA]">
              BEARING LOCK // {targetBody?.name?.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Only On-Screen Steering Arrows (Visible only on touch screens < 1024px) */}
      <div className="lg:hidden absolute bottom-16 left-3 z-30 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0D1728]/90 border border-white/10 shadow-lg">
          <button
            onClick={onSteerLeft}
            className="p-2 rounded-xl bg-[#132238] active:bg-[#7AD7EA] active:text-[#07111F] text-[#7AD7EA]"
            title="Previous Target (Left)"
            aria-label="Previous Target"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={onThrustForward}
            className="p-2 rounded-xl bg-[#E4783B] text-[#07111F] font-bold active:scale-95 shadow-md"
            title="Thrust Forward"
            aria-label="Thrust Forward"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={onThrustReverse}
            className="p-2 rounded-xl bg-[#132238] active:bg-[#7AD7EA] active:text-[#07111F] text-[#7AD7EA]"
            title="Decelerate"
            aria-label="Decelerate"
          >
            <ArrowDown size={16} />
          </button>
          <button
            onClick={onSteerRight}
            className="p-2 rounded-xl bg-[#132238] active:bg-[#7AD7EA] active:text-[#07111F] text-[#7AD7EA]"
            title="Next Target (Right)"
            aria-label="Next Target"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
