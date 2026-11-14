import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Radio, ShieldAlert, Thermometer,
  Zap, ArrowRight, Activity, Globe, Info, ChevronRight, Sliders
} from 'lucide-react';
import { SOLAR_SYSTEM_PLANETS } from '../data/solarSystemData';
import { spaceAudio } from '../utils/spaceAudio';

export default function InteractiveSolarSystem({ setMissionDay, setCurrentPhase, onOpenAiDrawer }) {
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const [hoveredPlanetId, setHoveredPlanetId] = useState(null);

  const activePlanet = SOLAR_SYSTEM_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_SYSTEM_PLANETS[3];

  const handleSelectPlanet = (planetId) => {
    spaceAudio.playChirp();
    setSelectedPlanetId(planetId);
  };

  // Keyboard navigation through planets (Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIndex = SOLAR_SYSTEM_PLANETS.findIndex((p) => p.id === selectedPlanetId);
      if (e.key === 'ArrowRight' && currentIndex < SOLAR_SYSTEM_PLANETS.length - 1) {
        handleSelectPlanet(SOLAR_SYSTEM_PLANETS[currentIndex + 1].id);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handleSelectPlanet(SOLAR_SYSTEM_PLANETS[currentIndex - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanetId]);

  return (
    <div className="w-full space-y-8 select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. Quick Planet Selection Strip (Touch & Keyboard Accessible)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#7AD7EA]/20 scrollbar-track-transparent">
        {SOLAR_SYSTEM_PLANETS.map((planet, index) => {
          const isSelected = planet.id === selectedPlanetId;
          const isHovered = planet.id === hoveredPlanetId;

          return (
            <button
              key={planet.id}
              onClick={() => handleSelectPlanet(planet.id)}
              onMouseEnter={() => setHoveredPlanetId(planet.id)}
              onMouseLeave={() => setHoveredPlanetId(null)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono-tech transition-all min-h-[42px] border ${
                isSelected
                  ? 'bg-[#182A44] text-[#F4F7FC] border-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.35)] scale-105'
                  : 'bg-[#132238]/60 text-[#C7D2E3] border-white/10 hover:border-[#7AD7EA]/40 hover:text-[#F4F7FC]'
              }`}
              aria-label={`Select ${planet.name}`}
              aria-selected={isSelected}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: isSelected ? `0 0 8px ${planet.color}` : 'none',
                  transform: isSelected || isHovered ? 'scale(1.3)' : 'scale(1)'
                }}
              />
              <span className="font-bold tracking-wider uppercase text-[11px]">{planet.name}</span>
              <span className="text-[9px] text-[#98A7BD] hidden sm:inline">{planet.distanceAU} AU</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Solar System Interactive Dual Cockpit:
             - Left/Center: Interactive SVG Orbit Canvas
             - Right: Comprehensive NASA Scientific Telemetry & Hazards Deck
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Orbital Canvas Container */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-[32px] cinematic-card-bg border border-[rgba(180,210,235,0.16)] p-4 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[480px] sm:min-h-[560px]">
          {/* Subtle Ambient Cosmic Haze inside the viewer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activePlanet.color}22 0%, transparent 65%)`
            }}
          />

          {/* Top Canvas Telemetry Header */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech text-[#98A7BD] z-10 mb-2 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-ping" />
              <span className="text-[#7AD7EA] font-bold">SOLAR SYSTEM RADAR</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase">
              TARGET: <span className="text-[#F4F7FC] font-bold">{activePlanet.name.toUpperCase()}</span> ({activePlanet.distanceAU} AU)
            </div>
          </div>

          {/* SVG Concentric Orbits Canvas */}
          <div className="w-full max-w-[540px] aspect-square relative flex items-center justify-center my-auto">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="-430 -430 860 860"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sun Radiant Center Glow */}
                <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF9E6" />
                  <stop offset="30%" stopColor="#FFC837" />
                  <stop offset="70%" stopColor="#FF8008" />
                  <stop offset="100%" stopColor="#FF4500" stopOpacity="0.8" />
                </radialGradient>

                <filter id="solarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Saturn Ring Filter */}
                <linearGradient id="saturnRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E0C895" stopOpacity="0.2" />
                  <stop offset="35%" stopColor="#F7E4B5" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#C2A875" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#E0C895" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* 1. Concentric Planetary Orbits */}
              {SOLAR_SYSTEM_PLANETS.map((planet) => {
                const isSelected = planet.id === selectedPlanetId;
                const isHovered = planet.id === hoveredPlanetId;

                return (
                  <g key={`orbit-${planet.id}`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={planet.orbitRadiusDesktop}
                      fill="none"
                      stroke={
                        isSelected
                          ? planet.color
                          : isHovered
                          ? 'rgba(122, 215, 234, 0.45)'
                          : 'rgba(180, 210, 235, 0.12)'
                      }
                      strokeWidth={isSelected ? 1.8 : 1}
                      strokeDasharray={isSelected ? 'none' : '4 4'}
                      className="transition-colors duration-300"
                    />

                    {/* Orbit Focus Beacon */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r={planet.orbitRadiusDesktop}
                        fill="none"
                        stroke={planet.color}
                        strokeWidth="1"
                        opacity="0.3"
                        className="animate-ping"
                        style={{ transformOrigin: 'center' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* 2. Central Star: The Sun */}
              <g className="cursor-pointer group">
                {/* Corona Outer Glow */}
                <circle cx="0" cy="0" r="42" fill="url(#sunGradient)" opacity="0.25" filter="url(#solarGlow)" />
                <circle cx="0" cy="0" r="30" fill="url(#sunGradient)" filter="url(#solarGlow)" />
                <circle cx="0" cy="0" r="22" fill="#FFFBE6" />
                <text
                  x="0"
                  y="4"
                  fill="#7A3E00"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  SOL
                </text>
              </g>

              {/* 3. Planets along their orbits (Calibrated angles for visual clarity) */}
              {SOLAR_SYSTEM_PLANETS.map((planet, index) => {
                // Staggered orbital angles so planets do not overlap
                const angles = [-35, 45, 120, -115, 60, -150, 15, -70];
                const angleDeg = angles[index % angles.length];
                const angleRad = (angleDeg * Math.PI) / 180;
                const px = Math.cos(angleRad) * planet.orbitRadiusDesktop;
                const py = Math.sin(angleRad) * planet.orbitRadiusDesktop;

                const isSelected = planet.id === selectedPlanetId;
                const isHovered = planet.id === hoveredPlanetId;
                const radius = planet.visualSizeDesktop / 2;

                return (
                  <g
                    key={`node-${planet.id}`}
                    transform={`translate(${px}, ${py})`}
                    onClick={() => handleSelectPlanet(planet.id)}
                    onMouseEnter={() => setHoveredPlanetId(planet.id)}
                    onMouseLeave={() => setHoveredPlanetId(null)}
                    className="cursor-pointer group select-none"
                  >
                    {/* Active Halo on Selected Planet */}
                    {isSelected && (
                      <>
                        <circle
                          cx="0"
                          cy="0"
                          r={radius + 8}
                          fill="none"
                          stroke={planet.color}
                          strokeWidth="1.5"
                          opacity="0.75"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r={radius + 14}
                          fill={planet.color}
                          opacity="0.15"
                        />
                      </>
                    )}

                    {/* Saturn's Iconic Rings */}
                    {planet.rings && planet.id === 'saturn' && (
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={radius * 2.5}
                        ry={radius * 0.75}
                        fill="none"
                        stroke="url(#saturnRingGrad)"
                        strokeWidth="3.5"
                        transform="rotate(-26)"
                      />
                    )}

                    {/* Uranus Rings (Vertical tilt) */}
                    {planet.rings && planet.id === 'uranus' && (
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={radius * 1.8}
                        ry={radius * 0.4}
                        fill="none"
                        stroke="rgba(114, 217, 221, 0.6)"
                        strokeWidth="1.2"
                        transform="rotate(85)"
                      />
                    )}

                    {/* Planet Core Sphere */}
                    <circle
                      cx="0"
                      cy="0"
                      r={radius}
                      fill={planet.color}
                      className="transition-transform duration-200 group-hover:scale-125"
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 8px ${planet.color})` : 'none'
                      }}
                    />

                    {/* Planet Shadow / Spherical 3D shading */}
                    <circle
                      cx="0"
                      cy="0"
                      r={radius}
                      fill="black"
                      opacity="0.32"
                      mask={`url(#shadow-mask-${planet.id})`}
                    />

                    {/* Earth Moon Indicator */}
                    {planet.id === 'earth' && (
                      <circle
                        cx={radius + 5}
                        cy="-4"
                        r="2"
                        fill="#E0E6ED"
                        stroke="#07111F"
                        strokeWidth="0.5"
                      />
                    )}

                    {/* Planet Label Tag */}
                    <text
                      x="0"
                      y={radius + 12}
                      fill={isSelected ? '#F4F7FC' : '#98A7BD'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="'JetBrains Mono', monospace"
                      className="group-hover:fill-[#7AD7EA] transition-colors"
                    >
                      {planet.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Canvas Controls & Legend */}
          <div className="w-full flex flex-wrap items-center justify-between text-[11px] font-mono-tech text-[#98A7BD] pt-3 border-t border-[rgba(180,210,235,0.12)] z-10 px-2 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E4783B]" />
                <span>Terrestrial</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C88B58]" />
                <span>Gas Giant</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#72D9DD]" />
                <span>Ice Giant</span>
              </span>
            </div>
            <div className="text-[10px] text-[#7AD7EA]">
              Use ← / → arrows or click planet to inspect
            </div>
          </div>
        </div>

        {/* Detailed NASA Educational Telemetry & Human Hazards Panel */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlanet.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-[32px] bg-[#132238]/90 border border-[rgba(180,210,235,0.16)] shadow-2xl space-y-5"
            >
              {/* Header: Name, Arabic Name, and Status Badge */}
              <div className="flex items-start justify-between border-b border-[rgba(180,210,235,0.12)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-md"
                      style={{ backgroundColor: activePlanet.color }}
                    />
                    <h2 className="font-titan text-2xl sm:text-3xl text-[#F4F7FC] uppercase tracking-wide">
                      {activePlanet.name}
                    </h2>
                    <span className="text-sm font-cairo text-[#7AD7EA] font-bold">
                      ({activePlanet.arabicName})
                    </span>
                  </div>
                  <span className="text-xs font-mono-tech text-[#98A7BD] block mt-0.5">
                    {activePlanet.type} • {activePlanet.moons} Moons
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono-tech font-bold uppercase tracking-wider bg-[#E4783B]/15 text-[#E4783B] border border-[#E4783B]/30 block">
                    {activePlanet.nasaRiskLevel}
                  </span>
                  <span className="text-[10px] font-mono-tech text-[#98A7BD] mt-1 block">
                    DSN Radio Delay: {activePlanet.commDelayOneWay}
                  </span>
                </div>
              </div>

              {/* Scientific Key Metrics 4-Box Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono-tech">
                <div className="p-3 rounded-xl bg-[#0D1728]/70 border border-white/5">
                  <span className="text-[10px] text-[#98A7BD] block uppercase">Distance to Sun</span>
                  <span className="text-sm font-bold text-[#F4F7FC] block mt-0.5">{activePlanet.distanceKm}</span>
                  <span className="text-[10px] text-[#7AD7EA]">{activePlanet.distanceAU} AU</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1728]/70 border border-white/5">
                  <span className="text-[10px] text-[#98A7BD] block uppercase">Surface Gravity</span>
                  <span className="text-sm font-bold text-[#F4F7FC] block mt-0.5">{activePlanet.gravityG} G</span>
                  <span className="text-[10px] text-[#C7D2E3]">{activePlanet.gravityMs}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1728]/70 border border-white/5">
                  <span className="text-[10px] text-[#98A7BD] block uppercase">Surface Temp</span>
                  <span className="text-sm font-bold text-[#F4F7FC] block mt-0.5">{activePlanet.meanTemp}</span>
                  <span className="text-[10px] text-[#98A7BD] truncate block">{activePlanet.temperatureRange}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1728]/70 border border-white/5">
                  <span className="text-[10px] text-[#98A7BD] block uppercase">Orbital Year</span>
                  <span className="text-sm font-bold text-[#F4F7FC] block mt-0.5">{activePlanet.orbitalPeriod}</span>
                  <span className="text-[10px] text-[#98A7BD] truncate block">Day: {activePlanet.rotationPeriod}</span>
                </div>
              </div>

              {/* Atmosphere Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#0D1728]/70 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block font-bold">
                  Atmospheric Composition
                </span>
                <p className="text-xs text-[#C7D2E3] leading-relaxed font-sans">
                  {activePlanet.atmosphere}
                </p>
              </div>

              {/* NASA Spaceflight Human Health & Hazards Analysis */}
              <div className="p-4 rounded-xl bg-[#182A44]/75 border border-[#7AD7EA]/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={15} className="text-[#E4783B]" />
                  <h3 className="text-xs font-mono-tech font-bold text-[#F4F7FC] uppercase tracking-wider">
                    NASA Astronaut Health Hazards (NASA-STD-3001)
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-[#C7D2E3] font-sans leading-relaxed">
                  <div>
                    <span className="font-bold text-[#7AD7EA] font-mono-tech text-[11px]">Radiation (GCR/SPE): </span>
                    <span>{activePlanet.astronautHazards.radiation}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#7AD7EA] font-mono-tech text-[11px]">Musculoskeletal Decay: </span>
                    <span>{activePlanet.astronautHazards.microgravity}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#7AD7EA] font-mono-tech text-[11px]">EVA Armor Feasibility: </span>
                    <span>{activePlanet.astronautHazards.evaSuitRequirement}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#7AD7EA] font-mono-tech text-[11px]">Neuro-Ocular (SANS): </span>
                    <span>{activePlanet.astronautHazards.sansRisk}</span>
                  </div>
                </div>
              </div>

              {/* Mission Summary Narrative */}
              <p className="text-xs text-[#98A7BD] leading-relaxed italic border-l-2 border-[#7AD7EA]/40 pl-3">
                "{activePlanet.missionSummary}"
              </p>

              {/* Actions: Link to Workspace Simulation and AI Flight Surgeon */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/workspace"
                  onClick={() => {
                    spaceAudio.playChirp();
                    if (setMissionDay) setMissionDay(activePlanet.simulationDay);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)] hover:scale-105 flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Activity size={14} />
                  <span>SIMULATE AT {activePlanet.name.toUpperCase()}</span>
                  <ChevronRight size={14} />
                </Link>

                <button
                  onClick={() => {
                    spaceAudio.playChirp();
                    if (onOpenAiDrawer) onOpenAiDrawer();
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/40 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                  title="Consult AURA AI Flight Surgeon regarding this destination"
                >
                  <Radio size={14} />
                  <span>AURA CONSULT</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
