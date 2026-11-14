import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Orbit, Compass, ArrowRightLeft, ZoomIn, ZoomOut,
  RotateCcw, ChevronUp, ChevronDown, ChevronRight, ChevronLeft,
  Activity, ShieldAlert, Thermometer, Globe, Info, Sparkles,
  Heart, Radio, Gauge, User, Volume2, VolumeX, Rocket
} from 'lucide-react';
import ThreeJsSolarSystem from '../components/ThreeJsSolarSystem';
import CockpitModeHUD from '../components/CockpitModeHUD';
import PlanetComparisonModal from '../components/PlanetComparisonModal';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import { spaceAudio } from '../utils/spaceAudio';

/**
 * PlanetsPage — 404 Space Exploration Vessel Mission Deck
 *
 * Implements:
 * 1. Three distinct Camera Modes:
 *    - 'cockpit': Inside the pressurized bridge looking out through panoramic observation pillars
 *    - 'external': 3rd-person view of Spaceship 404 with glowing ion thrusters
 *    - 'orbit': 360° close planetary inspection orbit
 * 2. Authentic Interplanetary Navigation & Velocity Control (WASD / Arrow Keys)
 * 3. Rich Dual-Tabbed Scientific Information & Astronaut Health Telemetry (Image 3 Inspiration)
 * 4. Realistic Spacecraft Audio (Cabin Hum, Thrusters, Docking Chimes)
 * 5. Commander Name Personalization
 */
export default function PlanetsPage({ setMissionDay, setCurrentPhase }) {
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const [hoveredBody, setHoveredBody] = useState(null);
  const [viewMode, setViewMode] = useState('focus'); // 'focus' | 'overview'
  const [cameraMode, setCameraMode] = useState('cockpit'); // 'cockpit' | 'external' | 'orbit'
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  // Expanded Details Dossier (Open by default on desktop ≥ 1024px for immediate scientific immersion, compact on mobile)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('science'); // 'science' | 'health'

  // Flight simulation state
  const [flightVelocity, setFlightVelocity] = useState(34.8);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isMuted, setIsMuted] = useState(spaceAudio.isMuted);
  const [isFlightFocused, setIsFlightFocused] = useState(false);
  const [transitMessage, setTransitMessage] = useState(null);

  // Commander Personalization
  const commanderName = localStorage.getItem('spaceship_404_commander_name') || 'Commander';

  const activeBody = CELESTIAL_BODIES.find(b => b.id === selectedPlanetId) || CELESTIAL_BODIES[4];
  const currentIndex = CELESTIAL_BODIES.findIndex(b => b.id === selectedPlanetId);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const muted = spaceAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  // Destination Selection
  const handleSelectPlanet = useCallback((id) => {
    const target = CELESTIAL_BODIES.find(b => b.id === id);
    spaceAudio.playChirp();
    spaceAudio.playThrusterBurn(1.8);
    setSelectedPlanetId(id);
    setViewMode('focus');
    setIsAccelerating(true);
    setFlightVelocity(prev => prev + 4.2);
    setTransitMessage(`INTERPLANETARY TRANSIT // TARGET: ${target?.name?.toUpperCase()}`);
    setTimeout(() => {
      setIsAccelerating(false);
      spaceAudio.playDockingChime();
      setTimeout(() => setTransitMessage(null), 1800);
    }, 2000);
  }, []);

  const handleReturnToOverview = useCallback(() => {
    spaceAudio.playChirp();
    setViewMode('overview');
  }, []);

  const handleNextPlanet = useCallback(() => {
    spaceAudio.playChirp();
    const nextIdx = (currentIndex + 1) % CELESTIAL_BODIES.length;
    handleSelectPlanet(CELESTIAL_BODIES[nextIdx].id);
  }, [currentIndex, handleSelectPlanet]);

  const handlePrevPlanet = useCallback(() => {
    spaceAudio.playChirp();
    const prevIdx = (currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
    handleSelectPlanet(CELESTIAL_BODIES[prevIdx].id);
  }, [currentIndex, handleSelectPlanet]);

  // Thrust controls
  const handleThrustForward = useCallback(() => {
    spaceAudio.playThrusterBurn(1.2);
    setIsAccelerating(true);
    setFlightVelocity(prev => Math.min(68.5, prev + 2.5));
    setTimeout(() => setIsAccelerating(false), 1200);
  }, []);

  const handleThrustReverse = useCallback(() => {
    spaceAudio.playBeep(450, 0.1);
    setFlightVelocity(prev => Math.max(12.0, prev - 2.5));
  }, []);

  // Keyboard Navigation: Non-Hijacking Arrow & Flight Keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Only intercept ArrowUp/ArrowDown when the flight viewport is explicitly hovered/focused
      // (respects normal page scroll outside active flight mode)
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (isFlightFocused || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          handleThrustForward();
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (isFlightFocused || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          handleThrustReverse();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (isFlightFocused || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          handleNextPlanet();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (isFlightFocused || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          handlePrevPlanet();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        setViewMode(prev => prev === 'overview' ? 'focus' : 'overview');
      } else if (e.key === 'r' || e.key === 'R') {
        setCameraMode('cockpit');
        setViewMode('focus');
      } else if (e.key === 'Escape') {
        if (isDetailsExpanded) {
          setIsDetailsExpanded(false);
        } else if (viewMode === 'focus') {
          handleReturnToOverview();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPlanet, handlePrevPlanet, handleReturnToOverview, handleThrustForward, handleThrustReverse, isDetailsExpanded, isFlightFocused, viewMode]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 select-none font-sans space-y-4">

      {/* ─────────────────────────────────────────────────────────────
          1. SPACESHEEP 404 MISSION STATUS STRIP
          Personalized Commander Greeting & Audio Status
      ───────────────────────────────────────────────────────────── */}
      <div className="px-4 py-2 rounded-2xl bg-[#0D1728]/85 border border-[rgba(180,210,235,0.18)] shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
            <Rocket size={14} />
          </div>
          <div>
            <span className="text-[#F4F7FC] font-bold">
              WELCOME ABOARD, {commanderName.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#7AD7EA] block">
              SPACESHIP 404 // INTERPLANETARY NAVIGATION ACTIVE
            </span>
          </div>
        </div>

        {/* Center Mission Stage Indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#C7D2E3]">
          <span className="w-2 h-2 rounded-full bg-[#33FF66] animate-pulse" />
          <span>MISSION STAGE: <strong className="text-[#F4F7FC]">{activeBody.missionStage}</strong></span>
        </div>

        {/* Quick Link to AI Medical Center */}
        <Link
          to="/workspace"
          onClick={() => spaceAudio.playChirp()}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/30 text-[10px] font-bold transition-all shadow-sm"
        >
          <Activity size={12} />
          <span>ZERO-G MEDICAL SIMULATOR</span>
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN 3D SPACESHIP 404 OBSERVATION DECK VIEWPORT
          Dominates the screen (82vh) with HUD pillars and console
      ───────────────────────────────────────────────────────────── */}
      <div
        onMouseEnter={() => setIsFlightFocused(true)}
        onMouseLeave={() => setIsFlightFocused(false)}
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#07111F]/90 border border-[rgba(180,210,235,0.20)] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[580px] lg:h-[82vh] lg:min-h-[640px]"
      >

        {/* ─── Interplanetary Transit HUD Notification Banner ─── */}
        <AnimatePresence>
          {transitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-[#0D1728]/95 border border-[#7AD7EA]/40 text-xs font-mono-tech text-[#7AD7EA] shadow-[0_0_25px_rgba(122,215,234,0.3)] flex items-center gap-2 pointer-events-none select-none backdrop-blur-md"
            >
              <Rocket size={14} className="animate-pulse text-[#E4783B]" />
              <span className="font-bold tracking-wide">{transitMessage}</span>
              <span className="text-[10px] text-[#33FF66] font-semibold">● VECTOR LOCKED</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 3D WebGL Canvas ─── */}
        <div className="relative w-full h-full flex-1">
          <ThreeJsSolarSystem
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
            onHoverPlanet={setHoveredBody}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cameraMode={cameraMode}
            onCameraModeChange={setCameraMode}
            isAccelerating={isAccelerating}
            flightVelocity={flightVelocity}
          />
        </div>

        {/* ─── Cockpit HUD Instruments & Window Pillars Overlay ─── */}
        <CockpitModeHUD
          cameraMode={cameraMode}
          onCameraModeChange={setCameraMode}
          targetBody={activeBody}
          flightVelocity={flightVelocity}
          isAccelerating={isAccelerating}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onThrustForward={handleThrustForward}
          onThrustReverse={handleThrustReverse}
          onSteerLeft={handlePrevPlanet}
          onSteerRight={handleNextPlanet}
        />

        {/* ─── Floating Collapsible Scientific & Medical Telemetry Deck ─── */}
        {viewMode === 'focus' && (
          <div className="absolute bottom-16 sm:bottom-18 right-2 sm:right-5 z-20 max-w-md w-[calc(100%-1rem)] sm:w-auto pointer-events-auto">
            <AnimatePresence mode="wait">
              {!isDetailsExpanded ? (
                /* Collapsed Minimal State (Takes virtually no screen space) */
                <motion.div
                  key="collapsed-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#0D1728]/95 backdrop-blur-xl border border-[rgba(180,210,235,0.22)] shadow-2xl flex items-center justify-between gap-3 text-xs font-mono-tech"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: activeBody.color }}
                    />
                    <div>
                      <div className="font-titan text-sm text-[#F4F7FC] uppercase leading-none">
                        {activeBody.name}
                      </div>
                      <span className="text-[10px] text-[#98A7BD]">
                        {activeBody.type.split('/')[0]}
                      </span>
                    </div>
                  </div>

                  {/* 2 Quick Key Facts */}
                  <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-3 text-[10px]">
                    <div>
                      <span className="text-[#98A7BD] block">GRAVITY</span>
                      <strong className="text-[#7AD7EA]">{activeBody.gravityG} G</strong>
                    </div>
                    <div>
                      <span className="text-[#98A7BD] block">TEMP</span>
                      <strong className="text-[#F4F7FC]">{activeBody.meanTemp}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      spaceAudio.playChirp();
                      setIsDetailsExpanded(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/30 text-[10px] font-bold transition-all shadow-sm"
                  >
                    <span>EXPLORE DATA</span>
                    <ChevronUp size={13} />
                  </button>
                </motion.div>
              ) : (
                /* Expanded Dual-Tabbed Panel (Scientific Facts + Astronaut Health) */
                <motion.div
                  key="expanded-panel"
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 sm:p-5 rounded-3xl bg-[#0D1728]/95 backdrop-blur-2xl border border-[rgba(180,210,235,0.25)] shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-3.5 max-h-[72vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/15 w-full sm:w-[420px]"
                >
                  {/* Header: Planet Identity & Close Button */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                        style={{ backgroundColor: activeBody.color }}
                      />
                      <div>
                        <h3 className="font-titan text-base sm:text-lg text-[#F4F7FC] uppercase leading-tight">
                          {activeBody.name}
                        </h3>
                        <span className="text-[10px] font-mono-tech text-[#7AD7EA]">
                          {activeBody.arabicName} • {activeBody.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        spaceAudio.playBeep(800, 0.05);
                        setIsDetailsExpanded(false);
                      }}
                      className="p-1.5 rounded-xl bg-[#132238] hover:bg-[#182A44] text-[#98A7BD] hover:text-[#F4F7FC] transition-colors"
                      title="Collapse details (Esc)"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Dual Tab Navigation (Science vs Astronaut Health) */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#132238]/80 text-xs font-mono-tech font-bold">
                    <button
                      onClick={() => {
                        spaceAudio.playBeep(1050, 0.05);
                        setActiveTab('science');
                      }}
                      className={`py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'science'
                          ? 'bg-[#182A44] text-[#7AD7EA] border border-[#7AD7EA]/40 shadow-sm'
                          : 'text-[#98A7BD] hover:text-[#F4F7FC]'
                      }`}
                    >
                      <Globe size={13} />
                      <span>PLANETARY SCIENCE</span>
                    </button>

                    <button
                      onClick={() => {
                        spaceAudio.playBeep(1050, 0.05);
                        setActiveTab('health');
                      }}
                      className={`py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'health'
                          ? 'bg-[#182A44] text-[#E4783B] border border-[#E4783B]/40 shadow-sm'
                          : 'text-[#98A7BD] hover:text-[#F4F7FC]'
                      }`}
                    >
                      <Activity size={13} />
                      <span>ASTRONAUT HEALTH</span>
                    </button>
                  </div>

                  {/* Tab 1: Planetary Science & Discoveries */}
                  {activeTab === 'science' && (
                    <div className="space-y-3">
                      {/* 4-Metric Scientific Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">Diameter</span>
                          <strong className="text-[#F4F7FC] text-xs">{activeBody.diameterKm}</strong>
                          <span className="text-[8px] text-[#7AD7EA] block">{activeBody.diameterRelative}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">Surface Gravity</span>
                          <strong className="text-[#F4F7FC] text-xs">{activeBody.gravityG} G</strong>
                          <span className="text-[8px] text-[#7AD7EA] block">{activeBody.gravityMs}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">Mean Temperature</span>
                          <strong className="text-[#F4F7FC] text-xs">{activeBody.meanTemp}</strong>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">Orbital Period</span>
                          <strong className="text-[#F4F7FC] text-xs">{activeBody.orbitalPeriod.split(' ')[0]} {activeBody.orbitalPeriod.split(' ')[1]}</strong>
                        </div>
                      </div>

                      {/* Atmospheric Composition */}
                      <div className="text-[11px] text-[#C7D2E3] leading-relaxed font-sans bg-[#132238]/50 p-2.5 rounded-xl border border-white/5">
                        <strong className="text-[#7AD7EA] font-mono-tech text-[10px] block mb-0.5">ATMOSPHERE:</strong>
                        <span>{activeBody.atmosphere}</span>
                      </div>

                      {/* NASA Exploration Missions */}
                      {activeBody.scientificMissions && (
                        <div className="p-2.5 rounded-xl bg-[#132238]/60 border border-white/5 space-y-1.5">
                          <span className="text-[10px] font-mono-tech text-[#7AD7EA] font-bold uppercase block">
                            KEY NASA MISSIONS:
                          </span>
                          <ul className="space-y-1 text-[11px] text-[#C7D2E3] list-disc list-inside">
                            {activeBody.scientificMissions.map((m, i) => (
                              <li key={`m-${i}`}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Geological Highlights */}
                      {activeBody.geologicalHighlights && (
                        <div className="p-2.5 rounded-xl bg-[#132238]/60 border border-white/5 space-y-1.5">
                          <span className="text-[10px] font-mono-tech text-[#7AD7EA] font-bold uppercase block">
                            GEOLOGICAL HIGHLIGHTS:
                          </span>
                          <ul className="space-y-1 text-[11px] text-[#C7D2E3] list-disc list-inside">
                            {activeBody.geologicalHighlights.map((g, i) => (
                              <li key={`g-${i}`}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Astronaut Health Telemetry (NASA EVA HUD & Biometrics) */}
                  {activeTab === 'health' && (
                    <div className="space-y-2.5">
                      {/* Active Crew Comms Channels (Image 7 Reference: Christina & Thomas) */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                        <div className="p-2 rounded-xl bg-[#0D1728]/90 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#33FF66] animate-pulse" />
                            <span className="text-[10px] text-[#F4F7FC] font-bold">CDR. Christina</span>
                          </div>
                          {/* Animated Voice Equalizer */}
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-[#E4783B] animate-pulse" />
                            <span className="w-0.5 h-2 bg-[#E4783B] animate-pulse delay-75" />
                            <span className="w-0.5 h-3 bg-[#E4783B] animate-pulse delay-150" />
                            <span className="w-0.5 h-1 bg-[#E4783B]" />
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-[#0D1728]/90 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7AD7EA] animate-pulse" />
                            <span className="text-[10px] text-[#F4F7FC] font-bold">MS. Thomas</span>
                          </div>
                          {/* Animated Voice Equalizer */}
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-2 bg-[#7AD7EA] animate-pulse" />
                            <span className="w-0.5 h-3 bg-[#7AD7EA] animate-pulse delay-100" />
                            <span className="w-0.5 h-1.5 bg-[#7AD7EA] animate-pulse delay-200" />
                            <span className="w-0.5 h-2.5 bg-[#7AD7EA]" />
                          </div>
                        </div>
                      </div>

                      {/* Telemetry Metric Cards (Heart, O2, Temp, Bone Mass) */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                        {/* Heart Rate & Waveform */}
                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-[#98A7BD]">
                            <span>HEART RATE</span>
                            <Heart size={11} className="text-[#E4783B] animate-pulse" />
                          </div>
                          <div className="flex items-baseline gap-1">
                            <strong className="text-[#F4F7FC] text-base">{activeBody.crewVitalsSimulation?.heartRate || 72}</strong>
                            <span className="text-[9px] text-[#98A7BD]">BPM</span>
                          </div>
                          {/* Live animated SVG ECG waveform */}
                          <svg className="w-full h-4 text-[#E4783B]" viewBox="0 0 100 20" fill="none">
                            <path
                              d="M 0 10 L 25 10 L 30 3 L 35 17 L 40 7 L 45 13 L 50 10 L 100 10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        {/* Body O2 Saturation */}
                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5 space-y-1">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">BLOOD OXYGEN (SpO₂)</span>
                          <strong className="text-[#7AD7EA] text-base">{activeBody.crewVitalsSimulation?.spo2 || '98.4%'}</strong>
                          <span className="text-[8px] text-[#33FF66] block">NORMOBARIC AIR</span>
                        </div>

                        {/* Core Temperature */}
                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5 space-y-1">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">CORE TEMP</span>
                          <strong className="text-[#F4F7FC] text-base">{activeBody.crewVitalsSimulation?.bodyTemp || '37.0°C'}</strong>
                          <span className="text-[8px] text-[#98A7BD] block">THERMAL REGULATED</span>
                        </div>

                        {/* Bone Mass Loss Rate */}
                        <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5 space-y-1">
                          <span className="text-[9px] text-[#98A7BD] uppercase block">BONE DENSITY LOSS</span>
                          <strong className="text-[#E4783B] text-base">{activeBody.crewVitalsSimulation?.boneLossRate || '-1.2%/mo'}</strong>
                          <span className="text-[8px] text-[#7AD7EA] block">ARED PROTOCOL REQ</span>
                        </div>
                      </div>

                      {/* Suit & Environmental Life Support Specs (Image 7 Reference) */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono-tech">
                        <div className="p-2 rounded-lg bg-[#132238]/50 border border-white/5">
                          <span className="text-[8px] text-[#98A7BD] block">SUIT PRES.</span>
                          <strong className="text-[#F4F7FC]">4.3 PSI</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-[#132238]/50 border border-white/5">
                          <span className="text-[8px] text-[#98A7BD] block">AZOTE (N₂)</span>
                          <strong className="text-[#7AD7EA]">5.9 KG</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-[#132238]/50 border border-white/5">
                          <span className="text-[8px] text-[#98A7BD] block">EVA BATTERY</span>
                          <strong className="text-[#33FF66]">89%</strong>
                        </div>
                      </div>

                      {/* Radiation & NASA-STD-3001 Clinical Assessment */}
                      <div className="p-2.5 rounded-xl bg-[#182A44]/80 border border-[#7AD7EA]/20 space-y-1.5 text-[11px] text-[#C7D2E3]">
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert size={13} className="text-[#E4783B]" />
                          <span className="text-[10px] font-mono-tech font-bold text-[#F4F7FC] uppercase">
                            NASA CLINICAL HAZARD MATRIX:
                          </span>
                        </div>
                        <div>
                          <strong className="text-[#7AD7EA] font-mono-tech text-[9px]">Ionizing Radiation: </strong>
                          <span>{activeBody.astronautHazards.radiation}</span>
                        </div>
                        <div>
                          <strong className="text-[#7AD7EA] font-mono-tech text-[9px]">Neuro-Ocular (SANS): </strong>
                          <span>{activeBody.astronautHazards.sansRisk}</span>
                        </div>
                      </div>

                      {/* Action Link to Workspace Simulation */}
                      <Link
                        to="/workspace"
                        onClick={() => {
                          spaceAudio.playChirp();
                          if (setMissionDay) setMissionDay(activeBody.simulationDay);
                        }}
                        className="w-full px-4 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs font-mono-tech tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <Activity size={13} />
                        <span>LAUNCH MEDICAL SIMULATION FOR {activeBody.name.toUpperCase()}</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ─── Bottom Minimal Destination Navigation Bar ─── */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-2 sm:p-3 bg-gradient-to-t from-[#07111F] via-[#07111F]/90 to-transparent flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Planet Pills Track with Directional Arrow Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 max-w-full px-2 py-1">
            {/* Previous Target Arrow */}
            <button
              onClick={handlePrevPlanet}
              className="shrink-0 w-8 h-8 rounded-full bg-[#0D1728]/90 text-[#7AD7EA] hover:bg-[#182A44] border border-white/10 hover:border-[#7AD7EA]/40 transition-all flex items-center justify-center shadow-md active:scale-95"
              title="Previous Destination (←)"
              aria-label="Previous Destination"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable Pills Container */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
              {/* Overview Pill */}
              <button
                onClick={handleReturnToOverview}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tech transition-all min-h-[34px] border ${
                  viewMode === 'overview'
                    ? 'bg-[#7AD7EA] text-[#07111F] font-bold border-[#7AD7EA] shadow-[0_0_12px_rgba(122,215,234,0.4)]'
                    : 'bg-[#0D1728]/85 text-[#98A7BD] border-white/10 hover:border-[#7AD7EA]/40 hover:text-[#F4F7FC]'
                }`}
              >
                <Orbit size={13} />
                <span className="uppercase text-[11px]">SOLAR SYSTEM MAP</span>
              </button>

              {/* Planet Destination Pills */}
              {CELESTIAL_BODIES.map((body) => {
                const isSelected = viewMode === 'focus' && body.id === selectedPlanetId;
                return (
                  <button
                    key={`pill-${body.id}`}
                    onClick={() => handleSelectPlanet(body.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tech transition-all min-h-[34px] border ${
                      isSelected
                        ? 'bg-[#182A44] text-[#F4F7FC] font-bold border-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.35)] scale-105'
                        : 'bg-[#0D1728]/85 text-[#C7D2E3] border-white/10 hover:border-[#7AD7EA]/40 hover:text-[#F4F7FC]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: body.color }}
                    />
                    <span className="uppercase text-[11px]">{body.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Target Arrow */}
            <button
              onClick={handleNextPlanet}
              className="shrink-0 w-8 h-8 rounded-full bg-[#0D1728]/90 text-[#7AD7EA] hover:bg-[#182A44] border border-white/10 hover:border-[#7AD7EA]/40 transition-all flex items-center justify-center shadow-md active:scale-95"
              title="Next Destination (→)"
              aria-label="Next Destination"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Meaningful Control Hints Guide */}
          <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono-tech text-[#98A7BD]/70">
            <span>← / → CYCLE TARGETS</span>
            <span>•</span>
            <span>W / S THRUST VELOCITY</span>
            <span>•</span>
            <span>DRAG TO ORBIT 360°</span>
            <span>•</span>
            <span>M MAP OVERVIEW</span>
            <span>•</span>
            <span>ESC RESET</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPARISON MODAL
      ───────────────────────────────────────────────────────────── */}
      <PlanetComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialPlanetId={selectedPlanetId}
      />
    </div>
  );
}
