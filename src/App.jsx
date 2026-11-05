import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart, Activity, Brain, Bone, ShieldAlert, ShieldCheck,
  Radio, WifiOff, Clock, User, Sparkles, ChevronRight,
  RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, Bot,
  Sliders, Compass, Eye, Flame, Award, Maximize2, Volume2, VolumeX,
  Box, Sparkle
} from 'lucide-react';

import {
  NASA_REFERENCES,
  CREW_MEMBERS,
  calculateSpacePhysiology
} from './data/nasaKnowledgeBase';
import BioTwinVisualizer from './BioTwinVisualizer';
import ThreeBioTwin3D from './ThreeBioTwin3D';
import SpaceNebulaCanvas from './SpaceNebulaCanvas';
import DualWaveChart from './DualWaveChart';
import NasaCitationModal from './NasaCitationModal';
import AiFlightSurgeonDrawer from './AiFlightSurgeonDrawer';
import { spaceAudio } from './utils/spaceAudio';

export default function App() {
  // Mission & Crew State
  const [selectedCrew, setSelectedCrew] = useState(CREW_MEMBERS[0]);
  const [missionDay, setMissionDay] = useState(180); // Default to deep space cruise for instant impact
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(6);
  const [sleepQuality, setSleepQuality] = useState(6);
  const [countermeasureApplied, setCountermeasureApplied] = useState(false);
  const [isCommBlackout, setIsCommBlackout] = useState(true); // Default to showcase offline autonomous autonomy

  // UI State
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [countermeasureAnimation, setCountermeasureAnimation] = useState(false);
  const [viewMode, setViewMode] = useState('3d');
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic Telemetry Calculation
  const telemetry = useMemo(() => {
    return calculateSpacePhysiology({
      missionDay,
      fatigue,
      stress,
      sleepQuality,
      countermeasureApplied,
      crew: selectedCrew
    });
  }, [missionDay, fatigue, stress, sleepQuality, countermeasureApplied, selectedCrew]);

  // Execute Countermeasure Action
  const handleApplyCountermeasure = () => {
    spaceAudio.playChirp();
    spaceAudio.playBeep(1800, 0.15);
    setCountermeasureAnimation(true);
    setCountermeasureApplied(true);
    setTimeout(() => {
      setCountermeasureAnimation(false);
    }, 1200);
  };

  const handleResetCountermeasure = () => {
    spaceAudio.playBeep(900, 0.1);
    setCountermeasureApplied(false);
  };

  // Presets
  const setMissionPhase = (day, f = 3, s = 3, sl = 8) => {
    spaceAudio.playChirp();
    setMissionDay(day);
    setFatigue(f);
    setStress(s);
    setSleepQuality(sl);
    setCountermeasureApplied(false);
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
      className="relative w-full h-screen bg-[#060913] text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Animated Deep-Space Background with Planets and Warp Stars */}
      <SpaceNebulaCanvas missionDay={missionDay} />

      {/* ─────────────────────────────────────────────────────────────
          1. TOP TELEMETRY BAR (Height: 56px)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 h-14 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 shadow-md">
        {/* Left: Branding & NASA Challenge badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Activity size={18} className="text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm tracking-wider text-white">ASTRO</span>
                <span className="font-black text-sm tracking-wider text-cyan-400">VITALS</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold border border-cyan-500/40">
                  CHALLENGE #5
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono tracking-tight block">
                NASA Space Apps 2026 • Autonomous Flight Surgeon OS
              </span>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-800" />

          {/* Crew Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono">
            <User size={13} className="text-cyan-400" />
            <select
              value={selectedCrew.id}
              onChange={(e) => {
                const found = CREW_MEMBERS.find((c) => c.id === e.target.value);
                if (found) setSelectedCrew(found);
              }}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {CREW_MEMBERS.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name} ({c.role.split('&')[0]})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-cyan-400 px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 font-bold">
              {selectedCrew.bloodType}
            </span>
          </div>
        </div>

        {/* Center: Mission Telemetry (Time, Distance, Delay) */}
        <div className="hidden md:flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock size={13} className="text-cyan-400" />
            <span className="text-slate-500">MET:</span>
            <span className="text-white font-bold">Day {telemetry.missionDay}, 14:22:09 UTC</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Compass size={13} className="text-purple-400" />
            <span className="text-slate-500">Distance:</span>
            <span className="text-white font-bold">{telemetry.distanceFromEarthKm}M km</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio size={13} className={isCommBlackout ? "text-amber-400 animate-pulse" : "text-emerald-400"} />
            <span className="text-slate-500">1-Way Lag:</span>
            <span className={`font-bold ${isCommBlackout ? "text-amber-300" : "text-emerald-400"}`}>
              {telemetry.commDelayMinutes} min
            </span>
          </div>
        </div>

        {/* Right: Comm Blackout Toggle & AI Surgeon Drawer trigger */}
        <div className="flex items-center gap-2.5">
          {/* Comm Blackout Button */}
          <button
            onClick={() => {
              const nextState = !isCommBlackout;
              setIsCommBlackout(nextState);
              if (nextState) {
                spaceAudio.playEmergencyAlarm();
              } else {
                spaceAudio.playBeep(1200, 0.1);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              isCommBlackout
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Mars Comm Blackout Simulation"
          >
            {isCommBlackout ? (
              <>
                <WifiOff size={14} className="text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">MARS BLACKOUT: ACTIVE</span>
                <span className="sm:hidden">BLACKOUT</span>
              </>
            ) : (
              <>
                <Radio size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">EARTH LINK NOMINAL</span>
                <span className="sm:hidden">ONLINE</span>
              </>
            )}
          </button>

          {/* AI Surgeon Button */}
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setIsAiDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105"
          >
            <Bot size={14} />
            <span className="hidden sm:inline">AI Flight Surgeon</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl border text-xs font-mono transition-all ${
              !isMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={isMuted ? "Unmute Audio Synthesizer" : "Mute Audio Synthesizer"}
          >
            {!isMuted ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullScreen}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 text-xs font-mono transition-all"
            title="Toggle Cockpit Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN COCKPIT BODY (12-Column Responsive Layout)
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* ── LEFT PANEL (3 Columns): Live Vitals & Baseline Drift ── */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-2.5 justify-between overflow-hidden">
          {/* Top Left: 4 Microgravity Vital Stat Cards */}
          <div className="grid grid-cols-2 gap-2">
            {/* Heart Rate Card */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
                <span className="flex items-center gap-1">
                  <Heart size={12} className="text-rose-400 animate-pulse" />
                  HEART RATE
                </span>
                <span className="text-[9px] text-slate-500">Base: {telemetry.baseline.restingHR}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-white">
                  {telemetry.currentHR}
                  <span className="text-xs text-slate-400 font-normal ml-1">BPM</span>
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: telemetry.currentHR > 85 ? '#FF2A5522' : '#00F0FF22',
                    color: telemetry.currentHR > 85 ? '#FF2A55' : '#00F0FF'
                  }}
                >
                  +{telemetry.hrDriftPct}%
                </span>
              </div>
            </div>

            {/* Resting HRV Card */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
                <span className="flex items-center gap-1">
                  <Activity size={12} className="text-cyan-400" />
                  RESTING HRV
                </span>
                <span className="text-[9px] text-slate-500">Base: {telemetry.baseline.restingHRV}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-white">
                  {telemetry.currentHRV}
                  <span className="text-xs text-slate-400 font-normal ml-1">ms</span>
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: telemetry.currentHRV < 35 ? '#FF2A5522' : '#00F0FF22',
                    color: telemetry.currentHRV < 35 ? '#FF2A55' : '#00F0FF'
                  }}
                >
                  {telemetry.hrvDriftPct}%
                </span>
              </div>
            </div>

            {/* Blood Pressure Card */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
                <span>ARTERIAL BP</span>
                <span className="text-[9px] text-slate-500">Cephalad</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black font-mono text-white">
                  {telemetry.currentSystolic}/{telemetry.currentDiastolic}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">mmHg</span>
                </span>
              </div>
            </div>

            {/* BMD Retention Card */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
                <span className="flex items-center gap-1">
                  <Bone size={12} className="text-amber-400" />
                  BMD LEVEL
                </span>
                <span className="text-rose-400 text-[9px]">-{telemetry.bmdLoss}%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black font-mono text-white">
                  {telemetry.bmdRetention}%
                  <span className="text-[10px] text-slate-400 font-normal ml-1">Trabecular</span>
                </span>
              </div>
            </div>
          </div>

          {/* Dual-Wave Baseline Drift Chart */}
          <div className="flex-1 flex flex-col justify-end">
            <DualWaveChart telemetry={telemetry} />
          </div>

          {/* Offline Autonomous Operating Notice */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Local Neural Heuristics:
            </span>
            <span className="text-cyan-300 font-bold">NASA-STD-3001 ACTIVE</span>
          </div>
        </section>

        {/* ── CENTER STAGE (5 Columns): 3D Volumetric Three.js Bio-Twin / 2D X-Ray ── */}
        <section className="col-span-12 lg:col-span-5 flex flex-col items-center justify-between bg-slate-900/40 border border-cyan-500/20 rounded-2xl backdrop-blur-md p-3 relative overflow-hidden shadow-2xl">
          {/* Top Switcher: 3D Hologram vs 2D Schematic */}
          <div className="absolute top-3 right-3 z-30 flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-cyan-500/30 text-[10px] font-mono shadow-lg">
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setViewMode('3d');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                viewMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box size={10} />
              <span>3D WebGL</span>
            </button>
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setViewMode('2d');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D X-Ray
            </button>
          </div>

          {viewMode === '3d' ? (
            <ThreeBioTwin3D
              telemetry={telemetry}
              selectedSystem={selectedSystem}
              setSelectedSystem={setSelectedSystem}
              onOrganClick={(systemId) => {
                setSelectedSystem(systemId);
                const ref = NASA_REFERENCES.find((r) => r.system === systemId);
                if (ref) setSelectedCitation(ref);
              }}
            />
          ) : (
            <BioTwinVisualizer
              telemetry={telemetry}
              selectedSystem={selectedSystem}
              setSelectedSystem={setSelectedSystem}
              onOrganClick={(systemId) => {
                setSelectedSystem(systemId);
                const ref = NASA_REFERENCES.find((r) => r.system === systemId);
                if (ref) setSelectedCitation(ref);
              }}
            />
          )}
        </section>

        {/* ── RIGHT PANEL (4 Columns): Behavioral Check-In + Countermeasures ── */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-2.5 justify-between overflow-hidden">
          {/* Top Half: Crew Self-Report Behavioral Check-In */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Brain size={14} className="text-cyan-400" />
                <span>Behavioral & Fatigue Telemetry</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                Score: <strong className="text-cyan-300">{telemetry.behavioralScore}/100</strong>
              </span>
            </div>

            {/* 3 Interactive Sliders for Astronaut Daily Check-In */}
            <div className="space-y-2.5 text-[11px] font-mono">
              {/* Fatigue Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Physical & Mental Fatigue</span>
                  <span className="text-white font-bold">{fatigue} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fatigue}
                  onChange={(e) => setFatigue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Stress & Isolation Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Confinement & Mission Stress</span>
                  <span className="text-white font-bold">{stress} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Sleep Quality Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Sleep Efficiency (Circadian)</span>
                  <span className="text-white font-bold">{sleepQuality} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Bottom Half: Autonomous Prescription & NASA Evidence Engine */}
          <div className="flex-1 p-3.5 bg-slate-900/60 border border-slate-800/90 rounded-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Autonomous Prescriptions</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">NASA HRP Grounded</span>
              </div>

              {/* Active Prescription Card */}
              <div className="space-y-2">
                {NASA_REFERENCES.slice(0, 2).map((ref) => (
                  <div
                    key={ref.id}
                    className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-left transition-all hover:border-cyan-500/40"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                        {ref.documentCode.split(' / ')[0]}
                      </span>
                      <button
                        onClick={() => setSelectedCitation(ref)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-mono"
                      >
                        Evidence <ExternalLink size={10} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {ref.autonomousProtocol}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button: Execute Countermeasure Protocol */}
            <div className="mt-3">
              {!countermeasureApplied ? (
                <button
                  onClick={handleApplyCountermeasure}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} className={countermeasureAnimation ? "animate-spin" : ""} />
                  <span>Execute Countermeasure Protocol</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    Protocol Active: Vitals Stabilizing
                  </span>
                  <button
                    onClick={handleResetCountermeasure}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM MISSION DOCK: Stress-Test Slider (Height: 74px)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 h-20 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl px-6 py-2 flex flex-col justify-between shrink-0 shadow-2xl">
        {/* Slider Title & Mission Phases */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sliders size={13} className="text-cyan-400" />
            <span className="text-slate-300 font-bold uppercase tracking-wide">
              Mission Day Stress-Test Simulator
            </span>
            <span className="text-cyan-400 font-black text-sm ml-1">Day {missionDay} of 500</span>
          </div>

          {/* Preset Buttons for Judges */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 mr-1">PRESETS:</span>
            <button
              onClick={() => setMissionPhase(1, 2, 2, 9)}
              className={`px-2 py-0.5 rounded font-mono transition-all ${
                missionDay === 1
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day 1: Launch
            </button>
            <button
              onClick={() => setMissionPhase(90, 4, 4, 7)}
              className={`px-2 py-0.5 rounded font-mono transition-all ${
                missionDay === 90
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day 90: Departure
            </button>
            <button
              onClick={() => setMissionPhase(180, 7, 7, 5)}
              className={`px-2 py-0.5 rounded font-mono transition-all ${
                missionDay === 180
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day 180: Deep Space Cruise
            </button>
            <button
              onClick={() => setMissionPhase(340, 9, 8, 4)}
              className={`px-2 py-0.5 rounded font-mono transition-all ${
                missionDay === 340
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day 340: Radiation Storm
            </button>
            <button
              onClick={() => setMissionPhase(500, 6, 6, 6)}
              className={`px-2 py-0.5 rounded font-mono transition-all ${
                missionDay === 500
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day 500: Mars Orbit
            </button>
          </div>
        </div>

        {/* The Continuous Scrubbing Slider */}
        <div className="relative flex items-center">
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
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-inner"
          />
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          4. MODALS & DRAWERS
      ───────────────────────────────────────────────────────────── */}
      <NasaCitationModal
        reference={selectedCitation}
        isOpen={!!selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />

      <AiFlightSurgeonDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        telemetry={telemetry}
        isCommBlackout={isCommBlackout}
      />
    </div>
  );
}
