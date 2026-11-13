import React, { useState } from 'react';
import {
  Activity, Zap, CheckCircle2, Radio, WifiOff, Eye, RotateCw,
  Bot, ShieldAlert, Sliders, User, Compass, FileText
} from 'lucide-react';
import Astronaut3D from '../Astronaut3D';
import {
  HemodynamicFluidWidget,
  TrabecularBoneWidget,
  NeuroOcularSANSWidget
} from '../SpaceTelemetryWidgets';
import { CREW_MEMBERS } from '../data/nasaKnowledgeBase';
import { spaceAudio } from '../utils/spaceAudio';
import { assetPath } from '../utils/assetPath';

export default function WorkspacePage({
  telemetry,
  missionDay,
  setMissionDay,
  currentPhase,
  setCurrentPhase,
  countermeasureApplied,
  handleApplyCountermeasure,
  handleResetCountermeasure,
  isCommBlackout,
  handleToggleBlackout,
  scanMode,
  setScanMode,
  selectedCrew,
  setSelectedCrew,
  onOpenAiDrawer,
  onOpenRisksModal
}) {
  const [packetSent, setPacketSent] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-2 select-none">
      {/* 1. Cockpit Header Bar */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#171311] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Crew Selector */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E4783B] shadow-[0_0_15px_rgba(228,120,59,0.3)]">
            <img
              src={assetPath('astronaut_portrait.jpg')}
              alt={selectedCrew.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0D0B0A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-titan text-sm text-[#EBEBEB] tracking-wide">{selectedCrew.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E4783B]/20 text-[#E4783B] font-mono-tech font-bold">
                {selectedCrew.role}
              </span>
            </div>
            <div className="text-[10px] text-[#808080] font-mono-tech mt-0.5">
              Mission: Artemis VII • Mars Transit Alpha
            </div>
          </div>
        </div>

        {/* Center: Mission Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono-tech">
          <div>
            <span className="text-[#808080] block text-[9px]">DISTANCE</span>
            <strong className="text-[#EBEBEB] font-titan text-sm">{telemetry.distanceFromEarthKm}M km</strong>
          </div>
          <div>
            <span className="text-[#808080] block text-[9px]">COMM DELAY (ONE-WAY)</span>
            <strong className={`font-titan text-sm ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
              {telemetry.commDelayMinutes} min
            </strong>
          </div>
          <div>
            <span className="text-[#808080] block text-[9px]">PHYSIOLOGICAL RISK</span>
            <strong className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${telemetry.riskColor}22`, color: telemetry.riskColor, border: `1px solid ${telemetry.riskColor}55` }}>
              {telemetry.riskLevel}
            </strong>
          </div>
        </div>

        {/* Right: Blackout Mode & Risks Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={handleToggleBlackout}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono-tech font-bold transition-all border flex items-center gap-1.5 ${
              isCommBlackout
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-[#0D0B0A] text-[#808080] border-white/10 hover:text-[#EBEBEB]'
            }`}
          >
            {isCommBlackout ? <WifiOff size={13} className="text-amber-400 animate-pulse" /> : <Radio size={13} className="text-emerald-400" />}
            <span>{isCommBlackout ? 'BLACKOUT: ACTIVE' : 'RADIO: ONLINE'}</span>
          </button>

          <button
            onClick={() => {
              spaceAudio.playChirp();
              if (onOpenRisksModal) onOpenRisksModal();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#252121] hover:bg-[#29201D] text-[#E4783B] border border-[#E4783B]/30 text-[11px] font-mono-tech font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldAlert size={13} />
            <span>NASA RISKS</span>
          </button>
        </div>
      </section>

      {/* 2. Cockpit Grid: Left Telemetry + Center 3D Astronaut + Right Countermeasures */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (col-span-4): Real-time Diagnostic Instruments */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-wider">
              BIOMEDICAL INSTRUMENTATION
            </span>
            <span className="text-[9px] font-mono-tech text-[#808080]">NASA-STD-3001</span>
          </div>

          <HemodynamicFluidWidget
            telemetry={telemetry}
            bpm={telemetry.currentHR}
            hrv={telemetry.currentHRV}
          />
          <TrabecularBoneWidget
            telemetry={telemetry}
            bmd={telemetry.bmdRetention}
          />
          <NeuroOcularSANSWidget
            telemetry={telemetry}
          />
        </div>

        {/* Center Column (col-span-5): 3D Zero-G Astronaut Viewport */}
        <div className="lg:col-span-5 rounded-3xl bg-[#171311] border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between z-20 relative">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-titan text-xs text-[#EBEBEB] uppercase tracking-wider">
                ZERO-G EVA SUIT VIEWPORT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  setScanMode(!scanMode);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-mono-tech font-bold border transition-all flex items-center gap-1 ${
                  scanMode
                    ? 'bg-[#E4783B] text-[#0D0B0A] border-[#E4783B] shadow-[0_0_15px_rgba(228,120,59,0.35)]'
                    : 'bg-[#0D0B0A] text-[#ACACAC] border-white/10 hover:text-[#EBEBEB]'
                }`}
              >
                <Eye size={12} />
                <span>{scanMode ? 'X-Ray: ON' : 'X-Ray Bio-Scan'}</span>
              </button>
            </div>
          </div>

          {/* 3D Canvas Container */}
          <div className="flex-1 w-full flex items-center justify-center p-2">
            <Astronaut3D
              telemetry={telemetry}
              scanMode={scanMode}
              setScanMode={setScanMode}
            />
          </div>

          {/* Bottom helper pill */}
          <div className="p-3 border-t border-white/[0.04] bg-[#0D0B0A]/80 flex items-center justify-between text-[10px] font-mono-tech text-[#808080] z-20 relative">
            <span>🖱️ اسحب بالماوس أو اللمس لتدوير الرائد 360°</span>
            <span className="text-[#E4783B]">DAY {missionDay} SIMULATION</span>
          </div>
        </div>

        {/* Right Column (col-span-3): Countermeasures & Flight Operations */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-wider">
              FLIGHT INTERVENTIONS
            </span>
            <span className="text-[9px] font-mono-tech text-[#808080]">ARED POD</span>
          </div>

          {/* ARED Prescription Deck */}
          <div className="p-4 rounded-2xl bg-[#171311] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-titan text-xs text-[#EBEBEB] uppercase">ARED RESISTIVE POD</span>
              <span className="text-[9px] font-mono-tech text-[#E4783B] px-1.5 py-0.5 rounded bg-[#E4783B]/15 border border-[#E4783B]/30">
                12.5% LOAD CALIBRATION
              </span>
            </div>

            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/10">
              <img
                src={assetPath('ared_exercise.jpg')}
                alt="ARED Resistive Exercise"
                className="w-full h-full object-cover filter brightness-105 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-2 left-2 right-2 text-right">
                <span className="text-[9px] font-mono-tech text-[#E4783B] font-bold block">
                  HYDRAULIC SQUAT & DEADLIFT
                </span>
                <p className="text-[10px] text-[#EBEBEB] font-cairo truncate">
                  تدريب الأثقال الفضائية بالضغط الهيدروليكي لمنع تآكل العظام
                </p>
              </div>
            </div>

            {!countermeasureApplied ? (
              <button
                onClick={handleApplyCountermeasure}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-95 text-[#0D0B0A] font-black text-xs font-cairo transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)] flex items-center justify-center gap-2"
              >
                <Zap size={14} />
                <span>تطبيق بروتوكول التدخل الفضائي</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-bold text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-cairo text-[11px]">
                  <CheckCircle2 size={15} />
                  تم تفعيل البروتوكول واستقرار المؤشرات!
                </span>
                <button
                  onClick={handleResetCountermeasure}
                  className="text-[10px] text-[#808080] hover:text-[#EBEBEB] underline ml-2"
                >
                  إعادة
                </button>
              </div>
            )}
          </div>

          {/* DSN Telemetry Uplink Packet */}
          <div className="p-4 rounded-2xl bg-[#171311] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-titan text-xs text-[#EBEBEB] uppercase">DSN DATA DISPATCH</span>
              <Radio size={13} className="text-[#E4783B]" />
            </div>
            <p className="text-[11px] text-[#808080] leading-relaxed">
              Compile current vital telemetry and diagnostic images into an encrypted 50KB Deep Space Network payload for Houston Mission Control.
            </p>
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setPacketSent(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#252121] hover:bg-[#29201D] text-[#EBEBEB] border border-white/10 text-xs font-mono-tech font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <FileText size={13} className="text-[#E4783B]" />
              <span>{packetSent ? 'ENCRYPTED PACKET SENT (50KB)' : 'DISPATCH DSN PACKET'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Trajectory Timeline Scrubber */}
      <section className="p-5 rounded-2xl bg-[#171311] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-titan text-xs text-[#E4783B] uppercase">
            MISSION TIMELINE
          </span>
          <span className="text-[10px] font-mono-tech text-[#808080]">
            DAY {missionDay} OF 500 (ARTEMIS VII MARS TRANSIT)
          </span>
        </div>

        <div className="w-full md:w-1/2 flex items-center gap-3">
          <span className="text-[10px] font-mono-tech text-[#808080] shrink-0">DAY 1</span>
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
            className="w-full h-1.5 bg-[#0D0B0A] rounded-lg appearance-none cursor-pointer accent-[#E4783B]"
          />
          <span className="text-[10px] font-mono-tech text-[#808080] shrink-0">DAY 500</span>
        </div>
      </section>
    </div>
  );
}
