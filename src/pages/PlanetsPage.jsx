import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Radio, ShieldAlert, Thermometer,
  Zap, ArrowRight, Activity, Globe, Info,
  ChevronRight, ArrowRightLeft, Scan, RefreshCw,
  Orbit, Eye, Volume2, VolumeX, Maximize2, Sparkles
} from 'lucide-react';
import ThreeJsSolarSystem from '../components/ThreeJsSolarSystem';
import PlanetComparisonModal from '../components/PlanetComparisonModal';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import { spaceAudio } from '../utils/spaceAudio';
import { assetPath } from '../utils/assetPath';

export default function PlanetsPage({ setMissionDay, setCurrentPhase, onOpenAiDrawer }) {
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const [hoveredBody, setHoveredBody] = useState(null);
  const [viewMode, setViewMode] = useState('focus'); // 'focus' | 'overview'
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [mobileInfoExpanded, setMobileInfoExpanded] = useState(false);

  const activeBody = CELESTIAL_BODIES.find(b => b.id === selectedPlanetId) || CELESTIAL_BODIES[4];
  const currentIndex = CELESTIAL_BODIES.findIndex(b => b.id === selectedPlanetId);

  const handleSelectPlanet = (id) => {
    spaceAudio.playChirp();
    setSelectedPlanetId(id);
    setViewMode('focus');
  };

  const handleNextPlanet = () => {
    spaceAudio.playChirp();
    const nextIdx = (currentIndex + 1) % CELESTIAL_BODIES.length;
    setSelectedPlanetId(CELESTIAL_BODIES[nextIdx].id);
    setViewMode('focus');
  };

  const handlePrevPlanet = () => {
    spaceAudio.playChirp();
    const prevIdx = (currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
    setSelectedPlanetId(CELESTIAL_BODIES[prevIdx].id);
    setViewMode('focus');
  };

  const handleToggleScan = () => {
    spaceAudio.playChirp();
    setScanActive(!scanActive);
  };

  // Keyboard navigation through planets (Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextPlanet();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPlanet();
      } else if (e.key === 'Escape' && viewMode === 'focus') {
        setViewMode('overview');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, viewMode]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-6 py-2 select-none font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. SPACESHIP 404 COCKPIT TOP INSTRUMENT BAR
      ───────────────────────────────────────────────────────────── */}
      <section className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0D1728]/90 border border-[rgba(180,210,235,0.18)] shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.3)]">
            <Orbit size={20} className="animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-titan text-base sm:text-xl text-[#F4F7FC] tracking-wide">
                404
              </span>
              <span className="text-[11px] font-oxanium text-[#7AD7EA] tracking-widest font-bold">
                // SPACE EXPLORATION VESSEL
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-[#98A7BD] block">
              MISSION CONTROL: DEEP SPACE TRANSIT & PLANETARY RADAR
            </span>
          </div>
        </div>

        {/* Center Flight Status Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono-tech">
          <div className="px-3 py-1 rounded-full bg-[#132238] border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-ping" />
            <span className="text-[#C7D2E3]">LOCK: <strong className="text-[#F4F7FC]">{activeBody.name.toUpperCase()}</strong></span>
            <span className="text-[#7AD7EA]">({activeBody.distanceAU} AU)</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#132238] border border-white/10 text-[#98A7BD]">
            DSN KA-BAND: <span className="text-[#7AD7EA] font-bold">99.8% Q-SIGNAL</span>
          </div>
        </div>

        {/* Cockpit Actions Cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setIsCompareOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/40 text-xs font-mono-tech font-bold transition-all shadow-md hover:scale-105 min-h-[40px]"
            title="Open Planet Comparison Matrix"
          >
            <ArrowRightLeft size={14} />
            <span className="hidden sm:inline">COMPARE</span>
          </button>

          <button
            onClick={handleToggleScan}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono-tech font-bold transition-all min-h-[40px] border ${
              scanActive
                ? 'bg-[#E4783B] text-[#07111F] border-[#E4783B] shadow-[0_0_15px_rgba(228,120,59,0.4)]'
                : 'bg-[#182A44] text-[#C7D2E3] border-white/15 hover:border-[#7AD7EA]'
            }`}
            title="Toggle Sensor Scan Mode"
          >
            <Scan size={14} />
            <span className="hidden sm:inline">{scanActive ? 'SCANNING' : 'SCAN MODE'}</span>
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE HORIZONTAL DESTINATION SELECTOR (< 1024px)
      ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#7AD7EA]/20 scrollbar-track-transparent">
        {CELESTIAL_BODIES.map((body) => {
          const isSelected = body.id === selectedPlanetId;
          return (
            <button
              key={`mob-${body.id}`}
              onClick={() => handleSelectPlanet(body.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono-tech transition-all min-h-[42px] border ${
                isSelected
                  ? 'bg-[#182A44] text-[#F4F7FC] border-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.35)] scale-105'
                  : 'bg-[#0D1728]/80 text-[#C7D2E3] border-white/10 hover:border-[#7AD7EA]/40'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: body.color }}
              />
              <span className="font-bold uppercase text-[11px]">{body.name}</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN 3D SPACESHIP 404 COCKPIT LAYOUT
             - Left (lg:col-span-3): Flight Manifest / Target Navigation Deck
             - Center (lg:col-span-6): Real-Time 3D Solar System Viewport
             - Right (lg:col-span-3): NASA Scientific & Biomedical Telemetry Deck
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ─── LEFT: Destination Manifest Deck (Desktop) ─── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-4 rounded-3xl bg-[#0D1728]/90 border border-[rgba(180,210,235,0.16)] shadow-xl space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(180,210,235,0.12)] mb-2">
              <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider font-bold">
                FLIGHT MANIFEST // DESTINATIONS
              </span>
              <span className="text-[10px] font-mono-tech text-[#98A7BD]">
                {CELESTIAL_BODIES.length} BODIES
              </span>
            </div>

            {/* Destination List */}
            <div className="space-y-1.5 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {CELESTIAL_BODIES.map((body, idx) => {
                const isSelected = body.id === selectedPlanetId;
                return (
                  <button
                    key={`nav-${body.id}`}
                    onClick={() => handleSelectPlanet(body.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all font-mono-tech border ${
                      isSelected
                        ? 'bg-[#182A44] border-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.25)] scale-[1.02]'
                        : 'bg-[#132238]/60 border-white/5 hover:border-[#7AD7EA]/40 text-[#C7D2E3] hover:text-[#F4F7FC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{
                          backgroundColor: body.color,
                          boxShadow: isSelected ? `0 0 8px ${body.color}` : 'none'
                        }}
                      />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#F4F7FC]">
                          {body.name}
                        </div>
                        <span className="text-[9px] text-[#98A7BD] block">
                          {body.arabicName} • {body.type.split('/')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#7AD7EA] font-bold block">
                        {body.distanceAU} AU
                      </span>
                      <span className="text-[8px] text-[#98A7BD] uppercase block">
                        {body.gravityG} G
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Route Progress Navigation */}
          <div className="pt-3 border-t border-[rgba(180,210,235,0.12)] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#98A7BD]">
              <span>VOYAGE PROGRESS</span>
              <span className="text-[#7AD7EA]">NODE {currentIndex + 1} OF {CELESTIAL_BODIES.length}</span>
            </div>
            <div className="w-full bg-[#132238] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#7AD7EA] via-[#7E78C9] to-[#E4783B] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / CELESTIAL_BODIES.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePrevPlanet}
                className="px-3 py-1.5 rounded-xl bg-[#132238] hover:bg-[#182A44] border border-white/10 text-[10px] font-mono-tech text-[#C7D2E3] transition-all text-center"
              >
                ← PREV TARGET
              </button>
              <button
                onClick={handleNextPlanet}
                className="px-3 py-1.5 rounded-xl bg-[#132238] hover:bg-[#182A44] border border-white/10 text-[10px] font-mono-tech text-[#C7D2E3] transition-all text-center"
              >
                NEXT TARGET →
              </button>
            </div>
          </div>
        </div>

        {/* ─── CENTER: Three.js Real-Time 3D Solar System Viewport ─── */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <ThreeJsSolarSystem
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
            onHoverPlanet={setHoveredBody}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            scanActive={scanActive}
          />
        </div>

        {/* ─── RIGHT: NASA Scientific & Biomedical Telemetry Deck ─── */}
        <div className="lg:col-span-3 flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-[#0D1728]/90 border border-[rgba(180,210,235,0.16)] shadow-xl space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBody.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Header: Name, Arabic Name, and Classification */}
              <div className="border-b border-[rgba(180,210,235,0.12)] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-md shrink-0"
                      style={{ backgroundColor: activeBody.color }}
                    />
                    <h2 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
                      {activeBody.name}
                    </h2>
                  </div>
                  <span className="text-xs font-cairo text-[#7AD7EA] font-bold">
                    {activeBody.arabicName}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono-tech text-[#98A7BD]">
                  <span>{activeBody.type}</span>
                  <span className="text-[#E4783B] font-bold">{activeBody.nasaRiskLevel}</span>
                </div>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                  <span className="text-[9px] text-[#98A7BD] uppercase block">Diameter</span>
                  <span className="text-xs font-bold text-[#F4F7FC] block">{activeBody.diameterKm}</span>
                  <span className="text-[9px] text-[#7AD7EA]">{activeBody.diameterRelative}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                  <span className="text-[9px] text-[#98A7BD] uppercase block">Surface Gravity</span>
                  <span className="text-xs font-bold text-[#F4F7FC] block">{activeBody.gravityG} G</span>
                  <span className="text-[9px] text-[#C7D2E3]">{activeBody.gravityMs}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                  <span className="text-[9px] text-[#98A7BD] uppercase block">Temperature</span>
                  <span className="text-xs font-bold text-[#F4F7FC] block">{activeBody.meanTemp}</span>
                  <span className="text-[9px] text-[#98A7BD] truncate block">{activeBody.temperatureRange}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5">
                  <span className="text-[9px] text-[#98A7BD] uppercase block">Orbital Year</span>
                  <span className="text-xs font-bold text-[#F4F7FC] block">{activeBody.orbitalPeriod.split(' ')[0]}</span>
                  <span className="text-[9px] text-[#7AD7EA]">Day: {activeBody.rotationPeriod.split(' ')[0]}</span>
                </div>
              </div>

              {/* Atmosphere Breakdown */}
              <div className="p-2.5 rounded-xl bg-[#132238]/70 border border-white/5 space-y-1">
                <span className="text-[9px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block font-bold">
                  Atmospheric Composition
                </span>
                <p className="text-[11px] text-[#C7D2E3] leading-relaxed font-sans">
                  {activeBody.atmosphere}
                </p>
              </div>

              {/* NASA-STD-3001 Human Health Hazards Deck */}
              <div className="p-3 rounded-xl bg-[#182A44]/85 border border-[#7AD7EA]/20 space-y-2">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-[#E4783B]" />
                  <span className="text-[10px] font-mono-tech font-bold text-[#F4F7FC] uppercase tracking-wider">
                    NASA Human Spaceflight Hazards
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#C7D2E3] font-sans leading-relaxed">
                  <div>
                    <strong className="text-[#7AD7EA] font-mono-tech text-[10px]">Radiation: </strong>
                    <span>{activeBody.astronautHazards.radiation}</span>
                  </div>
                  <div>
                    <strong className="text-[#7AD7EA] font-mono-tech text-[10px]">Musculoskeletal: </strong>
                    <span>{activeBody.astronautHazards.microgravity}</span>
                  </div>
                  <div>
                    <strong className="text-[#7AD7EA] font-mono-tech text-[10px]">EVA Shielding: </strong>
                    <span>{activeBody.astronautHazards.evaSuitRequirement}</span>
                  </div>
                </div>
              </div>

              {/* NASA Summary Narrative */}
              <p className="text-[11px] text-[#98A7BD] leading-relaxed italic border-l-2 border-[#7AD7EA]/40 pl-2.5">
                "{activeBody.missionSummary}"
              </p>

              {/* Actions: Link to Workspace & AI Flight Surgeon */}
              <div className="space-y-2 pt-1">
                <Link
                  to="/workspace"
                  onClick={() => {
                    spaceAudio.playChirp();
                    if (setMissionDay) setMissionDay(activeBody.simulationDay);
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs font-mono-tech tracking-wider transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] hover:scale-105 flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  <Activity size={14} />
                  <span>SIMULATE AT {activeBody.name.toUpperCase()}</span>
                  <ChevronRight size={14} />
                </Link>

                <button
                  onClick={() => {
                    spaceAudio.playChirp();
                    if (onOpenAiDrawer) onOpenAiDrawer();
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/40 text-xs font-mono-tech font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  <Radio size={14} />
                  <span>AURA SURGEON CONSULT</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. COMPARISON MODAL
      ───────────────────────────────────────────────────────────── */}
      <PlanetComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialPlanetId={selectedPlanetId}
      />
    </div>
  );
}
