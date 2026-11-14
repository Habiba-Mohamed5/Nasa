import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Orbit, Compass, ArrowRightLeft, ZoomIn, ZoomOut,
  RotateCcw, ChevronUp, ChevronDown, ChevronRight,
  Activity, ShieldAlert, Thermometer, Globe, Info, Sparkles
} from 'lucide-react';
import ThreeJsSolarSystem from '../components/ThreeJsSolarSystem';
import PlanetComparisonModal from '../components/PlanetComparisonModal';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import { spaceAudio } from '../utils/spaceAudio';

/**
 * 404 — SPACE VOYAGE: Planetary Exploration Experience
 *
 * Immersive Spacecraft Observation Deck:
 * - Large, dominant 3D real-time viewport (Less Dashboard, More Universe)
 * - Authentic NASA planetary cartography (No flat brown spheres or artificial stripes)
 * - Smooth camera navigation (Overview -> Destination Approach -> 360° Orbit)
 * - Minimal, collapsible information interface (Does not obstruct planetary views)
 * - Non-intrusive keyboard navigation (ArrowLeft/Right, Enter, Esc; preserves vertical scroll)
 */
export default function PlanetsPage({ setMissionDay, setCurrentPhase }) {
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const [hoveredBody, setHoveredBody] = useState(null);
  const [viewMode, setViewMode] = useState('focus'); // 'focus' | 'overview'
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const activeBody = CELESTIAL_BODIES.find(b => b.id === selectedPlanetId) || CELESTIAL_BODIES[4];
  const currentIndex = CELESTIAL_BODIES.findIndex(b => b.id === selectedPlanetId);

  // Destination Selection
  const handleSelectPlanet = useCallback((id) => {
    spaceAudio.playChirp();
    setSelectedPlanetId(id);
    setViewMode('focus');
  }, []);

  const handleReturnToOverview = useCallback(() => {
    spaceAudio.playChirp();
    setViewMode('overview');
  }, []);

  const handleNextPlanet = useCallback(() => {
    spaceAudio.playChirp();
    const nextIdx = (currentIndex + 1) % CELESTIAL_BODIES.length;
    setSelectedPlanetId(CELESTIAL_BODIES[nextIdx].id);
    setViewMode('focus');
  }, [currentIndex]);

  const handlePrevPlanet = useCallback(() => {
    spaceAudio.playChirp();
    const prevIdx = (currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
    setSelectedPlanetId(CELESTIAL_BODIES[prevIdx].id);
    setViewMode('focus');
  }, [currentIndex]);

  // Non-intrusive Keyboard Navigation
  // - ArrowLeft / ArrowRight: Switch planet
  // - Enter: Select / Focus
  // - Escape: Return to overview / Close details
  // - ArrowUp / ArrowDown: NORMAL BROWSER SCROLLING (Never intercepted!)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not hijack typing in inputs or textareas
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPlanet();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPlanet();
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
  }, [handleNextPlanet, handlePrevPlanet, handleReturnToOverview, isDetailsExpanded, viewMode]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 select-none font-sans space-y-3">

      {/* ─────────────────────────────────────────────────────────────
          1. 404 SPACE VOYAGE OBSERVATION DECK FRAME
          Large immersive 3D space window occupying almost the entire screen
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#07111F]/90 border border-[rgba(180,210,235,0.18)] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between min-h-[580px] lg:h-[82vh] lg:min-h-[640px]">

        {/* ─── Top Floating Flight Instrument Bar ─── */}
        <div className="absolute top-0 inset-x-0 z-20 p-3 sm:p-5 flex items-center justify-between gap-3 pointer-events-none">
          {/* Top-Left: 404 Space Voyage Identity */}
          <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-[rgba(180,210,235,0.16)] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-pulse" />
            <span className="font-titan text-sm sm:text-base text-[#F4F7FC] tracking-wider">
              404
            </span>
            <span className="text-[10px] font-oxanium text-[#7AD7EA] font-bold tracking-widest hidden sm:inline">
              // SPACE VOYAGE
            </span>
            <span className="text-[9px] font-mono-tech text-[#98A7BD] hidden md:inline">
              OBSERVATION DECK
            </span>
          </div>

          {/* Top-Center: Target Status Indicator */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1728]/85 backdrop-blur-md border border-[rgba(180,210,235,0.16)] text-xs font-mono-tech text-[#C7D2E3] shadow-lg">
            {viewMode === 'focus' ? (
              <>
                <span className="text-[#98A7BD]">DESTINATION:</span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeBody.color }} />
                <strong className="text-[#F4F7FC] uppercase">{activeBody.name}</strong>
                <span className="text-[#7AD7EA]">({activeBody.distanceAU} AU)</span>
              </>
            ) : (
              <>
                <Orbit size={14} className="text-[#7AD7EA]" />
                <span className="text-[#F4F7FC] uppercase font-bold">SOLAR SYSTEM OVERVIEW</span>
              </>
            )}
          </div>

          {/* Top-Right: Discreet Overview & Comparison Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {viewMode === 'focus' && (
              <button
                onClick={handleReturnToOverview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#182A44]/90 hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/35 text-xs font-mono-tech font-bold transition-all shadow-md hover:scale-105"
                title="Return to Solar System Overview (Esc)"
              >
                <Orbit size={13} />
                <span className="hidden sm:inline">SOLAR SYSTEM OVERVIEW</span>
                <span className="sm:hidden">OVERVIEW</span>
              </button>
            )}

            <button
              onClick={() => {
                spaceAudio.playChirp();
                setIsCompareOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#132238]/90 hover:bg-[#182A44] text-[#C7D2E3] hover:text-[#F4F7FC] border border-white/10 text-xs font-mono-tech font-bold transition-all shadow-md hover:scale-105"
              title="Compare Planets Side-by-Side"
            >
              <ArrowRightLeft size={13} />
              <span className="hidden sm:inline">COMPARE</span>
            </button>
          </div>
        </div>

        {/* ─── Center 3D Space Viewport (Real-Time WebGL) ─── */}
        <div className="relative w-full h-full flex-1">
          <ThreeJsSolarSystem
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
            onHoverPlanet={setHoveredBody}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Subtle Viewport Watermark & Camera Prompt */}
          <div className="absolute top-16 left-5 text-[9px] font-mono-tech text-[#7AD7EA]/40 tracking-widest pointer-events-none select-none hidden sm:block">
            {viewMode === 'focus' ? (
              <span>OBSERVING // {activeBody.name.toUpperCase()} (DRAG TO ROTATE 360° • SCROLL TO ZOOM)</span>
            ) : (
              <span>SOLAR SYSTEM TRANSIT // SELECT ANY PLANET TO EMBARK</span>
            )}
          </div>
        </div>

        {/* ─── Floating Collapsible Planet Information Panel (Bottom-Right) ─── */}
        {viewMode === 'focus' && (
          <div className="absolute bottom-16 sm:bottom-18 right-2 sm:right-5 z-20 max-w-sm w-[calc(100%-1rem)] sm:w-auto">
            <AnimatePresence mode="wait">
              {!isDetailsExpanded ? (
                /* Collapsed Minimal State (Takes virtually no screen space) */
                <motion.div
                  key="collapsed-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#0D1728]/90 backdrop-blur-xl border border-[rgba(180,210,235,0.18)] shadow-2xl flex items-center justify-between gap-3 text-xs font-mono-tech"
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
                    <span>DETAILS</span>
                    <ChevronUp size={13} />
                  </button>
                </motion.div>
              ) : (
                /* Expanded Scientifically Grounded Facts Panel */
                <motion.div
                  key="expanded-panel"
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 sm:p-5 rounded-3xl bg-[#0D1728]/95 backdrop-blur-2xl border border-[rgba(180,210,235,0.22)] shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-3.5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/15"
                >
                  {/* Panel Header */}
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
                        spaceAudio.playChirp();
                        setIsDetailsExpanded(false);
                      }}
                      className="p-1.5 rounded-xl bg-[#132238] hover:bg-[#182A44] text-[#98A7BD] hover:text-[#F4F7FC] transition-colors"
                      title="Collapse details panel (Esc)"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

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

                  {/* Atmosphere Description */}
                  <div className="text-[11px] text-[#C7D2E3] leading-relaxed font-sans bg-[#132238]/50 p-2.5 rounded-xl border border-white/5">
                    <strong className="text-[#7AD7EA] font-mono-tech text-[10px] block mb-0.5">ATMOSPHERIC COMPOSITION:</strong>
                    <span>{activeBody.atmosphere}</span>
                  </div>

                  {/* Human Spaceflight Challenges */}
                  <div className="p-2.5 rounded-xl bg-[#182A44]/80 border border-[#7AD7EA]/20 space-y-1.5 text-[11px] text-[#C7D2E3]">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert size={13} className="text-[#E4783B]" />
                      <span className="text-[10px] font-mono-tech font-bold text-[#F4F7FC] uppercase">
                        Human Exploration Challenges
                      </span>
                    </div>
                    <div>
                      <strong className="text-[#7AD7EA] font-mono-tech text-[9px]">Radiation: </strong>
                      <span>{activeBody.astronautHazards.radiation}</span>
                    </div>
                    <div>
                      <strong className="text-[#7AD7EA] font-mono-tech text-[9px]">Microgravity: </strong>
                      <span>{activeBody.astronautHazards.microgravity}</span>
                    </div>
                  </div>

                  {/* Scientific Summary Narrative */}
                  <p className="text-[11px] text-[#98A7BD] leading-relaxed italic border-l-2 border-[#7AD7EA]/40 pl-2">
                    "{activeBody.missionSummary}"
                  </p>

                  {/* Action Link to Workspace Simulation */}
                  <Link
                    to="/workspace"
                    onClick={() => {
                      spaceAudio.playChirp();
                      if (setMissionDay) setMissionDay(activeBody.simulationDay);
                    }}
                    className="w-full px-4 py-2 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs font-mono-tech tracking-wider transition-all shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5 min-h-[38px]"
                  >
                    <Activity size={13} />
                    <span>SIMULATE AT {activeBody.name.toUpperCase()}</span>
                    <ChevronRight size={13} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ─── Bottom Minimal Destination Navigation Bar ─── */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-2 sm:p-3 bg-gradient-to-t from-[#07111F] via-[#07111F]/90 to-transparent flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Planet Pills Track */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
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
              <span className="uppercase text-[11px]">ALL ORBITS</span>
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

          {/* Minimal Keyboard Hint (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono-tech text-[#98A7BD]/60">
            <span>← / → SWITCH DESTINATION</span>
            <span>•</span>
            <span>DRAG TO ORBIT 360°</span>
            <span>•</span>
            <span>ESC SOLAR SYSTEM OVERVIEW</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. COMPARISON MODAL (Discreet on-demand dialog)
      ───────────────────────────────────────────────────────────── */}
      <PlanetComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialPlanetId={selectedPlanetId}
      />
    </div>
  );
}
