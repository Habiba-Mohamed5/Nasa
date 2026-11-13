import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Activity, Zap, CheckCircle2, Eye, ShieldAlert,
  ArrowRight, Radio, Compass, Sliders, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CinematicBackground from '../CinematicBackground';
import Astronaut3D from '../Astronaut3D';
import { MISSION_PHASES } from '../UserJourneyStepper';
import { spaceAudio } from '../utils/spaceAudio';
import { assetPath } from '../utils/assetPath';

export default function HomePage({
  telemetry,
  missionDay,
  setMissionDay,
  currentPhase,
  setCurrentPhase,
  countermeasureApplied,
  handleApplyCountermeasure,
  isCommBlackout,
  handleToggleBlackout,
  scanMode,
  setScanMode,
  isMuted,
  toggleSound,
  toggleFullScreen,
  onOpenAiDrawer,
  onOpenRisksModal
}) {
  // Visual Mode: 'cinematic' (Reference Photo) | '3d' (Interactive Three.js Canvas)
  const [visualMode, setVisualMode] = useState('cinematic');
  const [activeHeroIndicator, setActiveHeroIndicator] = useState('01');
  const [astronautAsset, setAstronautAsset] = useState('reference');

  return (
    <div className="space-y-12">
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN CINEMATIC HERO COMPOSITION (Matching Reference Image)
          A single floating card containing:
          - Top: Integrated Header (Logo & Nav Menu)
          - Center: Astronaut Subject + Titan Typography + 01/02/03 Indicator
          - Bottom: Editorial Tri-Column (THE MOON, THE SUN, MARS)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[720px] lg:h-[88vh] max-h-[920px] rounded-2xl sm:rounded-[36px] overflow-hidden cinematic-card-bg border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between">
        {/* Layer 0: Planetary Crescent & Constellation Lines */}
        <CinematicBackground />

        {/* Layer 1: Top Navigation Bar INSIDE the Card (Exact Reference Placement) */}
        <Navbar
          isMuted={isMuted}
          toggleSound={toggleSound}
          toggleFullScreen={toggleFullScreen}
          onOpenAiDrawer={onOpenAiDrawer}
          onOpenRisksModal={onOpenRisksModal}
        />

        {/* Layer 2: Main Hero Viewport */}
        <div className="relative z-20 flex-1 flex items-center justify-between px-6 sm:px-10 lg:px-14 overflow-hidden py-2 sm:py-4">
          
          {/* Left Photographic Subject: The Space Astronaut */}
          <div className="absolute left-0 bottom-0 top-0 w-[50%] max-w-[560px] pointer-events-none select-none flex items-end justify-start">
            {visualMode === 'cinematic' ? (
              <div className="relative w-full h-[95%] flex items-end justify-start">
                {/* Astronaut Image with Warm Burnt-Orange Highlights */}
                <img
                  src={
                    assetPath(
                      astronautAsset === 'reference'
                        ? 'astronaut_feathered_clean.png'
                        : 'astronaut_cinema_feathered.png'
                    )
                  }
                  alt="Cinematic Space Astronaut"
                  className="w-auto h-full max-h-[580px] lg:max-h-[640px] object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                />
              </div>
            ) : (
              <div className="w-full h-[520px] pointer-events-auto flex items-center justify-center">
                <Astronaut3D
                  telemetry={telemetry}
                  scanMode={scanMode}
                  setScanMode={setScanMode}
                />
              </div>
            )}
          </div>

          {/* Center-Right Hero Content: Titan Display Typography & Copy */}
          <div className="relative z-30 ml-auto w-full md:w-[54%] lg:w-[48%] flex flex-col justify-center pl-4 sm:pl-8">
            {/* Display Headline in Titan One */}
            <h1 className="font-titan text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[94px] text-[#EBEBEB] uppercase leading-[0.92] tracking-tight drop-shadow-2xl select-none">
              SPACE<br />
              ASTRONAUT
            </h1>

            {/* Editorial Subtitle Paragraph (Exact Reference Text) */}
            <p className="text-[#ACACAC] text-xs sm:text-sm font-sans max-w-md mt-5 sm:mt-6 leading-relaxed font-normal">
              The Ongoing Discovery And Exploration Of Celestial Structures In Outer Space By Means Of Continuously Evolving And Growing Space Technology.
            </p>

            {/* Actions & Live Telemetry Pill */}
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-7">
              <Link
                to="/workspace"
                onClick={() => spaceAudio.playChirp()}
                className="px-6 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#0D0B0A] font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(228,120,59,0.35)] hover:scale-105 flex items-center gap-1.5"
              >
                <span>ENTER WORKSPACE</span>
                <ChevronRight size={14} />
              </Link>

              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  if (onOpenAiDrawer) onOpenAiDrawer();
                }}
                className="px-5 py-2.5 rounded-full bg-[#171311] hover:bg-[#252121] text-[#EBEBEB] border border-white/10 font-bold text-xs tracking-wider transition-all flex items-center gap-2"
              >
                <Bot size={14} className="text-[#E4783B]" />
                <span>AURA SURGEON</span>
              </button>

              {/* 3D / Photo Mode Switcher */}
              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  setVisualMode(visualMode === 'cinematic' ? '3d' : 'cinematic');
                }}
                className="text-[10px] text-[#808080] hover:text-[#EBEBEB] underline font-mono-tech ml-1"
                title="Toggle between Photographic and 3D Viewport"
              >
                View: {visualMode === 'cinematic' ? 'Photo' : '3D Zero-G'}
              </button>
            </div>
          </div>

          {/* Far Right Edge: Numbered State Indicator (01, 02, 03) */}
          <div className="relative z-30 flex flex-col items-center gap-3 text-xs font-mono-tech pl-4 select-none">
            <span className="w-3.5 h-[1px] bg-white/20" />
            
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setActiveHeroIndicator('01');
              }}
              className={`transition-all ${
                activeHeroIndicator === '01'
                  ? 'text-[#EBEBEB] font-bold scale-110 drop-shadow-[0_0_8px_rgba(240,235,229,0.5)]'
                  : 'text-[#808080] hover:text-[#ACACAC]'
              }`}
            >
              01
            </button>

            <span className="w-3.5 h-[1px] bg-white/20" />

            <Link
              to="/workspace"
              onClick={() => {
                spaceAudio.playChirp();
                setActiveHeroIndicator('02');
              }}
              className="text-[#808080] hover:text-[#EBEBEB] transition-all"
              title="Go to Bio-Telemetry Workspace (02)"
            >
              02
            </Link>

            <span className="w-3.5 h-[1px] bg-white/20" />

            <Link
              to="/ai-identity"
              onClick={() => {
                spaceAudio.playChirp();
                setActiveHeroIndicator('03');
              }}
              className="text-[#808080] hover:text-[#EBEBEB] transition-all"
              title="Go to AURA AI Identity (03)"
            >
              03
            </Link>
          </div>
        </div>

        {/* Layer 2: Lower Editorial Tri-Column Information Blocks (Exact Reference) */}
        <div className="relative z-30 px-6 sm:px-10 lg:px-14 pb-6 sm:pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shrink-0 pt-4 border-t border-white/[0.04]">
          {/* Block 1: THE MOON */}
          <Link
            to="/planets#moon"
            onClick={() => {
              spaceAudio.playChirp();
              if (setCurrentPhase) setCurrentPhase(MISSION_PHASES[0]);
            }}
            className="group text-left"
          >
            <h3 className="text-xs font-bold text-[#EBEBEB] group-hover:text-[#E4783B] uppercase tracking-wider font-sans mb-1 transition-colors">
              THE MOON
            </h3>
            <p className="text-[10px] md:text-[11px] text-[#808080] group-hover:text-[#ACACAC] max-w-[210px] leading-relaxed font-sans transition-colors">
              The First Celestial Body To Be The Object Of Space Exploration
            </p>
          </Link>

          {/* Block 2: THE SUN */}
          <Link
            to="/planets#sun"
            onClick={() => {
              spaceAudio.playChirp();
              if (setCurrentPhase) setCurrentPhase(MISSION_PHASES[1]);
            }}
            className="group text-left"
          >
            <h3 className="text-xs font-bold text-[#EBEBEB] group-hover:text-[#E4783B] uppercase tracking-wider font-sans mb-1 transition-colors">
              THE SUN
            </h3>
            <p className="text-[10px] md:text-[11px] text-[#808080] group-hover:text-[#ACACAC] max-w-[210px] leading-relaxed font-sans transition-colors">
              The Sun Never Been A Major Focus Of Space Exploration
            </p>
          </Link>

          {/* Block 3: MARS */}
          <Link
            to="/planets#mars"
            onClick={() => {
              spaceAudio.playChirp();
              if (setCurrentPhase) setCurrentPhase(MISSION_PHASES[3]);
            }}
            className="group text-left"
          >
            <h3 className="text-xs font-bold text-[#EBEBEB] group-hover:text-[#E4783B] uppercase tracking-wider font-sans mb-1 transition-colors">
              MARS
            </h3>
            <p className="text-[10px] md:text-[11px] text-[#808080] group-hover:text-[#ACACAC] max-w-[210px] leading-relaxed font-sans transition-colors">
              Mars Has Been An Important Part Of The Space Exploration
            </p>
          </Link>

          {/* Interactive Trajectory Scrub Slider */}
          <div className="w-full md:w-56 flex flex-col gap-1 items-start md:items-end">
            <span className="text-[9px] font-mono-tech text-[#808080] uppercase">
              MISSION TRAJECTORY: DAY {missionDay}/500
            </span>
            <input
              type="range"
              min="1"
              max="500"
              value={missionDay}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMissionDay(val);
                if (val % 10 === 0) spaceAudio.playChirp();
              }}
              className="w-full h-1 bg-[#171311] rounded-lg appearance-none cursor-pointer accent-[#E4783B]"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PLATFORM OVERVIEW & ARCHITECTURAL HIGHLIGHTS
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block mb-1">
              MISSION READINESS & BIO-DIGITAL TWIN
            </span>
            <h2 className="font-titan text-2xl sm:text-3xl text-[#EBEBEB] tracking-wide uppercase">
              AUTONOMOUS DEEP SPACE HEALTHCARE
            </h2>
          </div>
          <p className="text-xs text-[#ACACAC] max-w-md leading-relaxed">
            During Mars Transit, communication delay to Earth exceeds 22 minutes. AstroVitals provides the onboard crew with zero-latency autonomous medical diagnosis and countermeasure execution.
          </p>
        </div>

        {/* 4 Feature Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-[#171311] border border-white/[0.06] hover:border-[#E4783B]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B]">
              <Bot size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#EBEBEB] group-hover:text-[#E4783B] transition-colors font-sans">
              AURA Flight Surgeon
            </h3>
            <p className="text-[11px] text-[#808080] leading-relaxed">
              Autonomous neural clinical copilot calibrated against NASA-STD-3001 and HRP evidence roadmaps for offline edge inference.
            </p>
            <Link to="/ai-identity" className="inline-flex items-center gap-1 text-[11px] text-[#E4783B] font-bold hover:underline pt-1">
              <span>Inspect AI Core</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-[#171311] border border-white/[0.06] hover:border-[#E4783B]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B]">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#EBEBEB] group-hover:text-[#E4783B] transition-colors font-sans">
              Bio-Digital Twin
            </h3>
            <p className="text-[11px] text-[#808080] leading-relaxed">
              Real-time Doppler echocardiogram, trabecular micro-architecture DEXA, and SANS optic sheath ultrasound monitors.
            </p>
            <Link to="/workspace" className="inline-flex items-center gap-1 text-[11px] text-[#E4783B] font-bold hover:underline pt-1">
              <span>View Live Telemetry</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-[#171311] border border-white/[0.06] hover:border-[#E4783B]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B]">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#EBEBEB] group-hover:text-[#E4783B] transition-colors font-sans">
              ARED & Countermeasures
            </h3>
            <p className="text-[11px] text-[#808080] leading-relaxed">
              Closed-loop resistive exercise loading, lower body negative pressure (LBNP), and electrolyte fluid restoration.
            </p>
            <Link to="/features" className="inline-flex items-center gap-1 text-[11px] text-[#E4783B] font-bold hover:underline pt-1">
              <span>Protocol Specs</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-[#171311] border border-white/[0.06] hover:border-[#E4783B]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B]">
              <Radio size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#EBEBEB] group-hover:text-[#E4783B] transition-colors font-sans">
              DSN Blackout Simulation
            </h3>
            <p className="text-[11px] text-[#808080] leading-relaxed">
              High-fidelity simulation of deep space radio latency, autonomous emergency overrides, and encrypted 50KB DSN packets.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-1 text-[11px] text-[#E4783B] font-bold hover:underline pt-1">
              <span>How It Works</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CALL TO ACTION: EXPLORE MISSION COCKPIT
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171311] via-[#252121] to-[#171311] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-titan text-xl sm:text-2xl text-[#EBEBEB] uppercase">
              READY TO COMMENCE MISSION READINESS EVALUATION?
            </h3>
            <p className="text-xs text-[#ACACAC] max-w-lg">
              Launch the full 3D interactive Zero-G cockpit to inspect astronaut vitals, review NASA standard threshold rules, and simulate emergency interventions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/workspace"
              onClick={() => spaceAudio.playChirp()}
              className="px-6 py-3 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#0D0B0A] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)]"
            >
              LAUNCH MISSION CONTROL
            </Link>
            <Link
              to="/about"
              className="px-5 py-3 rounded-full bg-[#0D0B0A] hover:bg-white/5 text-[#EBEBEB] border border-white/10 text-xs font-bold transition-all"
            >
              READ MISSION BRIEF
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
