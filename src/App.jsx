import React, { useState, useMemo } from 'react';
import {
  Maximize2, Volume2, VolumeX, Compass, Sliders,
  Sparkles, Bot, Rocket, ShieldCheck, Radio, WifiOff, ShieldAlert
} from 'lucide-react';

import {
  NASA_REFERENCES,
  CREW_MEMBERS,
  calculateSpacePhysiology
} from './data/nasaKnowledgeBase';
import Astronaut3D from './Astronaut3D';
import SpaceNebulaCanvas from './SpaceNebulaCanvas';
import CleanCockpitHUD from './CleanCockpitHUD';
import AiFlightSurgeonDrawer from './AiFlightSurgeonDrawer';
import NasaRiskScenariosModal from './NasaRiskScenariosModal';
import { spaceAudio } from './utils/spaceAudio';

export default function App() {
  const [selectedCrew, setSelectedCrew] = useState(CREW_MEMBERS[0]);
  const [missionDay, setMissionDay] = useState(180); // Deep Space Cruise
  const [countermeasureApplied, setCountermeasureApplied] = useState(false);
  const [isCommBlackout, setIsCommBlackout] = useState(true);
  const [scanMode, setScanMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);

  // Dynamic Telemetry Calculation
  const telemetry = useMemo(() => {
    const base = calculateSpacePhysiology({
      missionDay,
      fatigue: 5,
      stress: 5,
      sleepQuality: 7,
      countermeasureApplied,
      crew: selectedCrew
    });

    if (activeScenario && !countermeasureApplied) {
      return {
        ...base,
        currentHR: activeScenario.telemetryImpact.currentHR,
        currentHRV: activeScenario.telemetryImpact.currentHRV,
        bmdRetention: activeScenario.telemetryImpact.bmdRetention,
        fluidShiftIndex: activeScenario.telemetryImpact.fluidShiftIndex,
        riskLevel: 'CRITICAL',
        riskColor: '#FF2A55'
      };
    }
    return base;
  }, [missionDay, countermeasureApplied, selectedCrew, activeScenario]);

  const handleApplyCountermeasure = () => {
    spaceAudio.playChirp();
    spaceAudio.playBeep(1800, 0.15);
    setCountermeasureApplied(true);
  };

  const handleResetCountermeasure = () => {
    spaceAudio.playBeep(900, 0.1);
    setCountermeasureApplied(false);
    setActiveScenario(null);
  };

  const handleToggleBlackout = () => {
    const nextState = !isCommBlackout;
    setIsCommBlackout(nextState);
    if (nextState) {
      spaceAudio.playEmergencyAlarm();
    } else {
      spaceAudio.playBeep(1200, 0.1);
    }
  };

  const toggleSound = () => {
    const muted = spaceAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) spaceAudio.playBeep(1500, 0.1);
  };

  const toggleFullScreen = () => {
    spaceAudio.playBeep(1200, 0.05);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      dir="ltr"
      className="relative w-full h-screen bg-[#04060d] text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* 1. ANIMATED DEEP-SPACE NEBULA & MOVING PLANETS */}
      <SpaceNebulaCanvas missionDay={missionDay} />

      {/* 2. COCKPIT GLASS CUPOLA OVERLAY (Curved Aerospace Horizon Reticle) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Subtle Cockpit Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,6,13,0.85)_100%)]" />
        {/* Aerospace Reticle Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 3. TOP TELEMETRY BAR (Clean Sci-Fi Bridge Header) */}
      <header className="relative z-30 h-16 border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 shadow-lg">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Rocket size={22} className="text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-wider text-white">ASTRO</span>
              <span className="font-black text-base tracking-wider text-cyan-400">VITALS</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/40">
                NASA SPACE APPS 2026
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tracking-tight block">
              Orion / Starship Deep Space Health Operations
            </span>
          </div>
        </div>

        {/* Center Flight Status */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <div className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>MISSION:</span>
            <strong className="text-white">Artemis VII • Mars Transit Alpha</strong>
          </div>
          <div className="text-slate-400">
            <span>Distance:</span> <strong className="text-cyan-300">{telemetry.distanceFromEarthKm}M km</strong>
          </div>
          <div className="text-slate-400">
            <span>Comm Delay:</span>{' '}
            <strong className={isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}>
              {telemetry.commDelayMinutes} min
            </strong>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* NASA Red Risks & Sensors Button */}
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setIsScenariosOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105"
          >
            <ShieldAlert size={16} className="text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">أخطار ناسا والحساسات (NASA Risks)</span>
          </button>

          {/* AI Surgeon Chat Trigger */}
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105"
          >
            <Bot size={16} />
            <span className="hidden sm:inline">AI Flight Surgeon</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs transition-all ${
              !isMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={isMuted ? 'Unmute Audio Synthesizer' : 'Mute Audio Synthesizer'}
          >
            {!isMuted ? <Volume2 size={18} className="text-cyan-400" /> : <VolumeX size={18} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Toggle Cockpit Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </header>

      {/* 4. MAIN VIEWPORT: 3D ASTRONAUT FLOATING IN ZERO-G (Centerpiece) */}
      <main className="relative z-20 flex-1 flex items-center justify-center overflow-hidden">
        {/* Floating 3D Astronaut Component */}
        <div className="w-full h-full max-w-4xl max-h-[560px] flex items-center justify-center">
          <Astronaut3D
            telemetry={telemetry}
            scanMode={scanMode}
            setScanMode={setScanMode}
          />
        </div>

        {/* Clean Glass HUD Overlay (Left Gauges + Right Action) */}
        <CleanCockpitHUD
          telemetry={telemetry}
          onApplyCountermeasure={handleApplyCountermeasure}
          onResetCountermeasure={handleResetCountermeasure}
          countermeasureApplied={countermeasureApplied}
          isCommBlackout={isCommBlackout}
          onToggleBlackout={handleToggleBlackout}
        />
      </main>

      {/* 5. BOTTOM DOCK: INTERPLANETARY FLIGHT TRAJECTORY SLIDER */}
      <footer className="relative z-30 h-24 border-t border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl px-8 py-3 flex flex-col justify-between shrink-0 shadow-2xl">
        {/* Trajectory Header with Planets */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              🌍 Earth LEO Departure
            </span>
          </div>

          <div className="text-center font-bold">
            <span className="text-white text-sm">
              Mission Day: <strong className="text-cyan-400 text-base">{missionDay}</strong> / 500
            </span>
            <span className="text-slate-400 text-[11px] block">
              اسحبي المؤشر لترى اقتراب كوكب المريخ وتغير المؤشرات الحيوية للرائد
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              🔴 Mars Orbital Insertion
            </span>
          </div>
        </div>

        {/* The Flight Path Slider */}
        <div className="relative flex items-center my-1">
          <input
            type="range"
            min="1"
            max="500"
            value={missionDay}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMissionDay(val);
              if (val % 8 === 0) spaceAudio.playChirp();
            }}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          />
        </div>
      </footer>

      {/* 6. AI FLIGHT SURGEON DRAWER */}
      <AiFlightSurgeonDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        telemetry={telemetry}
        isCommBlackout={isCommBlackout}
      />

      {/* 7. NASA RISK SCENARIOS & SENSOR MATRIX MODAL */}
      <NasaRiskScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onSelectScenario={(sc) => {
          setActiveScenario(sc);
          setCountermeasureApplied(false);
        }}
      />
    </div>
  );
}
