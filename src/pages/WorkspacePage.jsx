import React, { useState } from 'react';
import {
  Activity, Zap, CheckCircle2, Radio, WifiOff, Eye, RotateCw,
  Bot, ShieldAlert, Sliders, User, Compass, FileText, ChevronRight
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
import RecordedTelemetry from '../components/RecordedTelemetry';

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
  const [activeMobileTab, setActiveMobileTab] = useState('telemetry'); // 'telemetry' | 'viewport' | 'countermeasures'

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-3 sm:px-6 py-2 select-none">
      {/* 1. Cockpit Header Bar */}
      <section className="p-3.5 sm:p-5 rounded-2xl bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Crew Selector */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#7AD7EA] shadow-[0_0_15px_rgba(122,215,234,0.3)] shrink-0">
            <img
              src={assetPath('astronaut_portrait.jpg')}
              alt={selectedCrew.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07111F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-titan text-sm text-[#F4F7FC] tracking-wide">{selectedCrew.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#7AD7EA]/20 text-[#7AD7EA] font-mono-tech font-bold">
                {selectedCrew.role}
              </span>
            </div>
            <div className="text-[10px] text-[#98A7BD] font-mono-tech mt-0.5">
              Mission: Artemis VII • Mars Transit Alpha
            </div>
          </div>
        </div>

        {/* Center: Mission Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono-tech">
          <div>
            <span className="text-[#98A7BD] block text-[9px]">DISTANCE</span>
            <strong className="text-[#F4F7FC] font-titan text-sm">{telemetry.distanceFromEarthKm}M km</strong>
          </div>
          <div>
            <span className="text-[#98A7BD] block text-[9px]">COMM DELAY (ONE-WAY)</span>
            <strong className={`font-titan text-sm ${isCommBlackout ? 'text-amber-400' : 'text-emerald-400'}`}>
              {telemetry.commDelayMinutes} min
            </strong>
          </div>
          <div>
            <span className="text-[#98A7BD] block text-[9px]">PHYSIOLOGICAL RISK</span>
            <strong className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${telemetry.riskColor}22`, color: telemetry.riskColor, border: `1px solid ${telemetry.riskColor}55` }}>
              {telemetry.riskLevel}
            </strong>
          </div>
        </div>

        {/* Right: Blackout Mode & Risks Button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={handleToggleBlackout}
            className={`px-3 py-2 rounded-xl text-[11px] font-mono-tech font-bold transition-all border flex items-center gap-1.5 min-h-[40px] ${
              isCommBlackout
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-[#0D1728] text-[#98A7BD] border-[rgba(180,210,235,0.14)] hover:text-[#F4F7FC]'
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
            className="px-3 py-2 rounded-xl bg-[#182A44] hover:bg-[#1f3657] text-[#E4783B] border border-[#E4783B]/30 text-[11px] font-mono-tech font-bold transition-all flex items-center gap-1.5 min-h-[40px]"
          >
            <ShieldAlert size={13} />
            <span>NASA RISKS</span>
          </button>
        </div>
      </section>

      {/* Mobile-Only Cockpit View Switcher Tabs (Visible on < lg screens) */}
      <div className="lg:hidden flex items-center p-1 bg-[#0D1728] rounded-2xl border border-[rgba(180,210,235,0.14)] gap-1 text-xs font-mono-tech">
        <button
          onClick={() => { spaceAudio.playChirp(); setActiveMobileTab('telemetry'); }}
          className={`flex-1 py-2.5 rounded-xl text-center font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'telemetry' ? 'bg-[#7AD7EA] text-[#07111F] shadow-md' : 'text-[#98A7BD] hover:text-[#F4F7FC]'
          }`}
        >
          <Activity size={14} />
          <span>القياسات</span>
        </button>
        <button
          onClick={() => { spaceAudio.playChirp(); setActiveMobileTab('viewport'); }}
          className={`flex-1 py-2.5 rounded-xl text-center font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'viewport' ? 'bg-[#7AD7EA] text-[#07111F] shadow-md' : 'text-[#98A7BD] hover:text-[#F4F7FC]'
          }`}
        >
          <Eye size={14} />
          <span>الرائد 3D</span>
        </button>
        <button
          onClick={() => { spaceAudio.playChirp(); setActiveMobileTab('countermeasures'); }}
          className={`flex-1 py-2.5 rounded-xl text-center font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'countermeasures' ? 'bg-[#7AD7EA] text-[#07111F] shadow-md' : 'text-[#98A7BD] hover:text-[#F4F7FC]'
          }`}
        >
          <Zap size={14} />
          <span>التدخلات</span>
        </button>
      </div>

      {/* 2. Cockpit Grid: Left Telemetry + Center 3D Astronaut + Right Countermeasures */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (col-span-4): Real-time Diagnostic Instruments */}
        <div className={`lg:col-span-4 space-y-3 ${activeMobileTab === 'telemetry' ? 'block' : 'hidden lg:block'}`}>
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
          <RecordedTelemetry />
        </div>

        {/* Center Column (col-span-5): 3D Zero-G Astronaut & Human Anatomy Explorer */}
        <div className={`lg:col-span-5 rounded-3xl bg-[#091322]/95 backdrop-blur-xl border border-[rgba(180,210,235,0.18)] shadow-2xl relative overflow-hidden flex flex-col min-h-[560px] sm:min-h-[620px] ${
          activeMobileTab === 'viewport' ? 'flex' : 'hidden lg:flex'
        }`}>
          <Astronaut3D
            telemetry={telemetry}
            scanMode={scanMode}
            setScanMode={setScanMode}
          />
        </div>

        {/* Right Column (col-span-3): Countermeasures & Flight Operations */}
        <div className={`lg:col-span-3 space-y-3 ${activeMobileTab === 'countermeasures' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-wider">
              OPERATIONAL PROTOCOLS
            </span>
            <span className="text-[9px] font-mono-tech text-emerald-400">STATUS: READY</span>
          </div>

          {/* ARED Pod Execution */}
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
                className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-95 text-[#0D0B0A] font-black text-xs font-cairo transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)] flex items-center justify-center gap-2"
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
              <span className="font-titan text-xs text-[#EBEBEB] uppercase">DSN TELEMETRY PACKET</span>
              <span className="text-[9px] font-mono-tech text-cyan-400">50 KB ENCODED</span>
            </div>

            <p className="text-[11px] text-[#ACACAC] leading-relaxed font-sans">
              Encrypted biometric diagnostic telemetry ready for Deep Space Network transmission to Houston Ground Control.
            </p>

            <button
              onClick={() => {
                spaceAudio.playChirp();
                setPacketSent(true);
                setTimeout(() => setPacketSent(false), 3000);
              }}
              className="w-full min-h-[44px] py-2 rounded-xl bg-[#252121] hover:bg-[#2e2927] text-[#EBEBEB] border border-white/10 text-xs font-mono-tech font-bold transition-all flex items-center justify-center gap-2"
            >
              <Radio size={13} className="text-[#E4783B]" />
              <span>{packetSent ? 'PACKET DISPATCHED TO DSN!' : 'TRANSMIT PACKET TO EARTH'}</span>
            </button>
          </div>

          {/* Quick Doctor Consultation Button */}
          <button
            onClick={() => {
              spaceAudio.playChirp();
              if (onOpenAiDrawer) onOpenAiDrawer();
            }}
            className="w-full min-h-[44px] py-3 rounded-2xl bg-[#171311] hover:bg-[#252121] text-[#E4783B] border border-[#E4783B]/40 text-xs font-mono-tech font-bold transition-all shadow-[0_0_15px_rgba(228,120,59,0.2)] flex items-center justify-center gap-2"
          >
            <Bot size={15} />
            <span>CONSULT AURA FLIGHT SURGEON</span>
          </button>
        </div>
      </section>
    </div>
  );
}
