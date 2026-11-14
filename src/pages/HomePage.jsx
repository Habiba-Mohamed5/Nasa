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
    <div className="space-y-8 sm:space-y-12">
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN CINEMATIC HERO COMPOSITION
          Responsive Architecture:
          - Desktop (lg:): Exact Dribbble reference composition (Astronaut on left, Title on right, 01/02/03 on far right, 3 columns bottom).
          - Mobile/Tablet (< lg): Vertical, intentional art direction (Title top, Astronaut center stage, Buttons, 3-block grid).
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative w-full rounded-2xl sm:rounded-[36px] overflow-hidden cinematic-card-bg border border-[rgba(180,210,235,0.14)] shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between min-h-[620px] lg:h-[88vh] lg:min-h-[720px] lg:max-h-[920px]"
      >
        {/* Layer 0: Planetary Crescent & Constellation Lines */}
        <CinematicBackground />

        {/* Layer 1: Top Navigation Bar INSIDE the Card */}
        <Navbar
          isMuted={isMuted}
          toggleSound={toggleSound}
          toggleFullScreen={toggleFullScreen}
          onOpenAiDrawer={onOpenAiDrawer}
          onOpenRisksModal={onOpenRisksModal}
        />

        {/* ─────────────────────────────────────────────────────────────
            Layer 2A: DESKTOP HERO VIEWPORT (Visible on >= lg screens)
        ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex relative z-20 flex-1 items-center justify-between px-8 lg:px-14 overflow-hidden py-4">
          
          {/* Left Photographic Subject: The Space Astronaut */}
          <div className="absolute left-0 bottom-0 top-0 w-[48%] max-w-[560px] pointer-events-none select-none flex items-end justify-start animate-astronaut-float">
            {visualMode === 'cinematic' ? (
              <div className="relative w-full h-[95%] flex items-end justify-start">
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
          <div className="relative z-30 ml-auto w-[50%] lg:w-[47%] xl:w-[46%] flex flex-col justify-center pl-4 lg:pl-8 pr-3 lg:pr-8">
            {/* Display Headline in Titan One */}
            <h1 className="font-titan text-5xl lg:text-[60px] xl:text-[76px] 2xl:text-[86px] text-[#F4F7FC] uppercase leading-[0.92] tracking-tight drop-shadow-2xl select-none">
              SPACE<br />
              ASTRONAUT
            </h1>

            {/* Editorial Subtitle Paragraph (High Readability) */}
            <p className="text-[#C7D2E3] text-xs sm:text-sm font-sans max-w-md mt-5 sm:mt-6 leading-relaxed font-normal">
              The Ongoing Discovery And Exploration Of Celestial Structures In Outer Space By Means Of Continuously Evolving And Growing Space Technology.
            </p>

            {/* Actions & View Switcher */}
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-7">
              <Link
                to="/workspace"
                onClick={() => spaceAudio.playChirp()}
                className="px-6 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(228,120,59,0.35)] hover:scale-105 flex items-center gap-1.5 min-h-[44px]"
              >
                <span>ENTER WORKSPACE</span>
                <ChevronRight size={14} />
              </Link>

              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  if (onOpenAiDrawer) onOpenAiDrawer();
                }}
                className="px-5 py-2.5 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#F4F7FC] border border-[#7AD7EA]/30 font-bold text-xs tracking-wider transition-all flex items-center gap-2 min-h-[44px] shadow-[0_0_15px_rgba(122,215,234,0.1)] hover:scale-105"
              >
                <Bot size={14} className="text-[#7AD7EA]" />
                <span>AURA SURGEON</span>
              </button>

              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  setVisualMode(visualMode === 'cinematic' ? '3d' : 'cinematic');
                }}
                className="text-[11px] text-[#98A7BD] hover:text-[#7AD7EA] underline font-mono-tech ml-1"
                title="Toggle between Photographic and 3D Viewport"
              >
                View: {visualMode === 'cinematic' ? 'Photo' : '3D Zero-G'}
              </button>
            </div>
          </div>

          {/* Far Right Edge: Numbered State Indicator (01, 02, 03) */}
          <div className="relative z-30 flex flex-col items-center gap-3 text-xs font-mono-tech pl-4 select-none shrink-0">
            <span className="w-3.5 h-[1px] bg-white/20" />
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setActiveHeroIndicator('01');
              }}
              className={`transition-all ${
                activeHeroIndicator === '01'
                  ? 'text-[#F4F7FC] font-bold scale-110 drop-shadow-[0_0_8px_rgba(122,215,234,0.5)]'
                  : 'text-[#98A7BD] hover:text-[#C7D2E3]'
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
              className="text-[#98A7BD] hover:text-[#F4F7FC] transition-all"
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
              className="text-[#98A7BD] hover:text-[#F4F7FC] transition-all"
              title="Go to AURA AI Identity (03)"
            >
              03
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            Layer 2B: MOBILE & TABLET HERO VIEWPORT (Visible on < lg screens)
            Intentional Vertical Art Direction:
            - Clear Headline on top
            - Centered Astronaut in dedicated visual stage
            - Subtitle & Action CTAs within thumb reach
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:hidden relative z-20 flex-1 flex flex-col items-center justify-between px-4 sm:px-6 py-3 overflow-hidden text-center">
          
          {/* Top Text Cluster: Headline & Subtitle */}
          <div className="space-y-2 max-w-md mx-auto pt-1">
            <h1 className="font-titan text-3xl sm:text-4xl md:text-5xl text-[#F4F7FC] uppercase leading-[0.95] tracking-tight drop-shadow-2xl">
              SPACE ASTRONAUT
            </h1>
            <p className="text-[11px] sm:text-xs text-[#C7D2E3] font-sans leading-relaxed px-2">
              The Ongoing Discovery And Exploration Of Celestial Structures In Outer Space By Means Of Continuously Evolving Space Technology.
            </p>
          </div>

          {/* Center Stage: The Space Astronaut (Unobscured & Beautifully Framed) */}
          <div className="relative w-full h-[240px] sm:h-[320px] md:h-[380px] flex items-center justify-center my-2 pointer-events-none animate-astronaut-float">
            {visualMode === 'cinematic' ? (
              <img
                src={
                  assetPath(
                    astronautAsset === 'reference'
                      ? 'astronaut_feathered_clean.png'
                      : 'astronaut_cinema_feathered.png'
                  )
                }
                alt="Cinematic Space Astronaut"
                className="w-auto h-full max-h-[240px] sm:max-h-[320px] md:max-h-[380px] object-contain object-bottom filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />
            ) : (
              <div className="w-full h-full pointer-events-auto flex items-center justify-center">
                <Astronaut3D
                  telemetry={telemetry}
                  scanMode={scanMode}
                  setScanMode={setScanMode}
                />
              </div>
            )}
          </div>

          {/* Action CTAs Cluster (Touch-friendly minimum 46px) */}
          <div className="w-full max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 px-2">
            <Link
              to="/workspace"
              onClick={() => spaceAudio.playChirp()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)] flex items-center justify-center gap-1.5 min-h-[46px]"
            >
              <span>ENTER WORKSPACE</span>
              <ChevronRight size={14} />
            </Link>

            <button
              onClick={() => {
                spaceAudio.playChirp();
                if (onOpenAiDrawer) onOpenAiDrawer();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#F4F7FC] border border-[#7AD7EA]/30 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 min-h-[46px] shadow-[0_0_15px_rgba(122,215,234,0.1)]"
            >
              <Bot size={14} className="text-[#7AD7EA]" />
              <span>AURA SURGEON</span>
            </button>

            <button
              onClick={() => {
                spaceAudio.playChirp();
                setVisualMode(visualMode === 'cinematic' ? '3d' : 'cinematic');
              }}
              className="text-[10px] text-[#98A7BD] hover:text-[#7AD7EA] underline font-mono-tech py-1"
            >
              View: {visualMode === 'cinematic' ? 'Photo' : '3D Zero-G'}
            </button>
          </div>

          {/* Mobile Horizontal Section Indicator */}
          <div className="flex items-center justify-center gap-4 text-xs font-mono-tech pt-3 select-none">
            <span className="text-[#F4F7FC] font-bold border-b-2 border-[#7AD7EA] pb-0.5">01 HERO</span>
            <Link to="/workspace" className="text-[#98A7BD] hover:text-[#7AD7EA]">02 WORKSPACE</Link>
            <Link to="/ai-identity" className="text-[#98A7BD] hover:text-[#7AD7EA]">03 AURA AI</Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            Layer 3: Lower Editorial Tri-Column Information Blocks
            - On Desktop: Clean row matching Dribbble reference.
            - On Mobile: Responsive grid with touch-friendly cards.
        ───────────────────────────────────────────────────────────── */}
        <div className="relative z-30 px-4 sm:px-8 lg:px-14 pb-4 sm:pb-7 pt-3.5 border-t border-[rgba(180,210,235,0.14)] flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 shrink-0">
          
          {/* Celestial 3-Block Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 flex-1">
            {/* Block 1: THE MOON */}
            <Link
              to="/planets#moon"
              onClick={() => {
                spaceAudio.playChirp();
                if (setCurrentPhase) setCurrentPhase(MISSION_PHASES[0]);
              }}
              className="group text-left p-2.5 sm:p-0 rounded-xl bg-[#132238]/60 sm:bg-transparent border border-[rgba(180,210,235,0.12)] sm:border-0 hover:bg-[#182A44]/40 transition-colors"
            >
              <h3 className="text-xs font-bold text-[#F4F7FC] group-hover:text-[#7AD7EA] uppercase tracking-wider font-sans mb-1 transition-colors flex items-center justify-between sm:block">
                <span>THE MOON</span>
                <ChevronRight size={12} className="sm:hidden text-[#98A7BD]" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#C7D2E3] group-hover:text-[#F4F7FC] max-w-[210px] leading-relaxed font-sans transition-colors">
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
              className="group text-left p-2.5 sm:p-0 rounded-xl bg-[#132238]/60 sm:bg-transparent border border-[rgba(180,210,235,0.12)] sm:border-0 hover:bg-[#182A44]/40 transition-colors"
            >
              <h3 className="text-xs font-bold text-[#F4F7FC] group-hover:text-[#7AD7EA] uppercase tracking-wider font-sans mb-1 transition-colors flex items-center justify-between sm:block">
                <span>THE SUN</span>
                <ChevronRight size={12} className="sm:hidden text-[#98A7BD]" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#C7D2E3] group-hover:text-[#F4F7FC] max-w-[210px] leading-relaxed font-sans transition-colors">
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
              className="group text-left p-2.5 sm:p-0 rounded-xl bg-[#132238]/60 sm:bg-transparent border border-[rgba(180,210,235,0.12)] sm:border-0 hover:bg-[#182A44]/40 transition-colors"
            >
              <h3 className="text-xs font-bold text-[#F4F7FC] group-hover:text-[#7AD7EA] uppercase tracking-wider font-sans mb-1 transition-colors flex items-center justify-between sm:block">
                <span>MARS</span>
                <ChevronRight size={12} className="sm:hidden text-[#98A7BD]" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#C7D2E3] group-hover:text-[#F4F7FC] max-w-[210px] leading-relaxed font-sans transition-colors">
                Mars Has Been An Important Part Of The Space Exploration
              </p>
            </Link>
          </div>

          {/* Interactive Trajectory Scrub Slider */}
          <div className="w-full lg:w-56 flex flex-col gap-1 items-start lg:items-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[rgba(180,210,235,0.14)]">
            <span className="text-[9px] font-mono-tech text-[#98A7BD] uppercase">
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
              className="w-full h-1.5 bg-[#132238] rounded-lg appearance-none cursor-pointer accent-[#7AD7EA]"
              aria-label="Mission Trajectory Day Scrub Slider"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PLATFORM OVERVIEW & ARCHITECTURAL HIGHLIGHTS
          Mobile-friendly 1-col on phone, 2-col on tablet, 4-col on desktop
      ───────────────────────────────────────────────────────────── */}
      <section id="readiness" className="px-3 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[rgba(180,210,235,0.14)] pb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest block mb-1">
              MISSION READINESS & BIO-DIGITAL TWIN
            </span>
            <h2 className="font-titan text-2xl sm:text-3xl text-[#F4F7FC] tracking-wide uppercase">
              AUTONOMOUS DEEP SPACE HEALTHCARE
            </h2>
          </div>
          <p className="text-xs text-[#C7D2E3] max-w-md leading-relaxed">
            During Mars Transit, communication delay to Earth exceeds 22 minutes. AstroVitals provides the onboard crew with zero-latency autonomous medical diagnosis and countermeasure execution.
          </p>
        </div>

        {/* 4 Feature Pillar Cards */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AURA */}
          <div className="p-5 rounded-2xl bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7E78C9]/60 hover:shadow-[0_10px_30px_rgba(7,17,31,0.8),0_0_20px_rgba(126,120,201,0.2)] transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#7E78C9]/20 border border-[#7E78C9]/40 flex items-center justify-center text-[#7E78C9]">
              <Bot size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#7E78C9] transition-colors font-sans">
              AURA Flight Surgeon
            </h3>
            <p className="text-[11px] text-[#C7D2E3] leading-relaxed">
              Autonomous neural clinical copilot calibrated against NASA-STD-3001 and HRP evidence roadmaps for offline edge inference.
            </p>
            <Link to="/ai-identity" className="inline-flex items-center gap-1 text-[11px] text-[#7AD7EA] font-bold hover:underline pt-1 min-h-[36px]">
              <span>Inspect AI Core</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 2: Bio-Digital Twin */}
          <div className="p-5 rounded-2xl bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/60 hover:shadow-[0_10px_30px_rgba(7,17,31,0.8),0_0_20px_rgba(122,215,234,0.2)] transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#7AD7EA] transition-colors font-sans">
              Bio-Digital Twin
            </h3>
            <p className="text-[11px] text-[#C7D2E3] leading-relaxed">
              Real-time Doppler echocardiogram, trabecular micro-architecture DEXA, and SANS optic sheath ultrasound monitors.
            </p>
            <Link to="/workspace" className="inline-flex items-center gap-1 text-[11px] text-[#7AD7EA] font-bold hover:underline pt-1 min-h-[36px]">
              <span>View Live Telemetry</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 3: Countermeasures */}
          <div className="p-5 rounded-2xl bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#E4783B]/60 hover:shadow-[0_10px_30px_rgba(7,17,31,0.8),0_0_20px_rgba(228,120,59,0.2)] transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B]">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#E4783B] transition-colors font-sans">
              ARED & Countermeasures
            </h3>
            <p className="text-[11px] text-[#C7D2E3] leading-relaxed">
              Closed-loop resistive exercise loading, lower body negative pressure (LBNP), and electrolyte fluid restoration.
            </p>
            <Link to="/features" className="inline-flex items-center gap-1 text-[11px] text-[#7AD7EA] font-bold hover:underline pt-1 min-h-[36px]">
              <span>Protocol Specs</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 4: DSN Simulation */}
          <div className="p-5 rounded-2xl bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/60 hover:shadow-[0_10px_30px_rgba(7,17,31,0.8),0_0_20px_rgba(122,215,234,0.2)] transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
              <Radio size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#F4F7FC] group-hover:text-[#7AD7EA] transition-colors font-sans">
              DSN Blackout Simulation
            </h3>
            <p className="text-[11px] text-[#C7D2E3] leading-relaxed">
              High-fidelity simulation of deep space radio latency, autonomous emergency overrides, and encrypted 50KB DSN packets.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-1 text-[11px] text-[#7AD7EA] font-bold hover:underline pt-1 min-h-[36px]">
              <span>How It Works</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CALL TO ACTION: EXPLORE MISSION COCKPIT
      ───────────────────────────────────────────────────────────── */}
      <section id="cockpit-cta" className="px-3 sm:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#132238] via-[#182A44] to-[#132238] border border-[rgba(180,210,235,0.18)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-titan text-lg sm:text-2xl text-[#F4F7FC] uppercase">
              READY TO COMMENCE MISSION READINESS EVALUATION?
            </h3>
            <p className="text-xs text-[#C7D2E3] max-w-lg leading-relaxed">
              Launch the full 3D interactive Zero-G cockpit to inspect astronaut vitals, review NASA standard threshold rules, and simulate emergency interventions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/workspace"
              onClick={() => spaceAudio.playChirp()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)] min-h-[46px] flex items-center justify-center"
            >
              LAUNCH MISSION CONTROL
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#0D1728] hover:bg-[#132238] text-[#F4F7FC] border border-[rgba(180,210,235,0.22)] text-xs font-bold transition-all min-h-[46px] flex items-center justify-center hover:scale-105"
            >
              READ MISSION BRIEF
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
